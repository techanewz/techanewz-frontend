import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { firebaseAuth } from '@/config/firebase';
import { useUser } from '@/contexts/UserContext';
import { mudraLogin, mudraRegister, mudraGoogleSignIn } from '@/services/mudra';
import { apiService } from '@/services/api';
import { isInWebView, requestNativeGoogleSignIn } from '@/hooks/useNativeBridge';
import styles from './Login.module.scss';

// ============================================
// Login / Sign-up Page
// Works in both browser and WebView contexts.
// ============================================

type Tab = 'signin' | 'signup';

export const Login = () => {
  const navigate = useNavigate();
  const { loginWithMudra, isAuthenticated, userId } = useUser();

  const [tab, setTab] = useState<Tab>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleAuthSuccess = async (accessToken: string, refreshToken: string, user: any) => {
    const guestUserId = userId;
    loginWithMudra(user, accessToken, refreshToken);

    // Migrate guest history in background
    if (guestUserId.startsWith('user_')) {
      apiService.migrateGuestSession(guestUserId).catch(console.error);
    }

    navigate('/');
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await mudraLogin(email, password);
      await handleAuthSuccess(data.accessToken, data.refreshToken, data.user);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await mudraRegister({
        email,
        password,
        first_name: firstName || undefined,
        last_name: lastName || undefined,
      });
      await handleAuthSuccess(data.accessToken, data.refreshToken, data.user);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Sign-up failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      if (isInWebView()) {
        // Native path: Expo shell handles OAuth, result comes via useNativeBridge
        requestNativeGoogleSignIn(userId);
        // Don't setGoogleLoading(false) — user will be redirected when bridge responds
        return;
      }

      // Browser path: use Firebase popup
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(firebaseAuth, provider);
      const firebaseIdToken = await result.user.getIdToken();

      const { data } = await mudraGoogleSignIn(firebaseIdToken);
      await handleAuthSuccess(data.accessToken, data.refreshToken, data.user);
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user') {
        // User dismissed the popup — not an error
      } else {
        setError(err?.response?.data?.message || err.message || 'Google sign-in failed');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Logo / Brand */}
        <div className={styles.brand}>
          <h1 className={styles.brandName}>TechaNewz</h1>
          <p className={styles.brandTagline}>Your daily tech news digest</p>
        </div>

        {/* Tab switcher */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === 'signin' ? styles.activeTab : ''}`}
            onClick={() => { setTab('signin'); setError(''); }}
          >
            Sign In
          </button>
          <button
            className={`${styles.tab} ${tab === 'signup' ? styles.activeTab : ''}`}
            onClick={() => { setTab('signup'); setError(''); }}
          >
            Sign Up
          </button>
        </div>

        {/* Google Sign-In */}
        <button
          className={styles.googleButton}
          onClick={handleGoogleSignIn}
          disabled={googleLoading || loading}
        >
          {googleLoading ? (
            <span className={styles.spinner} />
          ) : (
            <GoogleIcon />
          )}
          <span>Continue with Google</span>
        </button>

        <div className={styles.divider}>
          <span>or</span>
        </div>

        {/* Error message */}
        {error && <p className={styles.error}>{error}</p>}

        {/* Sign In form */}
        {tab === 'signin' && (
          <form className={styles.form} onSubmit={handleEmailSignIn}>
            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <input
                className={styles.input}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Password</label>
              <input
                className={styles.input}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                minLength={8}
              />
            </div>
            <button className={styles.submitButton} type="submit" disabled={loading || googleLoading}>
              {loading ? <span className={styles.spinner} /> : 'Sign In'}
            </button>
          </form>
        )}

        {/* Sign Up form */}
        {tab === 'signup' && (
          <form className={styles.form} onSubmit={handleEmailSignUp}>
            <div className={styles.nameRow}>
              <div className={styles.field}>
                <label className={styles.label}>First name</label>
                <input
                  className={styles.input}
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  autoComplete="given-name"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Last name</label>
                <input
                  className={styles.input}
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  autoComplete="family-name"
                />
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <input
                className={styles.input}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Password</label>
              <input
                className={styles.input}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 chars, upper, lower, digit, special"
                required
                autoComplete="new-password"
                minLength={8}
              />
            </div>
            <button className={styles.submitButton} type="submit" disabled={loading || googleLoading}>
              {loading ? <span className={styles.spinner} /> : 'Create Account'}
            </button>
          </form>
        )}

        {/* Back to app */}
        <button className={styles.skipButton} onClick={() => navigate(-1)}>
          Continue as guest
        </button>
      </div>
    </div>
  );
};

// ============================================
// Google icon SVG
// ============================================

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M43.6 20.1h-1.6V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.9 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z" fill="#FFC107"/>
    <path d="M6.3 14.7l6.6 4.8C14.5 16 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.9 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" fill="#FF3D00"/>
    <path d="M24 44c5.4 0 10.3-2 14-5.4l-6.5-5.5C29.4 35 26.8 36 24 36c-5.3 0-9.7-3.3-11.3-8H6.3C9.7 35.7 16.3 44 24 44z" fill="#4CAF50"/>
    <path d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.5l6.5 5.5C43 36.3 44 30.5 44 24c0-1.3-.1-2.6-.4-3.9z" fill="#1976D2"/>
  </svg>
);
