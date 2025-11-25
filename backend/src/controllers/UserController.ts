import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { ClientModel } from '../models/Client';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import cloudinary from '../config/cloudinary';
import { UploadApiResponse } from 'cloudinary';
import multer from 'multer';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';





// Sử dụng memoryStorage để upload trực tiếp lên Cloudinary
export const uploadAvatar = multer({ storage: multer.memoryStorage() });

// =========================
// 1) CLIENT TẠO EMPLOYEE
// =========================
export const clientCreateEmployee = async (req: Request, res: Response) => {
  try {
    const { username, name, password } = req.body;
    const file = req.file; // memoryStorage
    const clientId = req.user?.clientId;

    if (!username || !name || !password) {
      return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });
    }

    // Check username unique
    const existing = await UserModel.findOne({ username });
    if (existing) return res.status(400).json({ error: 'Username đã tồn tại' });

    // Upload avatar nếu có
    let avatarUrl = '';
    if (file) {
      const result: UploadApiResponse = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'homenest/homenest-chatbotx-client/employee' },
          (error, result) => (error ? reject(error) : resolve(result!))
        );
        stream.end(file.buffer);
      });
      avatarUrl = result.secure_url;
    }

    // Tạo user
    const newUser = await UserModel.create({
      userId: uuidv4(),
      username,
      name,
      password,
      role: 'employee',
      clientId,
      avatar: avatarUrl,
    });

    return res.json({ ok: true, user: newUser });
  } catch (err) {
    console.error('Create employee error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// =========================
// 2) LOGIN
// =========================
export const loginUser = async (req: Request, res: Response) => {
  const { username, password, clientId } = req.body;

  if (!username || !password || !clientId)
    return res.status(400).json({ error: 'Missing fields' });

  const user = await UserModel.findOne({ username, clientId });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const valid = await user.comparePassword(password);
  if (!valid) return res.status(401).json({ error: 'Invalid password' });

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

// =========================
// 3) CRUD EMPLOYEE
// =========================

// Lấy tất cả employee
export const clientGetEmployees = async (req: any, res: Response) => {
  const loggedUser = req.user;
  if (!loggedUser || loggedUser.role !== 'client')
    return res.status(403).json({ error: 'Forbidden' });

  const employees = await UserModel.find({ clientId: loggedUser.clientId, role: 'employee' }).select('-password');
  return res.json({ ok: true, employees });
};

// Lấy chi tiết 1 employee
export const clientGetEmployee = async (req: any, res: Response) => {
  const loggedUser = req.user;
  const { userId } = req.params;

  if (!loggedUser || loggedUser.role !== 'client')
    return res.status(403).json({ error: 'Forbidden' });

  const employee = await UserModel.findOne({ userId, clientId: loggedUser.clientId, role: 'employee' }).select('-password');
  if (!employee) return res.status(404).json({ error: 'Employee not found' });

  return res.json({ ok: true, employee });
};

// Update employee
export const clientUpdateEmployee = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { username, name, password } = req.body;
    const file = req.file;
    const clientId = req.user?.clientId;

    const user = await UserModel.findOne({ userId, clientId });
    if (!user) return res.status(404).json({ error: 'Nhân viên không tồn tại' });

    if (username && username !== user.username) {
      const exists = await UserModel.findOne({ username });
      if (exists) return res.status(400).json({ error: 'Username đã tồn tại' });
      user.username = username;
    }

    if (name) user.name = name;
    if (password) user.password = password;

    if (file) {
      const result: UploadApiResponse = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'homenest/homenest-chatbotx-client/employee' },
          (error, result) => (error ? reject(error) : resolve(result!))
        );
        stream.end(file.buffer);
      });
      user.avatar = result.secure_url;
    }

    await user.save();
    return res.json({ ok: true, user });
  } catch (err) {
    console.error('Update employee error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Delete employee
export const clientDeleteEmployee = async (req: any, res: Response) => {
  const loggedUser = req.user;
  const { userId } = req.params;

  if (!loggedUser || loggedUser.role !== 'client')
    return res.status(403).json({ error: 'Forbidden' });

  const employee = await UserModel.findOneAndDelete({ userId, clientId: loggedUser.clientId, role: 'employee' });
  if (!employee) return res.status(404).json({ error: 'Employee not found' });

  // Giảm user_count của client
  const client = await ClientModel.findOne({ clientId: loggedUser.clientId });
  if (client) {
    client.user_count = Math.max((client.user_count ?? 1) - 1, 0);
    await client.save();
  }

  return res.json({ ok: true, message: 'Employee deleted' });
};
