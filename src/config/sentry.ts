/**
 * Sentry initialization for the frontend.
 * No-op when VITE_SENTRY_DSN is unset, so dev builds stay clean.
 */
import * as Sentry from '@sentry/react';

const dsn = import.meta.env.VITE_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    tracesSampleRate: 0.1,
    integrations: [Sentry.browserTracingIntegration()],
  });
}

export const sentryEnabled = Boolean(dsn);
export { Sentry };
