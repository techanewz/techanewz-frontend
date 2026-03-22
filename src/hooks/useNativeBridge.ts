import { useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { apiService } from '@/services/api';

// ============================================
// WebView detection
// ============================================

export const isInWebView = (): boolean =>
  typeof (window as any).ReactNativeWebView !== 'undefined';

// ============================================
// Send message to native Expo shell
// ============================================

export const requestNativeGoogleSignIn = (guestUserId: string): void => {
  (window as any).ReactNativeWebView?.postMessage(
    JSON.stringify({ type: 'GOOGLE_SIGN_IN_REQUEST', guestUserId })
  );
};

// ============================================
// Native → Web bridge hook
// Sets up a listener for messages injected by the Expo shell via injectJavaScript.
// Mount this once at the app root (inside UserProvider).
// ============================================

interface NativeAuthSuccessMessage {
  type: 'GOOGLE_AUTH_SUCCESS';
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    first_name?: string;
    last_name?: string;
  };
}

interface NativeAuthErrorMessage {
  type: 'GOOGLE_AUTH_ERROR';
  error: string;
}

interface NativeAuthCancelledMessage {
  type: 'GOOGLE_AUTH_CANCELLED';
}

type NativeMessage =
  | NativeAuthSuccessMessage
  | NativeAuthErrorMessage
  | NativeAuthCancelledMessage;

export const useNativeBridge = () => {
  const { loginWithMudra, userId } = useUser();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      let data: NativeMessage;
      try {
        data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      } catch {
        return;
      }

      if (data?.type === 'GOOGLE_AUTH_SUCCESS') {
        const { accessToken, refreshToken, user } = data;
        loginWithMudra(user, accessToken, refreshToken);

        // Migrate guest history in background (non-blocking)
        if (userId.startsWith('user_')) {
          apiService.migrateGuestSession(userId).catch(console.error);
        }
      }
      // GOOGLE_AUTH_ERROR and GOOGLE_AUTH_CANCELLED are handled in the Login page
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [loginWithMudra, userId]);
};
