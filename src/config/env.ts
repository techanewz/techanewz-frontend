/**
 * Centralized, validated env access.
 * Throws at module load (i.e. before any UI renders) if a required var is missing,
 * so a misconfigured deploy fails loudly instead of silently falling back to localhost.
 */

const REQUIRED_KEYS = [
  'VITE_API_BASE_URL',
  'VITE_MUDRA_BASE_URL',
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
] as const;

type RequiredKey = (typeof REQUIRED_KEYS)[number];

function readRequired(key: RequiredKey): string {
  const value = (import.meta.env as Record<string, string | undefined>)[key];
  if (!value || !value.trim()) {
    throw new Error(
      `[env] Missing required environment variable: ${key}. ` +
        `Set it in your .env file or hosting platform.`
    );
  }
  return value;
}

export const env = {
  API_BASE_URL: readRequired('VITE_API_BASE_URL'),
  MUDRA_BASE_URL: readRequired('VITE_MUDRA_BASE_URL'),
  FIREBASE_API_KEY: readRequired('VITE_FIREBASE_API_KEY'),
  FIREBASE_AUTH_DOMAIN: readRequired('VITE_FIREBASE_AUTH_DOMAIN'),
  FIREBASE_PROJECT_ID: readRequired('VITE_FIREBASE_PROJECT_ID'),
};
