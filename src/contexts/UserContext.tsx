import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUserId, getUserPreferences, saveUserPreferences } from '@/services/api';
import type { User, UserPreferences } from '@/types';

// ============================================
// Context Types
// ============================================

interface UserContextType {
  user: User | null;
  userId: string;
  preferences: UserPreferences;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  isLoading: boolean;
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
  const [preferences, setPreferences] = useState<UserPreferences>({
    preferredTags: [],
    notificationsEnabled: true,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user on mount
  useEffect(() => {
    const initializeUser = () => {
      try {
        // Get or create user ID
        const id = getUserId();
        setUserId(id);

        // Load user preferences
        const savedPrefs = getUserPreferences();
        if (savedPrefs) {
          setPreferences({
            preferredTags: (savedPrefs.preferredTags as string[]) || [],
            notificationsEnabled: (savedPrefs.notificationsEnabled as boolean) ?? true,
          });
        }

        // Create basic user object
        setUser({
          id,
          username: `User${id.slice(-4)}`,
          createdAt: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Error initializing user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, []);

  // Update preferences
  const updatePreferences = (prefs: Partial<UserPreferences>) => {
    const newPreferences = { ...preferences, ...prefs };
    setPreferences(newPreferences);
    saveUserPreferences(newPreferences);
  };

  const value: UserContextType = {
    user,
    userId,
    preferences,
    updatePreferences,
    isLoading,
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
