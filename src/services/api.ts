import axios, { AxiosInstance, AxiosError } from 'axios';
import type { ApiResponse, ApiError, NewsItem, FeedParams, TagFilterParams } from '@/types';
import { getAccessToken } from '@/services/auth';

// ============================================
// API Configuration
// ============================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Attach Mudra Bearer token when available (authenticated requests)
    this.client.interceptors.request.use((config) => {
      const token = getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError<ApiError>): Error {
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.message || 'An error occurred';
      return new Error(message);
    } else if (error.request) {
      // Request made but no response
      return new Error('Network error. Please check your connection.');
    } else {
      // Error in request setup
      return new Error('An unexpected error occurred');
    }
  }

  // ============================================
  // News Data Normalization
  // ============================================

  /**
   * Normalize news item to ensure id field is always present
   * Handles cases where API returns _id instead of id (MongoDB/Mongoose)
   */
  private normalizeNewsItem(item: any): NewsItem {
    return {
      ...item,
      id: item.id || item._id || '',
    };
  }

  /**
   * Normalize array of news items
   */
  private normalizeNewsItems(items: any[]): NewsItem[] {
    return items.map((item) => this.normalizeNewsItem(item));
  }

  // ============================================
  // News Endpoints
  // ============================================

  /**
   * Get personalized news feed for a user
   */
  async getNewsFeed(params: FeedParams): Promise<ApiResponse<NewsItem[]>> {
    const { userId, page = 1, limit = 10 } = params;
    const response = await this.client.get<ApiResponse<NewsItem[]>>('/api/news/feed', {
      params: { userId, page, limit },
    });
    if (response.data.data && Array.isArray(response.data.data)) {
      response.data.data = this.normalizeNewsItems(response.data.data);
    }
    return response.data;
  }

  /**
   * Get all news without user filtering
   */
  async getAllNews(page = 1, limit = 10): Promise<ApiResponse<NewsItem[]>> {
    const response = await this.client.get<ApiResponse<NewsItem[]>>('/api/news', {
      params: { page, limit },
    });
    if (response.data.data && Array.isArray(response.data.data)) {
      response.data.data = this.normalizeNewsItems(response.data.data);
    }
    return response.data;
  }

  /**
   * Get a single news item by ID
   */
  async getNewsById(newsId: string): Promise<ApiResponse<NewsItem>> {
    const response = await this.client.get<ApiResponse<NewsItem>>(`/api/news/${newsId}`);
    if (response.data.data) {
      response.data.data = this.normalizeNewsItem(response.data.data);
    }
    return response.data;
  }

  /**
   * Get news filtered by tags
   */
  async getNewsByTags(params: TagFilterParams): Promise<ApiResponse<NewsItem[]>> {
    const { tags, page = 1, limit = 10 } = params;
    const tagsString = tags.join(',');
    const response = await this.client.get<ApiResponse<NewsItem[]>>('/api/news/tags', {
      params: { tags: tagsString, page, limit },
    });
    if (response.data.data && Array.isArray(response.data.data)) {
      response.data.data = this.normalizeNewsItems(response.data.data);
    }
    return response.data;
  }

  /**
   * Mark a news item as viewed by user
   */
  async markNewsAsViewed(newsId: string, userId: string): Promise<ApiResponse<null>> {
    if (!newsId || newsId === 'undefined' || newsId.trim() === '') {
      throw new Error('Valid news ID is required');
    }
    const response = await this.client.post<ApiResponse<null>>(`/api/news/${newsId}/view`, {
      userId,
    });
    return response.data;
  }

  /**
   * Migrate guest read history to the authenticated Mudra user account.
   * Requires a valid Mudra Bearer token (attached automatically by the request interceptor).
   */
  async migrateGuestSession(guestUserId: string): Promise<void> {
    await this.client.post('/api/auth/migrate', { guestUserId });
  }
}

// Export singleton instance
export const apiService = new ApiService();

// ============================================
// Helper Functions
// ============================================

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`;
  }

  return date.toLocaleDateString();
};

/**
 * Extract domain from URL
 */
export const extractDomain = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url;
  }
};

/**
 * Generate a unique user ID (stored in localStorage)
 */
export const getUserId = (): string => {
  const storageKey = 'techanewz_user_id';
  let userId = localStorage.getItem(storageKey);
  
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(storageKey, userId);
  }
  
  return userId;
};

/**
 * Save user preferences
 */
export const saveUserPreferences = (preferences: Record<string, unknown>): void => {
  localStorage.setItem('techanewz_preferences', JSON.stringify(preferences));
};

/**
 * Get user preferences
 */
export const getUserPreferences = (): Record<string, unknown> | null => {
  const prefs = localStorage.getItem('techanewz_preferences');
  return prefs ? JSON.parse(prefs) : null;
};
