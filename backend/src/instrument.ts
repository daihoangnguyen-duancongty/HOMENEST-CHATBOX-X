import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
import dotenv from "dotenv";

dotenv.config();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  sendDefaultPii: true,
});

export default Sentry;
