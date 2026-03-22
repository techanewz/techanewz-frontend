import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout/Layout';
import { useUser } from '@/contexts/UserContext';
import styles from './Profile.module.scss';
import { FiUser, FiTag, FiBell, FiInfo, FiCalendar, FiLogIn, FiLogOut } from 'react-icons/fi';

// ============================================
// Profile Page Component
// ============================================

export const Profile = () => {
  const { user, preferences, updatePreferences, isAuthenticated, logout } = useUser();
  const navigate = useNavigate();

  const handleNotificationsToggle = () => {
    updatePreferences({
      notificationsEnabled: !preferences.notificationsEnabled,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Layout title="Profile">
      <div className={styles.profile}>
        <div className={styles.container}>
          {/* Profile Header */}
          <div className={styles.header}>
            <div className={styles.avatarContainer}>
              <div className={styles.avatar}>
                <FiUser size={48} />
              </div>
              <div className={styles.onlineBadge} />
            </div>
            
            <div className={styles.userInfo}>
              <h1 className={styles.username}>{user?.username}</h1>
              <p className={styles.userId}>ID: {user?.id.slice(0, 16)}...</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <FiCalendar />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statLabel}>Member Since</span>
                <span className={styles.statValue}>
                  {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                </span>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <FiTag />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statLabel}>Preferred Topics</span>
                <span className={styles.statValue}>
                  {preferences.preferredTags.length || 'All'}
                </span>
              </div>
            </div>
          </div>

          {/* Settings Section */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <FiBell />
              <span>Notifications</span>
            </h2>
            
            <div className={styles.settingCard}>
              <div className={styles.settingInfo}>
                <h3 className={styles.settingLabel}>Push Notifications</h3>
                <p className={styles.settingDescription}>
                  Get notified about breaking tech news
                </p>
              </div>
              
              <button
                className={`${styles.toggle} ${preferences.notificationsEnabled ? styles.active : ''}`}
                onClick={handleNotificationsToggle}
                aria-label="Toggle notifications"
              >
                <div className={styles.toggleThumb} />
              </button>
            </div>
          </div>

          {/* Account Section */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <FiUser />
              <span>Account</span>
            </h2>

            {isAuthenticated ? (
              <div className={styles.accountCard}>
                {user?.avatar ? (
                  <img src={user.avatar} alt="Profile" className={styles.accountAvatar} />
                ) : (
                  <div className={styles.accountAvatarPlaceholder}>
                    <FiUser size={24} />
                  </div>
                )}
                <div className={styles.accountInfo}>
                  <p className={styles.accountName}>{user?.username}</p>
                  {user?.email && <p className={styles.accountEmail}>{user.email}</p>}
                </div>
                <button
                  className={styles.signOutButton}
                  onClick={() => logout()}
                  aria-label="Sign out"
                >
                  <FiLogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className={styles.signInCard}>
                <p className={styles.signInText}>
                  Sign in to sync your read history and preferences across devices.
                </p>
                <button
                  className={styles.signInButton}
                  onClick={() => navigate('/login')}
                >
                  <FiLogIn size={16} />
                  <span>Sign In / Sign Up</span>
                </button>
              </div>
            )}
          </div>

          {/* About Section */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <FiInfo />
              <span>About TechaNewz</span>
            </h2>
            
            <div className={styles.aboutCard}>
              <p className={styles.aboutText}>
                TechaNewz is your go-to source for the latest technology news,
                innovations, and insights. Stay informed about AI, web development,
                cybersecurity, and more.
              </p>
              
              <div className={styles.aboutStats}>
                <div className={styles.aboutStat}>
                  <span className={styles.aboutStatValue}>24/7</span>
                  <span className={styles.aboutStatLabel}>News Updates</span>
                </div>
                <div className={styles.aboutStat}>
                  <span className={styles.aboutStatValue}>25+</span>
                  <span className={styles.aboutStatLabel}>Categories</span>
                </div>
                <div className={styles.aboutStat}>
                  <span className={styles.aboutStatValue}>∞</span>
                  <span className={styles.aboutStatLabel}>Possibilities</span>
                </div>
              </div>
            </div>
          </div>

          {/* App Info */}
          <div className={styles.appInfo}>
            <p className={styles.version}>Version 1.0.0</p>
            <p className={styles.copyright}>© 2026 TechaNewz. All rights reserved.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};
