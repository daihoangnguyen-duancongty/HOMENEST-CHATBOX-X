import { Request, Response, NextFunction } from 'express';

export function adminAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers['authorization'] as string | undefined;
  if (!header || !header.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  const token = header.split(' ')[1];
  const expected = process.env.ADMIN_SYNC_TOKEN;
  if (!expected) return res.status(500).json({ error: 'Server misconfigured' });
  if (token !== expected) return res.status(403).json({ error: 'Forbidden' });
  next();
}
