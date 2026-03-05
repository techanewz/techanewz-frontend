import { useState, useEffect, useCallback, useMemo } from 'react';
import { apiService } from '@/services/api';
import { useUser } from '@/contexts/UserContext';
import type { NewsItem } from '@/types';

// ============================================
// Available Tags
// ============================================

const AVAILABLE_TAGS = [
  'AI',
  'Machine Learning',
  'Web Development',
  'Mobile',
  'Cloud',
  'DevOps',
  'Cybersecurity',
  'Blockchain',
  'IoT',
  'Data Science',
  'Programming',
  'Startups',
  'Tech Industry',
  'Software',
  'Hardware',
  'Frontend',
  'Backend',
  'Database',
  'API',
  'Framework',
  'React',
  'JavaScript',
  'Python',
  'TypeScript',
];

// ============================================
// Custom Hook for Explore Page Logic
// ============================================

export const useExplore = () => {
  const { userId } = useUser();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tags based on search query
  const filteredTags = useMemo(() => {
    if (!searchQuery.trim()) {
      return AVAILABLE_TAGS;
    }
    return AVAILABLE_TAGS.filter((tag) =>
      tag.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Fetch news by tags
  const fetchNewsByTags = useCallback(async (tags: string[]) => {
    if (tags.length === 0) {
      setNews([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await apiService.getNewsByTags({
        tags,
        page: 1,
        limit: 50, // Get more results for explore page
      });

      if (response.success && response.data) {
        setNews(response.data);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load news';
      setError(errorMessage);
      console.error('Error fetching news by tags:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle tag selection
  const handleTagToggle = useCallback((tag: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  }, []);

  // Fetch news when selected tags change
  useEffect(() => {
    if (selectedTags.length > 0) {
      fetchNewsByTags(selectedTags);
    } else {
      setNews([]);
    }
  }, [selectedTags, fetchNewsByTags]);

  // Handle news view
  const handleNewsView = useCallback(async (newsId: string) => {
    try {
      await apiService.markNewsAsViewed(newsId, userId);
    } catch (err) {
      console.error('Error marking news as viewed:', err);
    }
  }, [userId]);

  return {
    news,
    isLoading,
    error,
    selectedTags,
    availableTags: AVAILABLE_TAGS,
    handleTagToggle,
    handleNewsView,
    searchQuery,
    setSearchQuery,
    filteredTags,
  };
};
