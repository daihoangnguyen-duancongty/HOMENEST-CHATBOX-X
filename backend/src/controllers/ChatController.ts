import { Request, Response } from 'express';
import AIService from '../services/AIService';
import { ClientModel } from '../models/Client';
import { ChatModel, IChatMessage } from '../models/Chat';

export const chatWithAI = async (req: Request, res: Response) => {
  try {
    const { client_id, message } = req.body;
    if (!client_id || !message) return res.status(400).json({ error: 'Missing client_id or message' });

    // 1️⃣ Check client exists
    const client = await ClientModel.findOne({ clientId: client_id });
    if (!client) return res.status(404).json({ error: 'Client not found' });

    // 2️⃣ Determine AI provider
    const aiProvider = client.ai_provider || 'openai';

    // 3️⃣ Call AI service
    const botReply = await AIService.getResponse(aiProvider, message);

    // 4️⃣ Save message to Chat collection
    let chat = await ChatModel.findOne({ clientId: client_id });
    if (!chat) chat = new ChatModel({ clientId: client_id, messages: [] });

    const userMsg: IChatMessage = { from: 'user', text: message };
    const botMsg: IChatMessage = { from: 'bot', text: botReply };

    chat.messages.push(userMsg, botMsg);
    await chat.save();

    // 5️⃣ Return bot reply to frontend
    return res.json({ reply: botReply });

  } catch (err) {
    console.error('chatWithAI error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
