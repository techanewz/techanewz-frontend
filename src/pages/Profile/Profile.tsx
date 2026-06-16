import { Layout } from '@/components/Layout/Layout';
import { useUser } from '@/contexts/UserContext';
import styles from './Profile.module.scss';
import { FiLogOut } from 'react-icons/fi';

// ============================================
// Profile Page Component
// ============================================

export const Profile = () => {
  const { user, preferences, updatePreferences, logout } = useUser();

  const handleNotificationsToggle = () => {
    updatePreferences({
      notificationsEnabled: !preferences.notificationsEnabled,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const displayName = user?.username || 'Your account';
  const initial = (displayName.trim().charAt(0) || 'T').toUpperCase();
  const subtitle =
    user?.email || (user?.accountType === 'google' ? 'Google account' : 'Signed in');

  return (
    <Layout title="Profile">
      <div className={styles.profile}>
        <div className={styles.container}>
          {/* Profile Header */}
          <div className={styles.header}>
            <div className={styles.avatarContainer}>
              {user?.avatar ? (
                <img src={user.avatar} alt="" className={styles.avatar} />
              ) : (
                <div className={styles.avatar}>
                  <span className={styles.avatarInitial}>{initial}</span>
                </div>
              )}
            </div>

            <div className={styles.userInfo}>
              <h1 className={styles.username}>{displayName}</h1>
              <p className={styles.userMeta}>{subtitle}</p>
            </div>
          </div>

          {/* Stats */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Member since</span>
              <span className={styles.statValue}>
                {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
              </span>
            </div>

            <div className={styles.statCard}>
              <span className={styles.statLabel}>Preferred topics</span>
              <span className={styles.statValue}>
                {preferences.preferredTags.length || 'All'}
              </span>
            </div>
          </div>

          {/* Notifications */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Notifications</h2>

            <div className={styles.settingCard}>
              <div className={styles.settingInfo}>
                <h3 className={styles.settingLabel}>Push notifications</h3>
                <p className={styles.settingDescription}>
                  Breaking tech news, as it happens.
                </p>
              </div>

              <button
                className={`${styles.toggle} ${preferences.notificationsEnabled ? styles.active : ''}`}
                onClick={handleNotificationsToggle}
                role="switch"
                aria-checked={preferences.notificationsEnabled}
                aria-label="Toggle push notifications"
              >
                <div className={styles.toggleThumb} />
              </button>
            </div>
          </section>

          {/* Account */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Account</h2>

            <div className={styles.accountCard}>
              {user?.avatar ? (
                <img src={user.avatar} alt="" className={styles.accountAvatar} />
              ) : (
                <div className={styles.accountAvatarPlaceholder}>
                  <span>{initial}</span>
                </div>
              )}
              <div className={styles.accountInfo}>
                <p className={styles.accountName}>{displayName}</p>
                {user?.email && <p className={styles.accountEmail}>{user.email}</p>}
              </div>
              <button
                className={styles.signOutButton}
                onClick={() => logout()}
                aria-label="Sign out"
              >
                <FiLogOut size={16} />
                <span>Sign out</span>
              </button>
            </div>
          </section>

          {/* App Info */}
          <div className={styles.appInfo}>
            <p className={styles.version}>TechShup · v1.0.0</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};
