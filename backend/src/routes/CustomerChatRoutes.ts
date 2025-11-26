// src/routes/CustomerChatRoutes.ts
import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import AIService from "../services/AIService";
import { saveChatMessage } from "../controllers/ChatController";
import { ClientModel } from "../models/Client";
import { CustomerModel } from "../models/Customer";

const router = Router();

/**
 * POST /api/customer/chat
 * Visitor gửi message → nhận AI reply
 * Nếu visitor mới sẽ tự sinh customer_id
 */
router.post("/chat", async (req: Request, res: Response) => {
  try {
    const { client_id, customer_id, name, avatar, message } = req.body;

    if (!client_id || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Sinh customer_id nếu visitor mới
    const visitorId = customer_id || uuidv4();

    // Kiểm tra client
    const client = await ClientModel.findOne({ clientId: client_id });
    if (!client) return res.status(404).json({ error: "Client not found" });

    // Lấy hoặc tạo visitor
    let customer = await CustomerModel.findOne({ customerId: visitorId });
    if (!customer) {
      customer = await CustomerModel.create({
        customerId: visitorId,
        clientId: client_id,
        name: name || "Guest",
        avatar: avatar || "",
        chatMode: "bot", // default
      });
    }

    // Nếu visitor đang chat với human
    if (customer.chatMode === "human") {
      await saveChatMessage(client_id, visitorId, message, "customer");
      return res.json({ reply: null, chatMode: "human", customer_id: visitorId });
    }

    // Chat với AI
    const reply = await AIService.getResponse(client, message);

    // Lưu message
    await saveChatMessage(client_id, visitorId, message, "customer");
    await saveChatMessage(client_id, visitorId, reply, "bot");

    res.json({ reply, chatMode: "bot", customer_id: visitorId });
  } catch (err: any) {
    console.error("CUSTOMER CHAT ERROR:", err);
    res.status(500).json({ error: "Server error", detail: err.message });
  }
});

export default router;
