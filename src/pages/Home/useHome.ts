import { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/services/api';
import { useUser } from '@/contexts/UserContext';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import type { NewsItem, Pagination } from '@/types';

// ============================================
// Custom Hook for Home Page Logic
// ============================================

export const useHome = () => {
  const { userId } = useUser();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    hasMore: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial news feed
  const fetchNews = useCallback(async (page = 1) => {
    try {
      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      
      setError(null);

      const response = await apiService.getNewsFeed({
        userId,
        page,
        limit: 10,
      });

      if (response.success && response.data) {
        if (page === 1) {
          setNews(response.data);
        } else {
          setNews((prev) => [...prev, ...response.data]);
        }

        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load news';
      setError(errorMessage);
      console.error('Error fetching news:', err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [userId]);

  // Load initial news on mount
  useEffect(() => {
    if (userId) {
      fetchNews(1);
    }
  }, [userId, fetchNews]);

  // Load more news
  const loadMore = useCallback(() => {
    if (pagination.hasMore && !isLoadingMore) {
      fetchNews(pagination.page + 1);
    }
  }, [pagination, isLoadingMore, fetchNews]);

  // Infinite scroll hook
  const sentinelRef = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore: pagination.hasMore,
    isLoading: isLoadingMore,
  });

  // Handle news view
  const handleNewsView = useCallback(async (newsId: string) => {
    try {
      await apiService.markNewsAsViewed(newsId, userId);
      
      // Optionally remove viewed news from feed
      // setNews((prev) => prev.filter((item) => item.id !== newsId));
    } catch (err) {
      console.error('Error marking news as viewed:', err);
    }
  }, [userId]);

  return {
    news,
    isLoading,
    isLoadingMore,
    error,
    hasMore: pagination.hasMore,
    sentinelRef,
    handleNewsView,
  };
};
