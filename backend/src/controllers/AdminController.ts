import { Request, Response, NextFunction } from 'express';
import { ClientModel } from '../models/Client';

export default class AdminController {
  // payload example: { action: 'create'|'update'|'delete', client: { clientId, name, domain, color, welcome_message, ai_provider } }
  static async syncClient(req: Request, res: Response, next: NextFunction) {
    try {
      const { action, client } = req.body as { action: string; client: any };
      if (!action || !client || !client.clientId) {
        return res.status(400).json({ error: 'Missing action or client' });
      }

      if (action === 'create' || action === 'update') {
        const filter = { clientId: client.clientId };
        const update = {
          clientId: client.clientId,
          name: client.name ?? '',
          domain: client.domain ?? null,
          color: client.color ?? '#0b74ff',
          welcome_message: client.welcome_message ?? '',
          ai_provider: client.ai_provider ?? 'openai',
          meta: client.meta ?? {},
        };
        const opts = { upsert: true, new: true, setDefaultsOnInsert: true };

        const doc = await ClientModel.findOneAndUpdate(filter, update, opts);
        return res.json({ ok: true, client: doc });
      } else if (action === 'delete') {
        await ClientModel.deleteOne({ clientId: client.clientId });
        return res.json({ ok: true });
      } else {
        return res.status(400).json({ error: 'Invalid action' });
      }
    } catch (err) {
      next(err);
    }
  }
}
