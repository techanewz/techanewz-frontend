import styles from './AppBackground.module.scss';

// ============================================
// AppBackground
// Ambient, fixed, non-interactive scene that lives behind the whole app:
// drifting aurora orbs, a faint engineering grid, and fine film grain.
// Pure CSS, GPU-friendly (transform/opacity only), reduced-motion aware.
// ============================================

interface AppBackgroundProps {
  /** Stronger, more saturated variant for the auth / login screen */
  variant?: 'app' | 'auth';
}

export const AppBackground = ({ variant = 'app' }: AppBackgroundProps) => {
  return (
    <div
      className={`${styles.bg} ${variant === 'auth' ? styles.auth : ''}`}
      aria-hidden="true"
    >
      <div className={`${styles.orb} ${styles.orbA}`} />
      <div className={`${styles.orb} ${styles.orbB}`} />
      <div className={`${styles.orb} ${styles.orbC}`} />
      <div className={styles.grid} />
      <div className={styles.grain} />
    </div>
  );
};
