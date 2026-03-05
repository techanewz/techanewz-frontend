import styles from './LoadingSpinner.module.scss';

// ============================================
// Component Props
// ============================================

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

// ============================================
// LoadingSpinner Component
// ============================================

export const LoadingSpinner = ({ size = 'md', fullScreen = false }: LoadingSpinnerProps) => {
  if (fullScreen) {
    return (
      <div className={styles.fullScreen}>
        <div className={`${styles.spinner} ${styles[size]}`}>
          <div className={styles.circle}></div>
          <div className={styles.circle}></div>
          <div className={styles.circle}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.spinner} ${styles[size]}`}>
      <div className={styles.circle}></div>
      <div className={styles.circle}></div>
      <div className={styles.circle}></div>
    </div>
  );
};
