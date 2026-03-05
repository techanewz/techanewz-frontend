import { useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiCompass, FiUser, FiTrendingUp } from 'react-icons/fi';
import styles from './Sidebar.module.scss';
import type { TabType } from '@/types';

// ============================================
// Sidebar Component (Desktop Only)
// ============================================

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems: { id: TabType; icon: React.ElementType; label: string; path: string }[] = [
    { id: 'home', icon: FiHome, label: 'Home', path: '/' },
    { id: 'explore', icon: FiCompass, label: 'Explore', path: '/explore' },
    { id: 'profile', icon: FiUser, label: 'Profile', path: '/profile' },
  ];

  const currentPath = location.pathname;

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <FiTrendingUp size={32} />
        </div>
        <h2 className={styles.logoText}>TechaNewz</h2>
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;

          return (
            <button
              key={item.id}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
              onClick={() => handleNavigation(item.path)}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className={styles.navIcon} size={24} />
              <span className={styles.navLabel}>{item.label}</span>
              {isActive && <div className={styles.activeIndicator} />}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={styles.footer}>
        <p className={styles.footerText}>© 2026 TechaNewz</p>
      </div>
    </aside>
  );
};
