import { Sentry } from "../instrument";
import { Request, Response, NextFunction } from 'express';

// Middleware để log lỗi
export const sentryMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  Sentry.captureException(err); // gửi lỗi lên Sentry
  console.error(err); // log ra console dev
  res.status(500).json({ error: 'Internal Server Error' });
};
