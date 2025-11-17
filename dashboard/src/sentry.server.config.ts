import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN, // server-only
  tracesSampleRate: 1.0,
  sendDefaultPii: true, // gửi IP nếu cần
});

export default Sentry;
