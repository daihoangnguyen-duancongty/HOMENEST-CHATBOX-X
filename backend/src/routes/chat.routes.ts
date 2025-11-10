import { Router } from 'express';
import { chatWithAI } from '../controllers/ChatController';

const router = Router();

/**
 * POST /api/chat
 * Body: {
 *   client_id: string,
 *   message: string
 * }
 * Response: { reply: string }
 */
router.post('/chat', chatWithAI);

export default router;
