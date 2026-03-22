// ============================================
// Token storage keys
// ============================================

const KEYS = {
  ACCESS: 'mudra_access_token',
  REFRESH: 'mudra_refresh_token',
};

// ============================================
// Token helpers
// ============================================

export const getAccessToken = (): string | null => localStorage.getItem(KEYS.ACCESS);

export const getRefreshToken = (): string | null => localStorage.getItem(KEYS.REFRESH);

export const storeTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem(KEYS.ACCESS, accessToken);
  localStorage.setItem(KEYS.REFRESH, refreshToken);
};

export const clearTokens = (): void => {
  localStorage.removeItem(KEYS.ACCESS);
  localStorage.removeItem(KEYS.REFRESH);
};

// ============================================
// JWT decoding (client-side, no verification)
// ============================================

export const decodeJwt = (token: string): Record<string, unknown> | null => {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
};
