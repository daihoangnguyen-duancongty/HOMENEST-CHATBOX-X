import { Request, Response } from "express";
import { ChatModel } from "../models/Chat";
import { CustomerModel } from "../models/Customer";
import AIService from "../services/AIService";
import { ClientModel } from "../models/Client";

// ===== Helper: Lưu tin nhắn =====
export const saveChatMessage = async (
  clientId: string,
  userId: string,
  text: string,
  from: "customer" | "bot" | "employee"
) => {
  let chat = await ChatModel.findOne({ clientId, userId });

  if (!chat) {
    chat = new ChatModel({
      clientId,
      userId,
      messages: []
    });
  }

  chat.messages.push({
    from,
    text,
    timestamp: new Date()
  });

  await chat.save();
  return chat;
};

// ============================================
// ========= AI CHAT DÀNH CHO USER LOGIN ======
// ============================================

export const chatWithAI = async (req: Request, res: Response) => {
  try {
    const { client_id, user_id, message, user_name, user_avatar } = req.body;

    const client = await ClientModel.findOne({ clientId: client_id });
    if (!client) return res.status(404).json({ error: "Client not found" });

    // Gọi AI
    const reply = await AIService.getResponse(client, message);

    // Lưu tin nhắn user
    await saveChatMessage(client_id, user_id, message, "customer");

    // Lưu tin nhắn bot
    await saveChatMessage(client_id, user_id, reply, "bot");

    res.json({ reply, chatMode: "bot" });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ============================================
// ========= CUSTOMER CHAT (GUEST WIDGET) =====
// ============================================

export const customerChat = async (req: Request, res: Response) => {
  try {
    const { client_id, customer_id, name, avatar, message } = req.body;

    if (!client_id || !customer_id || !message)
      return res.status(400).json({ error: "Missing fields" });

    let customer = await CustomerModel.findOne({ customerId: customer_id });

    // Nếu lần đầu → tạo customer
    if (!customer) {
      customer = await CustomerModel.create({
        customerId: customer_id,
        clientId: client_id,
        name,
        avatar,
      });
    }

    // Nếu đang chat với nhân viên → không gửi AI
    if (customer.chatMode === "human") {
      await saveChatMessage(client_id, customer_id, message, "customer");
      return res.json({ reply: null, chatMode: "human" });
    }

    // Chat với AI
    const client = await ClientModel.findOne({ clientId: client_id });
    if (!client) return res.status(404).json({ error: "Client not found" });

    const reply = await AIService.getResponse(client, message);

    await saveChatMessage(client_id, customer_id, message, "customer");
    await saveChatMessage(client_id, customer_id, reply, "bot");

    res.json({ reply, chatMode: "bot" });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ============================================
// ======= SWITCH AI → HUMAN SUPPORT =========
// ============================================

export const switchToHuman = async (req: Request, res: Response) => {
  const { customer_id } = req.body;

  let customer = await CustomerModel.findOne({ customerId: customer_id });
  if (!customer) return res.status(404).json({ error: "Customer not found" });

  customer.chatMode = "human";
  await customer.save();

  res.json({ ok: true, message: "Đã chuyển sang tư vấn viên" });
};

// ============================================
// ========== EMPLOYEE / CLIENT TRẢ LỜI =======
// ============================================

export const employeeReply = async (req: Request, res: Response) => {
  const { customerId, message } = req.body;
  const clientId = (req as any).user?.clientId;

  await saveChatMessage(clientId, customerId, message, "employee");

  res.json({ ok: true });
};
