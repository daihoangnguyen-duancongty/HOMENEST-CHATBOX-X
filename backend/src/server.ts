// MUST BE FIRST
import './instrument';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

import bodyParser from 'body-parser';
import { ApolloServer, HeaderMap } from '@apollo/server';
import Sentry from './instrument'; // import từ instrument.ts

import schema from './graphql/schema';
import resolvers from './graphql/resolvers';
import { connectDB } from './database/db';

import chatRoutes from './routes/ChatRoutes';
import adminRoutes from './routes/AdminRoutes';
import userRoutes from './routes/UserRoutes';
import adminAuthRoutes from './routes/AdminAuthRoutes';
import customerChatRoutes from "./routes/CustomerChatRoutes";

import { seedPlans } from './services/seedPlans';

const app = express();
const PORT = process.env.PORT || 5000;

// ----------------- Sentry request middleware -----------------
app.use((req: Request, res: Response, next: NextFunction) => {
  Sentry.addBreadcrumb({
    category: 'request',
    message: `${req.method} ${req.url}`,
    level: 'info',
  });
  next();
});

// ----------------- Middleware -----------------
app.use(express.json());
app.use(bodyParser.json());

const allowedOrigins = [
  'https://h7.homenest.tech',
  'https://www.homenest.tech',
  'http://localhost:3000',
  'http://localhost:5173',
  'https://homenest-chatbox-x.vercel.app',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.some((o) => origin.startsWith(o))) return callback(null, true);
      return callback(null, false);
    },
    credentials: true,
  })
);

// Debug Sentry
app.get('/debug-sentry', () => {
  throw new Error('Test Sentry error!');
});

// ----------------- Routes -----------------
app.use('/api', chatRoutes);
app.use('/api', userRoutes);
app.use('/admin-api', adminRoutes);
app.use('/admin-api/auth', adminAuthRoutes);
app.use("/api/customer", customerChatRoutes);
app.use("/public/client", require("./routes/publicClient").default);
// ----------------- Apollo Server -----------------
const startApolloServer = async () => {
  const server = new ApolloServer({ typeDefs: schema, resolvers });
  await server.start();

  app.use('/graphql', async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Convert headers sang HeaderMap để Apollo v4 chấp nhận
      const headers = new HeaderMap();
      for (const [key, value] of Object.entries(req.headers)) {
        if (typeof value === 'string') headers.set(key, value);
        else if (Array.isArray(value)) headers.set(key, value.join(','));
      }

      const result = await server.executeHTTPGraphQLRequest({
        httpGraphQLRequest: {
          body: req.body,
          headers,
          method: req.method,
          search: req.url?.split('?')[1] ?? '',
        },
        context: async () => ({ req, res }),
      });

      res.status(result.status || 200).json(result.body);
    } catch (err) {
      next(err);
    }
  });
};

// ----------------- Sentry error middleware -----------------
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  Sentry.captureException(err);
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// ----------------- Start Server -----------------
const startServer = async () => {
  try {
    await connectDB();
    await startApolloServer();

    // ✅ Seed plans tự động
    await seedPlans();

    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  } catch (err) {
    Sentry.captureException(err);
    console.error('❌ Server failed:', err);
  }
};

startServer();
