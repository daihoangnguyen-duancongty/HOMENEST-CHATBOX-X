// DÙNG CHO CLIENT TẠO CLIENT-OWNER VÀ CLIENT TẠO USER NHÂN VIÊN

import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { ClientModel } from '../models/Client';
import { ClientFileModel } from '../models/ClientFileModel';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

//
// ──────────────────────────────────────────────────────────────
// 1) CLIENT ADMIN TẠO TÀI KHOẢN CHỦ CLIENT-OWNER
// ──────────────────────────────────────────────────────────────
//

export const adminCreateClientUser = async (req: Request, res: Response) => {
  try {
    const { clientId, username, password, name, avatar, ai_provider, api_keys, meta } = req.body;

    if (!clientId || !username || !password || !name)
      return res.status(400).json({ error: 'Missing fields' });

    const exists = await UserModel.findOne({ username, clientId });
    if (exists) return res.status(400).json({ error: 'Username already exists' });

    // Tạo client-owner
    const user = await UserModel.create({
      userId: uuidv4(),
      clientId,
      username,
      password,
      name,
      avatar,
      role: 'client',
    });

    // Tính trial 2 tháng
    const now = new Date();
    const trialEnd = new Date();
    trialEnd.setMonth(trialEnd.getMonth() + 2);

    // Cập nhật client collection
    const client = await ClientModel.findOne({ clientId });
    if (!client) {
      await ClientModel.create({
        clientId,
        name,
        ai_provider: ai_provider || 'openai',
        api_keys: api_keys || {},
        meta: meta || {},
        user_count: 1,
        active: true,
        trial: true,
        // trial_end: trialEnd,
        trial_end: null, // vĩnh viễn
      });
    } else {
      // Nếu client đã tồn tại → chỉ tăng user_count
      client.user_count = (client.user_count || 0) + 1;
      await client.save();
    }

    return res.json({ ok: true, userId: user.userId });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

//
// ──────────────────────────────────────────────────────────────
// 2) CLIENT TỰ TẠO EMPLOYEE
// ──────────────────────────────────────────────────────────────
//
export const clientCreateEmployee = async (req: Request, res: Response) => {
  try {
    const loggedUser: any = req.body._user;

    if (loggedUser.role !== 'client') return res.status(403).json({ error: 'Forbidden' });

    const clientId = loggedUser.clientId;
    const { username, password, name, avatar } = req.body;

    // Check client tồn tại
    const client = await ClientModel.findOne({ clientId });
    if (!client) return res.status(404).json({ error: 'Client not found' });

    // Check limit số employee có thể tạo theo subscription plan
    const maxUsers = client.subscription_plan?.max_users ?? 5;

    if ((client.user_count ?? 0) >= maxUsers) {
      return res.status(403).json({
        error: 'Bạn đã đạt giới hạn user theo gói!',
        limit: maxUsers,
      });
    }
    // Check limit số file train model có thể tạo theo subscription plan
    const maxFiles = client.subscription_plan?.max_files ?? 5;
    const uploadedFilesCount = await ClientFileModel.countDocuments({ clientId });
    if ((uploadedFilesCount ?? 0) >= maxFiles) {
      return res.status(403).json({
        error: 'Bạn đã đạt giới hạn số file train AI cho gói này',
        limit: maxFiles,
      });
    }
    // Check username
    const exists = await UserModel.findOne({ username, clientId });
    if (exists) return res.status(400).json({ error: 'Username already exists' });

    const user = await UserModel.create({
      userId: uuidv4(),
      clientId,
      username,
      password,
      name,
      avatar,
      role: 'employee',
    });

    client.user_count = (client.user_count ?? 0) + 1;

    await client.save();

    return res.json({ ok: true, userId: user.userId });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

//
// ──────────────────────────────────────────────────────────────
// 3) LOGIN (dùng chung cho client + employee)
// ──────────────────────────────────────────────────────────────
//
export const loginUser = async (req: Request, res: Response) => {
  const {  username, password } = req.body;

  if ( !username || !password) return res.status(400).json({ error: 'Missing fields' });

  const user = await UserModel.findOne({  username });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const valid = await user.comparePassword(password);
  if (!valid) return res.status(401).json({ error: 'Invalid password' });

  // Thêm role vào token
  const token = jwt.sign(
    {
      userId: user.userId,
      clientId: user.clientId,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return res.json({
    ok: true,
    token,
    user: {
      name: user.name,
      avatar: user.avatar,
      role: user.role,
      clientId: user.clientId,
    },
  });
};
