import { Layout } from '@/components/Layout/Layout';
import { NewsCard } from '@/components/NewsCard/NewsCard';
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner';
import { useHome } from './useHome';
import styles from './Home.module.scss';

// ============================================
// Home Page Component
// ============================================

export const Home = () => {
  const {
    news,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    sentinelRef,
    handleNewsView,
  } = useHome();

  return (
    <Layout title="TechaNewz">
      <div className={styles.home}>
        {/* Loading State */}
        {isLoading && news.length === 0 ? (
          <div className={styles.loadingContainer}>
            <LoadingSpinner size="lg" />
            <p className={styles.loadingText}>Loading latest news...</p>
          </div>
        ) : null}

        {/* Error State */}
        {error && news.length === 0 ? (
          <div className={styles.errorContainer}>
            <div className={styles.errorIcon}>⚠️</div>
            <h2 className={styles.errorTitle}>Oops! Something went wrong</h2>
            <p className={styles.errorMessage}>{error}</p>
            <button
              className={styles.retryButton}
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        ) : null}

        {/* News Feed - Single Item Scroll View */}
        {news.length > 0 ? (
          <div className={styles.newsScrollContainer}>
            {news.map((item) => (
              <div key={item.id} className={styles.newsItemWrapper}>
                <NewsCard
                  news={item}
                  onView={handleNewsView}
                  autoMarkAsViewed={true}
                />
              </div>
            ))}

            {/* Infinite Scroll Sentinel */}
            <div ref={sentinelRef} className={styles.sentinel}>
              {isLoadingMore && (
                <div className={styles.loadingMore}>
                  <LoadingSpinner size="md" />
                  <span>Loading more news...</span>
                </div>
              )}
              
              {!hasMore && news.length > 0 && (
                <div className={styles.endMessage}>
                  <span>You're all caught up! 🎉</span>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </Layout>
  );
};
