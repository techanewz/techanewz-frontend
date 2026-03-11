import { useEffect, useState, useRef, useCallback } from 'react';
import { FiChevronUp } from 'react-icons/fi';
import styles from './SwipeHint.module.scss';

const STORAGE_KEY = 'techanewz_home_swipe_hint_seen';

interface SwipeHintProps {
  /** Ref to the scroll container (e.g. home feed) to dismiss on scroll */
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
  /** Optional: dismiss after this many ms */
  autoDismissMs?: number;
}

export const SwipeHint = ({
  scrollContainerRef,
  autoDismissMs = 4500,
}: SwipeHintProps) => {
  const [visible, setVisible] = useState(false);
  const dismissedRef = useRef(false);

  const dismiss = useCallback(() => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // ignore
    }
    setVisible(false);
  }, []);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === 'true') return;
    } catch {
      return;
    }
    setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible) return;

    const el = scrollContainerRef?.current;
    const onScroll = () => dismiss();
    const onTouchStart = () => dismiss();

    if (el) {
      el.addEventListener('scroll', onScroll, { once: true, passive: true });
      el.addEventListener('touchstart', onTouchStart, { once: true, passive: true });
      return () => {
        el.removeEventListener('scroll', onScroll);
        el.removeEventListener('touchstart', onTouchStart);
      };
    }
  }, [visible, scrollContainerRef, dismiss]);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(dismiss, autoDismissMs);
    return () => clearTimeout(t);
  }, [visible, autoDismissMs, dismiss]);

  if (!visible) return null;

  return (
    <div className={styles.hint} role="status" aria-live="polite">
      <FiChevronUp className={styles.icon} aria-hidden />
      <span className={styles.text}>Swipe up for next</span>
    </div>
  );
};
