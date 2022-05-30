import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

SENTRY_DSN &&
  Sentry.init({
    dsn: SENTRY_DSN,
    sampleRate: 1, // report all errors
    tracesSampleRate: 0.05, // report 5% of traces
  });
