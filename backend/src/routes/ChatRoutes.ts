import { Router } from 'express';
import { chatWithAI } from '../controllers/ChatController';
import { ChatModel } from '../models/Chat';
import { authMiddleware, AuthRequest } from '../middlewares/auth';
import { ClientModel } from '../models/Client';

const router = Router();

// Middleware kiểm tra client còn active/trial hay không
const checkClientActive = async (req: AuthRequest, res: any, next: any) => {
  const clientId = req.user?.clientId;
  if (!clientId) return res.status(400).json({ error: 'Missing clientId' });

  const client = await ClientModel.findOne({ clientId });
  if (!client) return res.status(404).json({ error: 'Client not found' });

  const now = new Date();
  if (!client.active || (client.trial && client.trial_end && now > client.trial_end)) {
    return res.status(403).json({ error: 'Client trial expired or account inactive' });
  }

  req.body._client = client; // truyền xuống controller nếu cần
  next();
};

router.post('/chat', authMiddleware, checkClientActive, async (req: AuthRequest, res) => {
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
