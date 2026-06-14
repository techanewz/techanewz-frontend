import { useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiCompass, FiUser } from 'react-icons/fi';
import styles from './BottomNav.module.scss';
import type { TabType } from '@/types';

// ============================================
// Component
// ============================================

export const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs: { id: TabType; icon: React.ElementType; label: string; path: string }[] = [
    { id: 'home', icon: FiHome, label: 'Home', path: '/' },
    { id: 'explore', icon: FiCompass, label: 'Explore', path: '/explore' },
    { id: 'profile', icon: FiUser, label: 'Profile', path: '/profile' },
  ];

  const currentPath = location.pathname;
  const activeIndex = Math.max(
    0,
    tabs.findIndex((t) => t.path === currentPath)
  );

  const handleTabClick = (path: string) => {
    navigate(path);
  };

  return (
    <nav className={styles.bottomNav} role="navigation" aria-label="Main navigation">
      <div className={styles.navContainer}>
        {/* Sliding active pill — moves between tabs */}
        <span
          className={styles.pill}
          style={{ transform: `translateX(${activeIndex * 100}%)` }}
          aria-hidden="true"
        />

        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentPath === tab.path;

          return (
            <button
              key={tab.id}
              className={`${styles.navButton} ${isActive ? styles.active : ''}`}
              onClick={() => handleTabClick(tab.path)}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className={styles.iconWrapper}>
                <Icon className={styles.icon} size={20} />
              </div>
              <span className={styles.label}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
