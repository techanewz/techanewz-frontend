import { useState, useEffect, useRef } from 'react';
import { FiExternalLink, FiClock, FiTag, FiArrowUpRight } from 'react-icons/fi';
import styles from './NewsCard.module.scss';
import { formatRelativeTime, extractDomain } from '@/services/api';
import type { NewsItem } from '@/types';

// ============================================
// Component Props
// ============================================

interface NewsCardProps {
  news: NewsItem;
  onView?: (newsId: string) => void;
  onImageError?: () => void;
  autoMarkAsViewed?: boolean; // Automatically mark as viewed when visible
}

// ============================================
// NewsCard Component
// ============================================

export const NewsCard = ({
  news,
  onView,
  onImageError,
  autoMarkAsViewed = true,
}: NewsCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);
  // Drives the staggered content reveal once the card scrolls into focus
  const [revealed, setRevealed] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  const hasBeenViewedRef = useRef(false);

  // Ensure we have a valid ID (handle both 'id' and '_id' from API)
  const newsId = news.id || (news as any)._id;

  // Single observer: triggers the entrance reveal and marks the article as viewed
  useEffect(() => {
    const currentCard = cardRef.current;
    if (!currentCard) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          // Reveal content as soon as a third of the card is on screen
          if (entry.intersectionRatio >= 0.3) {
            setRevealed(true);
          }

          // Count as "viewed" once half the card is visible
          if (
            autoMarkAsViewed &&
            onView &&
            newsId &&
            !hasBeenViewedRef.current &&
            entry.intersectionRatio >= 0.5
          ) {
            hasBeenViewedRef.current = true;
            onView(newsId);
          }
        });
      },
      { threshold: [0.3, 0.5] }
    );

    observer.observe(currentCard);
    return () => observer.unobserve(currentCard);
  }, [autoMarkAsViewed, onView, newsId]);

  const handleImageLoad = () => setImageLoaded(true);

  const handleImageError = () => {
    setImageError(true);
    onImageError?.();
  };

  const handleSourceClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(news.citation, '_blank', 'noopener,noreferrer');
  };

  const relativeTime = formatRelativeTime(news.publishedAt);
  const domain = extractDomain(news.citation);

  return (
    <article
      ref={cardRef}
      className={styles.card}
      data-news-id={newsId}
      data-revealed={revealed ? 'true' : 'false'}
    >
      {/* News Image */}
      <div className={styles.imageContainer}>
        {!imageError ? (
          <>
            {!imageLoaded && <div className={styles.imageSkeleton} />}
            <img
              src={news.image}
              alt={news.title}
              className={`${styles.image} ${imageLoaded ? styles.imageLoaded : ''}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading="lazy"
            />
          </>
        ) : (
          <div className={styles.imagePlaceholder}>
            <FiTag size={32} />
          </div>
        )}

        {/* Bottom fade for legibility against the image */}
        <div className={styles.imageGradient} />

        {/* Source Badge */}
        <div className={styles.sourceBadge}>
          <span className={styles.sourceDot} />
          <span className={styles.sourceText}>{news.source}</span>
        </div>
      </div>

      {/* News Content */}
      <div className={styles.content}>
        {/* Title */}
        <h2 className={styles.title}>{news.title}</h2>

        {/* Description */}
        <p className={styles.description}>{news.description}</p>

        {/* Tags */}
        {news.tags && news.tags.length > 0 && (
          <div className={styles.tags}>
            {(showAllTags ? news.tags : news.tags.slice(0, 3)).map((tag, index) => (
              <span key={index} className={styles.tag}>
                {tag}
              </span>
            ))}
            {!showAllTags && news.tags.length > 3 && (
              <button
                type="button"
                className={styles.tagMore}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAllTags(true);
                }}
                aria-label={`Show all ${news.tags.length} tags`}
              >
                +{news.tags.length - 3}
              </button>
            )}
          </div>
        )}

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.metadata}>
            <FiClock size={14} />
            <span>{relativeTime}</span>
          </div>

          <button
            className={styles.readMoreButton}
            onClick={handleSourceClick}
            aria-label={`Read more at ${domain}`}
          >
            <span>Read More</span>
            <FiArrowUpRight size={16} />
          </button>
        </div>
      </div>
    </article>
  );
};
