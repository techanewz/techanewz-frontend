import { FiBell } from 'react-icons/fi';
import styles from './TopBar.module.scss';

// ============================================
// Component Props
// ============================================

interface TopBarProps {
  title?: string;
  showNotifications?: boolean;
}

// ============================================
// TopBar Component
// ============================================

export const TopBar = ({ title = 'TechaNewz', showNotifications = true }: TopBarProps) => {
  const handleNotificationClick = () => {
    // TODO: Implement notifications
    console.log('Notifications clicked');
  };

  return (
    <header className={styles.topBar}>
      <div className={styles.container}>
        {/* Logo / Title */}
        <div className={styles.logo}>
          <h1 className={styles.title}>{title}</h1>
        </div>

        {/* Actions */}
        {showNotifications && (
          <button
            className={styles.notificationButton}
            onClick={handleNotificationClick}
            aria-label="Notifications"
          >
            <FiBell size={22} />
            {/* Notification badge */}
            <span className={styles.badge}>3</span>
          </button>
        )}
      </div>
    </header>
  );
};
