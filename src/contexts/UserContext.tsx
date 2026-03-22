import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { getUserId, getUserPreferences, saveUserPreferences } from '@/services/api';
import {
  getAccessToken,
  getRefreshToken,
  storeTokens,
  clearTokens,
  decodeJwt,
} from '@/services/auth';
import { mudraLogout, MudraUser } from '@/services/mudra';
import type { User, UserPreferences } from '@/types';

// ============================================
// Context Types
// ============================================

interface UserContextType {
  user: User | null;
  userId: string;
  isAuthenticated: boolean;
  preferences: UserPreferences;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  isLoading: boolean;
  loginWithMudra: (mudraUser: MudraUser, accessToken: string, refreshToken: string) => void;
  logout: () => Promise<void>;
}

// ============================================
// Context Creation
// ============================================

const UserContext = createContext<UserContextType | undefined>(undefined);

// ============================================
// Provider Component
// ============================================

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [userId, setUserId] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>({
    preferredTags: [],
    notificationsEnabled: true,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user on mount
  useEffect(() => {
    const initializeUser = () => {
      try {
        // Load preferences
        const savedPrefs = getUserPreferences();
        if (savedPrefs) {
          setPreferences({
            preferredTags: (savedPrefs.preferredTags as string[]) || [],
            notificationsEnabled: (savedPrefs.notificationsEnabled as boolean) ?? true,
          });
        }

        // Check for existing Mudra session
        const accessToken = getAccessToken();
        if (accessToken) {
          const payload = decodeJwt(accessToken) as { userId: string } | null;
          if (payload?.userId) {
            setUserId(payload.userId);
            setIsAuthenticated(true);
            // User details are minimal from JWT — restored on next login
            setUser({
              id: payload.userId,
              username: 'Loading...',
              createdAt: new Date().toISOString(),
              accountType: 'google',
            });
            return;
          }
        }

        // Guest mode — use existing or generate new guest ID
        const id = getUserId();
        setUserId(id);
        setIsAuthenticated(false);
        setUser({
          id,
          username: `User${id.slice(-4)}`,
          createdAt: new Date().toISOString(),
          accountType: 'guest',
        });
      } catch (error) {
        console.error('Error initializing user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, []);

  // Called after Mudra auth succeeds (both web and native bridge paths)
  const loginWithMudra = useCallback(
    (mudraUser: MudraUser, accessToken: string, refreshToken: string) => {
      storeTokens(accessToken, refreshToken);
      setIsAuthenticated(true);
      setUserId(mudraUser.id);
      setUser({
        id: mudraUser.id,
        username:
          mudraUser.displayName ||
          [mudraUser.first_name, mudraUser.last_name].filter(Boolean).join(' ') ||
          mudraUser.email.split('@')[0],
        email: mudraUser.email,
        avatar: mudraUser.photoURL,
        createdAt: new Date().toISOString(),
        accountType: mudraUser.photoURL ? 'google' : 'email',
      });
    },
    []
  );

  const logout = useCallback(async () => {
    const token = getAccessToken();
    if (token) {
      await mudraLogout(token).catch(() => {});
    }
    clearTokens();
    setIsAuthenticated(false);

    // Generate a new guest ID after logout
    const newGuestId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('techanewz_user_id', newGuestId);
    setUserId(newGuestId);
    setUser({
      id: newGuestId,
      username: `User${newGuestId.slice(-4)}`,
      createdAt: new Date().toISOString(),
      accountType: 'guest',
    });
  }, []);

  const updatePreferences = (prefs: Partial<UserPreferences>) => {
    const newPreferences = { ...preferences, ...prefs };
    setPreferences(newPreferences);
    saveUserPreferences(newPreferences);
  };

  const value: UserContextType = {
    user,
    userId,
    isAuthenticated,
    preferences,
    updatePreferences,
    isLoading,
    loginWithMudra,
    logout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// ============================================
// Custom Hook
// ============================================

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
