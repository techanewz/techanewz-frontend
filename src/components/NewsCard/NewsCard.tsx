import { useState, useEffect, useRef } from 'react';
import { FiExternalLink, FiClock, FiTag } from 'react-icons/fi';
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
  autoMarkAsViewed = true 
}: NewsCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  const hasBeenViewedRef = useRef(false);

  // Ensure we have a valid ID (handle both 'id' and '_id' from API)
  const newsId = news.id || (news as any)._id;

  // Auto-mark as viewed when card becomes visible
  useEffect(() => {
    if (!autoMarkAsViewed || !onView || !newsId || hasBeenViewedRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasBeenViewedRef.current) {
            hasBeenViewedRef.current = true;
            onView(newsId);
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of card is visible
      }
    );

    const currentCard = cardRef.current;
    if (currentCard) {
      observer.observe(currentCard);
    }

    return () => {
      if (currentCard) {
        observer.unobserve(currentCard);
      }
    };
  }, [autoMarkAsViewed, onView, newsId]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    if (onImageError) {
      onImageError();
    }
  };

  const handleSourceClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(news.citation, '_blank', 'noopener,noreferrer');
  };

  const relativeTime = formatRelativeTime(news.publishedAt);
  const domain = extractDomain(news.citation);

  return (
    <article ref={cardRef} className={styles.card} data-news-id={newsId}>
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
        
        {/* Source Badge */}
        <div className={styles.sourceBadge}>
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
            {news.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className={styles.tag}>
                {tag}
              </span>
            ))}
            {news.tags.length > 3 && (
              <span className={styles.tagMore}>+{news.tags.length - 3}</span>
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
            <FiExternalLink size={16} />
          </button>
        </div>
      </div>
    </article>
  );
};
