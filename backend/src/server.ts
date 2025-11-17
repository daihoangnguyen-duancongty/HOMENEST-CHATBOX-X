// backend/src/server.ts
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { ApolloServer } from '@apollo/server';

import schema from './graphql/schema';
import resolvers from './graphql/resolvers';
import { connectDB } from './database/db';
import chatRoutes from './routes/ChatRoutes';
import adminRoutes from './routes/AdminRoutes';
import userRoutes from './routes/UserRoutes';
import adminAuthRoutes from './routes/AdminAuthRoutes';

import { Sentry, sentryRequestHandler, sentryErrorHandler } from './sentry';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ----------------- Sentry Middleware -----------------
app.use(sentryRequestHandler); // request logging & tracing

// ----------------- Middleware -----------------
app.use(express.json());
app.use(bodyParser.json());

const allowedOrigins = [
  'https://h7.homenest.tech',
  'https://www.homenest.tech',
  'http://localhost:3000',
  'http://localhost:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.some((o) => origin.startsWith(o))) return callback(null, true);
      return callback(null, false);
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// ----------------- Logger Middleware -----------------
app.use((req, res, next) => {
  console.log('-----------------------------------');
  console.log(`Time: ${new Date().toISOString()}`);
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.url}`);
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    console.log('Body:', req.body);
  }
  res.on('finish', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log('-----------------------------------\n');
  });
  next();
});

// ----------------- Routes -----------------
app.use('/api', chatRoutes);
app.use('/api', userRoutes);
app.use('/admin-api', adminRoutes);
app.use('/admin-api/auth', adminAuthRoutes);

app.get('/', (_req, res) => res.send('✅ HomeNest Chatbot backend running.'));

// ----------------- Apollo Server -----------------
const startApolloServer = async () => {
  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
  });
  await server.start();

  app.use('/graphql', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await server.executeHTTPGraphQLRequest({
        httpGraphQLRequest: {
          body: req.body,
          headers: req.headers as any,
          method: req.method,
          search: req.url?.split('?')[1] ?? '',
        },
        context: async () => ({ req, res }),
      });

      res.status(result.status || 200);
      Object.entries(result.headers ?? {}).forEach(([key, value]) => {
        res.setHeader(key, value as string);
      });
      res.json(result.body);
    } catch (err) {
      next(err);
    }
  });
};

// ----------------- Sentry Error Handler -----------------
app.use(sentryErrorHandler);

// ----------------- Start Server -----------------
const startServer = async () => {
  try {
    await connectDB();
    await startApolloServer();

    app.listen(PORT, () => {
      console.log(`\n✅ Backend HomeNest Chatbot running on http://localhost:${PORT}`);
    });
  } catch (err) {
    Sentry.captureException(err);
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
