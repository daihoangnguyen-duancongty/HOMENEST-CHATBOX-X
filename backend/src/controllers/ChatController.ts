import { Request, Response } from 'express';
import AIService from '../services/AIService';
import { ClientModel } from '../models/Client';
import { ChatModel, IChatMessage } from '../models/Chat';

export const chatWithAI = async (req: Request, res: Response) => {
  try {
    const { client_id, user_id, user_name, user_avatar, message } = req.body;
    if (!client_id || !user_id || !message) return res.status(400).json({ error: 'Missing client_id, user_id, or message' });

   const client = await ClientModel.findOne({ clientId: client_id });
if (!client) return res.status(404).json({ error: 'Client not found' });

const botReply = await AIService.getResponse(client, message);


    let chat = await ChatModel.findOne({ clientId: client_id, userId: user_id });
    if (!chat) {
      chat = new ChatModel({ clientId: client_id, userId: user_id, userName: user_name, userAvatar: user_avatar, messages: [] });
    } else {
      chat.userName = user_name || chat.userName;
      chat.userAvatar = user_avatar || chat.userAvatar;
    }

    const userMsg: IChatMessage = { from: 'user', text: message };
    const botMsg: IChatMessage = { from: 'bot', text: botReply };
    chat.messages.push(userMsg, botMsg);
    await chat.save();

    res.json({ reply: botReply, chatId: chat._id });
  } catch (err) {
    console.error('chatWithAI error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
