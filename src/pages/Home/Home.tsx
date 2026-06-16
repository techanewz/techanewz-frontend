import { useRef, useEffect } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import { Layout } from '@/components/Layout/Layout';
import { NewsCard } from '@/components/NewsCard/NewsCard';
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner';
import { SwipeHint } from '@/components/SwipeHint/SwipeHint';
import { useHome } from './useHome';
import styles from './Home.module.scss';

// ============================================
// Skeleton card — matches the NewsCard layout while the feed loads
// ============================================

const SkeletonCard = () => (
  <div className={styles.skeletonCard} aria-hidden="true">
    <div className={styles.skelImage} />
    <div className={styles.skelBody}>
      <div className={styles.skelLine} style={{ width: '92%' }} />
      <div className={styles.skelLine} style={{ width: '70%' }} />
      <div className={styles.skelLineSm} style={{ width: '100%' }} />
      <div className={styles.skelLineSm} style={{ width: '88%' }} />
      <div className={styles.skelTags}>
        <span className={styles.skelTag} />
        <span className={styles.skelTag} />
        <span className={styles.skelTag} />
      </div>
    </div>
  </div>
);

// ============================================
// Home Page Component
// ============================================

export const Home = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const {
    news,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    sentinelRef,
    handleNewsView,
  } = useHome();

  // Live reading-progress bar — writes directly to the DOM via rAF (no re-render)
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const max = el.scrollHeight - el.clientHeight;
      const p = max > 0 ? Math.min(1, el.scrollTop / max) : 0;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${p})`;
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      el.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [news.length]);

  return (
    <Layout title="TechShup">
      {/* Reading-progress bar (mobile immersive feed) */}
      <div className={styles.progressTrack} aria-hidden="true">
        <div ref={progressRef} className={styles.progressFill} />
      </div>

      <div ref={scrollContainerRef} className={styles.home}>
        {/* Loading State — skeletons that match the feed */}
        {isLoading && news.length === 0 ? (
          <div className={styles.skeletonFeed}>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : null}

        {/* Error State */}
        {error && news.length === 0 ? (
          <div className={styles.errorContainer}>
            <div className={styles.stateIcon}>
              <FiAlertTriangle size={26} />
            </div>
            <h2 className={styles.errorTitle}>Something went wrong</h2>
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
                  <span>You're all caught up</span>
                </div>
              )}
            </div>
          </div>
        ) : null}

        {/* First-time hint: how to see next news (mobile only, once per device) */}
        {news.length > 0 ? (
          <SwipeHint scrollContainerRef={scrollContainerRef} />
        ) : null}
      </div>
    </Layout>
  );
};
