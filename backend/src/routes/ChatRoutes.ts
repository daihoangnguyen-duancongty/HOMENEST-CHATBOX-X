import { Router } from 'express';
import { chatWithAI } from '../controllers/ChatController';
import { ChatModel } from '../models/Chat';
import { authMiddleware, AuthRequest } from '../middlewares/auth';

const router = Router();

router.post('/chat', authMiddleware, async (req: AuthRequest, res) => {
  req.body.client_id = req.user?.clientId;
  req.body.user_id = req.user?.userId;
  req.body.user_name = req.user?.name;
  req.body.user_avatar = req.user?.avatar;
  await chatWithAI(req, res);
});

router.get('/chat/:clientId/:userId', async (req, res) => {
  const { clientId, userId } = req.params;
  const chat = await ChatModel.findOne({ clientId, userId });
  res.json({ messages: chat?.messages || [], userName: chat?.userName, userAvatar: chat?.userAvatar });
});

export default router;
