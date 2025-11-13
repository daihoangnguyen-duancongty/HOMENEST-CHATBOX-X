import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import chatRoutes from './routes/ChatRoutes';
import adminRoutes from './routes/AdminRoutes';
import { connectDB } from './database/db';

dotenv.config();
const app = express();

// Cho phép mọi origin (test nhanh)
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Middleware cho preflight
app.options('*', cors());

app.use(bodyParser.json());

// API
app.use('/api', chatRoutes);
app.use('/admin-api', adminRoutes);

app.get('/', (req, res) => res.send('✅ Backend running'));

const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

startServer();
