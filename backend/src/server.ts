import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import chatRoutes from './routes/ChatRoutes';
import adminRoutes from './routes/AdminRoutes';
import { connectDB } from './database/db';

dotenv.config();
const app = express();

// ✅ CORS cho WordPress site cụ thể và local test
const allowedOrigins = [
  'https://h7.homenest.tech',   // domain WordPress thật
  'https://www.homenest.tech',  // nếu có www
  'http://localhost:3000',      // local React test
];

// Middleware CORS chi tiết
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // cho Postman, curl
    if (allowedOrigins.some(o => origin.startsWith(o))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS: ' + origin));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Phục vụ preflight request cho tất cả route
app.options('*', cors());

app.use(bodyParser.json());

// Logger middleware
app.use((req, res, next) => {
  console.log('-----------------------------------');
  console.log(`Time: ${new Date().toISOString()}`);
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log('Headers:', req.headers);
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    console.log('Body:', req.body);
  }

  res.on('finish', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log('-----------------------------------\n');
  });

  next();
});

// API endpoints
app.use('/api', chatRoutes);
app.use('/admin-api', adminRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('✅ ABC Chatbot backend running.');
});

// Start server
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Backend running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
