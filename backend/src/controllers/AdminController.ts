import { Request, Response, NextFunction } from 'express';
import { ClientModel } from '../models/Client';

export default class AdminController {
  static async syncClient(req: Request, res: Response) {
    try {
      const { action, client } = req.body as { action: string; client: any };
      if (!action || !client?.clientId) return res.status(400).json({ error: 'Missing action or clientId' });

      if (action === 'create' || action === 'update') {
        const doc = await ClientModel.findOneAndUpdate(
          { clientId: client.clientId },
          {
            clientId: client.clientId,
            name: client.name ?? '',
            domain: client.domain ?? null,
            color: client.color ?? '#0b74ff',
            welcome_message: client.welcome_message ?? '',
            ai_provider: client.ai_provider ?? 'openai',
            meta: client.meta ?? {},
            api_keys: {
              openai: client.api_keys?.openai,
              claude: client.api_keys?.claude,
              gemini: client.api_keys?.gemini,
            },
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        return res.json({ ok: true, client: doc });
      } else if (action === 'delete') {
        await ClientModel.deleteOne({ clientId: client.clientId });
        return res.json({ ok: true });
      } else return res.status(400).json({ error: 'Invalid action' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
  }
}
