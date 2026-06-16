import styles from './TopBar.module.scss';

// ============================================
// Component Props
// ============================================

interface TopBarProps {
  title?: string;
  // Notifications UI is hidden until the backend feature lands. Prop kept for API compatibility.
  showNotifications?: boolean;
}

// ============================================
// TopBar Component
// ============================================

export const TopBar = ({ title = 'TechShup' }: TopBarProps) => {
  return (
    <header className={styles.topBar}>
      <div className={styles.container}>
        {/* Logo / Title */}
        <div className={styles.logo}>
          <img src="/Logo.svg" alt="TechShup" className={styles.logoImg} />
          <h1 className={styles.title}>{title}</h1>
        </div>
      </div>
    </header>
  );
};
