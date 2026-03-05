import { Layout } from '@/components/Layout/Layout';
import { NewsCard } from '@/components/NewsCard/NewsCard';
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner';
import { useExplore } from './useExplore';
import styles from './Explore.module.scss';
import { FiSearch } from 'react-icons/fi';

// ============================================
// Explore Page Component
// ============================================

export const Explore = () => {
  const {
    news,
    isLoading,
    error,
    selectedTags,
    availableTags,
    handleTagToggle,
    handleNewsView,
    searchQuery,
    setSearchQuery,
    filteredTags,
  } = useExplore();

  return (
    <Layout title="Explore">
      <div className={styles.explore}>
        <div className={styles.container}>
          {/* Header */}
          <div className={styles.header}>
            <h1 className={styles.title}>Explore Topics</h1>
            <p className={styles.subtitle}>
              Discover news from your favorite tech categories
            </p>
          </div>

          {/* Search Bar */}
          <div className={styles.searchContainer}>
            <div className={styles.searchWrapper}>
              <FiSearch className={styles.searchIcon} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Tags Section */}
          <div className={styles.tagsSection}>
            <div className={styles.tagsSectionHeader}>
              <h2 className={styles.tagsTitle}>Categories</h2>
              {selectedTags.length > 0 && (
                <button
                  className={styles.clearButton}
                  onClick={() => selectedTags.forEach(handleTagToggle)}
                >
                  Clear all ({selectedTags.length})
                </button>
              )}
            </div>

            <div className={styles.tagsGrid}>
              {filteredTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    className={`${styles.tagButton} ${isSelected ? styles.selected : ''}`}
                    onClick={() => handleTagToggle(tag)}
                  >
                    <span>{tag}</span>
                    {isSelected && <span className={styles.checkmark}>✓</span>}
                  </button>
                );
              })}
            </div>

            {searchQuery && filteredTags.length === 0 && (
              <div className={styles.noResults}>
                <p>No categories found for "{searchQuery}"</p>
              </div>
            )}
          </div>

          {/* Selected Tags Info */}
          {selectedTags.length > 0 && (
            <div className={styles.selectedInfo}>
              <span className={styles.selectedText}>
                Showing news for: {selectedTags.join(', ')}
              </span>
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className={styles.loadingContainer}>
              <LoadingSpinner size="lg" />
              <p className={styles.loadingText}>Loading news...</p>
            </div>
          ) : null}

          {/* Error State */}
          {error ? (
            <div className={styles.errorContainer}>
              <div className={styles.errorIcon}>⚠️</div>
              <h2 className={styles.errorTitle}>Oops! Something went wrong</h2>
              <p className={styles.errorMessage}>{error}</p>
            </div>
          ) : null}

          {/* Empty State */}
          {!isLoading && !error && selectedTags.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🔍</div>
              <h2 className={styles.emptyTitle}>Select Topics to Explore</h2>
              <p className={styles.emptyMessage}>
                Choose one or more categories above to discover relevant news
              </p>
            </div>
          ) : null}

          {/* No Results */}
          {!isLoading && !error && selectedTags.length > 0 && news.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📭</div>
              <h2 className={styles.emptyTitle}>No News Found</h2>
              <p className={styles.emptyMessage}>
                Try selecting different categories
              </p>
            </div>
          ) : null}

          {/* News Grid */}
          {news.length > 0 ? (
            <>
              <div className={styles.resultsHeader}>
                <span className={styles.resultsCount}>
                  {news.length} article{news.length !== 1 ? 's' : ''} found
                </span>
              </div>

              <div className={styles.newsGrid}>
                {news.map((item) => (
                  <NewsCard
                    key={item.id}
                    news={item}
                    onView={handleNewsView}
                  />
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </Layout>
  );
};
