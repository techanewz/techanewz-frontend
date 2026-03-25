// ============================================
// News Types
// ============================================

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  image: string;
  citation: string;
  tags: string[];
  source: string;
  publishedAt: string;
  fetchedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: Pagination;
  timestamp: string;
}

export interface ApiError {
  success: false;
  message: string;
  error: string;
  timestamp: string;
}

// ============================================
// User Types
// ============================================

export interface User {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  createdAt: string;
  accountType?: 'google' | 'email';
}

export interface UserPreferences {
  preferredTags: string[];
  notificationsEnabled: boolean;
}

// ============================================
// Feed Types
// ============================================

export interface FeedParams {
  userId: string;
  page?: number;
  limit?: number;
}

export interface TagFilterParams {
  tags: string[];
  page?: number;
  limit?: number;
}

// ============================================
// UI State Types
// ============================================

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export type TabType = 'home' | 'explore' | 'profile';
