import { Request, Response } from 'express';
import AIService from '../services/AIService';
import { ClientModel } from '../models/Client';
 // MongoDB model

export const chatWithAI = async (req: Request, res: Response) => {
  try {
    const { client_id, message } = req.body;
    if (!client_id || !message) {
      return res.status(400).json({ error: 'Missing client_id or message' });
    }

    // 1️⃣ Check client exists
    const client = await ClientModel.findOne({ clientId: client_id });
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    // 2️⃣ Determine AI provider (openai, claude, gemini)
    const aiProvider = client.ai_provider || 'openai';

    // 3️⃣ Call AI service
    const reply = await AIService.getResponse(aiProvider, message);

    // 4️⃣ Return to frontend widget
    return res.json({ reply });

  } catch (err) {
    console.error('chatWithAI error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
