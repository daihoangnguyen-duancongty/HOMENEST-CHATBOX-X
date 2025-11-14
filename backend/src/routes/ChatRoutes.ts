import { Router } from 'express';
import { chatWithAI } from '../controllers/ChatController';
import { ChatModel } from '../models/Chat';
import { authMiddleware, AuthRequest } from '../middlewares/auth';

const router = Router();

// ✅ Gửi tin nhắn tới AI, bắt buộc user đã login
router.post('/chat', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Missing message' });

    // Gán thông tin user vào body trước khi gọi controller
    req.body.client_id = req.user?.clientId;
    req.body.user_id = req.user?.userId;
    req.body.user_name = req.user?.name;
    req.body.user_avatar = req.user?.avatar;

    // Gọi controller
    await chatWithAI(req, res);

  } catch (err) {
    console.error('chat POST error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/chat/:clientId/:userId => lịch sử chat user
router.get('/chat/:clientId/:userId', async (req, res) => {
  try {
    const { clientId, userId } = req.params;
    const chat = await ChatModel.findOne({ clientId, userId });
    res.json({ messages: chat?.messages || [], userName: chat?.userName, userAvatar: chat?.userAvatar });
  } catch (err) {
    console.error(err);
    res.status(500).json({ messages: [] });
  }
});

export default router;
