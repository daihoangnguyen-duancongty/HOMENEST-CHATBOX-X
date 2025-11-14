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

// ✅ Khai báo các domain được phép truy cập
const allowedOrigins = [
  'https://h7.homenest.tech',   // domain WordPress thật
  'https://www.homenest.tech',  // nếu có www
  'http://localhost:3000',      // local React test
  'http://localhost:5173',
];

// 🌐 CORS middleware toàn cục
app.use(cors({
  origin: (origin, callback) => {
    // Cho phép requests không có origin (Postman, curl, mobile apps)
    if (!origin) return callback(null, true);

    // Nếu origin nằm trong whitelist
    if (allowedOrigins.some(o => origin.startsWith(o))) {
      return callback(null, true);
    }

    // ❌ KHÔNG ném lỗi, chỉ block
    return callback(null, false);
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Body parser
app.use(bodyParser.json());

// 🟢 Logger middleware
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

// API routes
app.use('/api', chatRoutes);
app.use('/admin-api', adminRoutes);

// Health check
app.get('/', (_req, res) => {
  res.send('✅ ABC Chatbot backend running.');
});
app.get('/api/test-cors', (req, res) => {
  res.json({ message: '✅ CORS works!' });
});

// 🔹 Start server
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await connectDB(); // kết nối MongoDB
    app.listen(PORT, () => {
      console.log(`\n✅ Backend running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
