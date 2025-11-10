// src/app.ts
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import chatRoutes from './routes/chat.routes';
import adminRoutes from './routes/admin.routes';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// API endpoints
app.use('/api', chatRoutes);
app.use('/admin-api', adminRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('✅ ABC Chatbot backend running.');
});

export default app;
