// backend/src/sentry.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  tracesSampleRate: 1.0,
});

// Middleware request & logging
export const sentryRequestHandler = (req: any, res: any, next: any) => {
  Sentry.captureMessage(`Request: ${req.method} ${req.url}`);
  next();
};

// Middleware error handler
export const sentryErrorHandler = (err: any, req: any, res: any, next: any) => {
  Sentry.captureException(err);
  next(err); // tiếp tục chain error middleware
};

export { Sentry };
