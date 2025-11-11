import { Router } from 'express';
import { chatWithAI } from '../controllers/ChatController';
import { ChatModel } from '../models/Chat';

const router = Router();

router.post('/chat', chatWithAI);

// GET /api/chat/:clientId => trả về lịch sử chat
router.get('/chat/:clientId', async (req, res) => {
  try {
    const clientId = req.params.clientId;
    const chat = await ChatModel.findOne({ clientId });
    if (!chat) return res.json({ messages: [] });
    res.json({ messages: chat.messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ messages: [] });
  }
});

export default router;
