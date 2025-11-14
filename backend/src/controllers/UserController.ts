import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { ClientModel } from '../models/Client';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export const registerUser = async (req: Request, res: Response) => {
  const { clientId, username, password, name, avatar } = req.body;
  if (!clientId || !username || !password || !name) return res.status(400).json({ error: 'Missing fields' });

  const client = await ClientModel.findOne({ clientId });
  if (!client) return res.status(404).json({ error: 'Client not found' });

  const exists = await UserModel.findOne({ username, clientId });
  if (exists) return res.status(400).json({ error: 'Username already exists' });

  const user = new UserModel({ userId: uuidv4(), clientId, username, password, name, avatar });
  await user.save();

  // tăng user_count cho client
  client.user_count = (client.user_count || 0) + 1;
  await client.save();

  res.json({ ok: true, userId: user.userId });
};

export const loginUser = async (req: Request, res: Response) => {
  const { clientId, username, password } = req.body;
  if (!clientId || !username || !password) return res.status(400).json({ error: 'Missing fields' });

  const user = await UserModel.findOne({ clientId, username });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const valid = await user.comparePassword(password);
  if (!valid) return res.status(401).json({ error: 'Invalid password' });

  const token = jwt.sign({ userId: user.userId, clientId: user.clientId, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ ok: true, token, user: { name: user.name, avatar: user.avatar } });
};
