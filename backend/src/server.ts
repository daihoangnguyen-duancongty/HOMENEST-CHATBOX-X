import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import chatRoutes from './routes/ChatRoutes';
import adminRoutes from './routes/AdminRoutes';
import { connectDB } from './database/db';

dotenv.config();
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY?.slice(0, 8) + '...');
const app = express();

// ✅ Khai báo allowedOrigins trước
const allowedOrigins = [
  'https://h7.homenest.tech',   // domain WordPress thật
  'https://www.homenest.tech',  // nếu có www
  'http://localhost:3000',      // local React test
];

// Middleware CORS
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Postman, curl
    const allowed = allowedOrigins.some(o => origin.startsWith(o));
    callback(null, allowed);
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// 🔹 Cho mọi preflight request bằng regex, tránh crash '*'
app.options(/.*/, cors());

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
  console.log(`[Health Check] ${new Date().toISOString()} - Backend is running`);
  res.send('✅ ABC Chatbot backend running.');
});

// Start server
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`\n✅ HomeNest Chatbot X backend is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
