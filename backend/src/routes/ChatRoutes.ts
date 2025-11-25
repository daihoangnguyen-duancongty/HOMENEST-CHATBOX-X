import { Router } from "express";
import { authMiddleware, AuthRequest } from "../middlewares/auth";
import { requireRole } from "../middlewares/role";

import { 
  chatWithAI,
  customerChat,
  switchToHuman,
  employeeReply
} from "../controllers/ChatController";

import { ClientModel } from "../models/Client";
import { ChatModel } from "../models/Chat";

const router = Router();

// ========================= MIDDLEWARE =========================

const checkClientActive = async (req: AuthRequest, res: any, next: any) => {
  const clientId = req.user?.clientId;
  if (!clientId) return res.status(400).json({ error: "Missing clientId" });

  const client = await ClientModel.findOne({ clientId });
  if (!client) return res.status(404).json({ error: "Client not found" });

  const now = new Date();
  if (!client.active || (client.trial && client.trial_end && now > client.trial_end)) {
    return res.status(403).json({ error: "Client trial expired or inactive" });
  }

  req.body._client = client;
  next();
};

// ========================= ROUTES =============================

// 1) Chat của user đã đăng nhập
router.post("/chat", authMiddleware, checkClientActive, async (req, res) => {
  req.body.client_id = req.user?.clientId;
  req.body.user_id = req.user?.userId;
  req.body.user_name = req.user?.name;
  req.body.user_avatar = req.user?.avatar;

  await chatWithAI(req, res);
});

// 2) Lấy lịch sử chat
router.get("/chat/:clientId/:userId", async (req, res) => {
  const { clientId, userId } = req.params;
  const chat = await ChatModel.findOne({ clientId, userId });

  res.json({
    messages: chat?.messages || [],
    userName: chat?.userName,
    userAvatar: chat?.userAvatar,
  });
});

// 3) Guest / Customer chat
router.post("/customer/chat", customerChat);

// 4) Chuyển AI → nhân viên tư vấn
router.post("/customer/switch-human", switchToHuman);

// 5) Employee reply
router.post(
  "/client/reply",
  authMiddleware,
 requireRole("client", "employee"),
  employeeReply
);

export default router;
