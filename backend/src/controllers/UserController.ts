// DÙNG CHO CLIENT TẠO CLIENT-OWNER VÀ CLIENT TẠO USER NHÂN VIÊN
import multer from 'multer';
import path from 'path';
import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { ClientModel } from '../models/Client';
import { ClientFileModel } from '../models/ClientFileModel';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import cloudinary from '../config/cloudinary';
import { UploadApiResponse } from 'cloudinary';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/avatars/'); // thư mục lưu avatar
  },
  filename: function (req, file, cb) {
    cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
  },
});

export const uploadAvatar = multer({ storage });

//
// ──────────────────────────────────────────────────────────────
// 1) CLIENT ADMIN TẠO TÀI KHOẢN CHỦ CLIENT-OWNER
// ──────────────────────────────────────────────────────────────
//

// export const adminCreateClientUser = async (req: Request, res: Response) => {
//   try {
//     const { clientId, username, password, name, avatar, ai_provider, api_keys, meta } = req.body;

//     if (!clientId || !username || !password || !name)
//       return res.status(400).json({ error: 'Missing fields' });

//     const exists = await UserModel.findOne({ username, clientId });
//     if (exists) return res.status(400).json({ error: 'Username already exists' });

//     // Tạo client-owner
//     const user = await UserModel.create({
//       userId: uuidv4(),
//       clientId,
//       username,
//       password,
//       name,
//       avatar,
//       role: 'client',
//     });

//     // Tính trial 2 tháng
//     const now = new Date();
//     const trialEnd = new Date();
//     trialEnd.setMonth(trialEnd.getMonth() + 2);

//     // Cập nhật client collection
//     const client = await ClientModel.findOne({ clientId });
//     if (!client) {
//       await ClientModel.create({
//         clientId,
//         name,
//         ai_provider: ai_provider || 'openai',
//         api_keys: api_keys || {},
//         meta: meta || {},
//         user_count: 1,
//         active: true,
//         trial: true,
//         // trial_end: trialEnd,
//         trial_end: null, // vĩnh viễn
//       });
//     } else {
//       // Nếu client đã tồn tại → chỉ tăng user_count
//       client.user_count = (client.user_count || 0) + 1;
//       await client.save();
//     }

//     return res.json({ ok: true, userId: user.userId });
//   } catch (err: any) {
//     return res.status(500).json({ error: err.message });
//   }
// };

//
// ──────────────────────────────────────────────────────────────
// 2) CLIENT TỰ TẠO EMPLOYEE
// ──────────────────────────────────────────────────────────────
//


export const clientCreateEmployee = async (req: Request, res: Response) => {
  try {
    const { username, name, password } = req.body;
    const file = req.file;
    const clientId = req.user?.clientId; // giả sử middleware auth thêm clientId vào req.user

    if (!username || !name || !password) {
      return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });
    }

    // Check username unique
    const existing = await UserModel.findOne({ username });
    if (existing) {
      return res.status(400).json({ error: 'Username đã tồn tại' });
    }

    // Upload avatar lên Cloudinary nếu có
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

    // Tạo user nhân viên
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

//
// ──────────────────────────────────────────────────────────────
// 3) LOGIN (dùng chung cho client + employee)
// ──────────────────────────────────────────────────────────────
//
export const loginUser = async (req: Request, res: Response) => {
  const { username, password, clientId } = req.body;

 if (!username || !password || !clientId)
  return res.status(400).json({ error: 'Missing fields' });

// Tìm user theo BOTH username + clientId
const user = await UserModel.findOne({ username, clientId });
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

//
// ──────────────────────────────────────────────────────────────
// 4) CRUD (dùng chung cho client CRUD employee)
// ──────────────────────────────────────────────────────────────
//

// Lấy danh sách tất cả employee của client
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
// update employee
export const clientUpdateEmployee = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { username, name, password } = req.body;
    const file = req.file;
    const clientId = req.user?.clientId; // giả sử authMiddleware thêm clientId vào req.user

    const user = await UserModel.findOne({ userId, clientId });
    if (!user) return res.status(404).json({ error: 'Nhân viên không tồn tại' });

    // Nếu thay đổi username, check unique
    if (username && username !== user.username) {
      const exists = await UserModel.findOne({ username });
      if (exists) return res.status(400).json({ error: 'Username đã tồn tại' });
      user.username = username;
    }

    if (name) user.name = name;
    if (password) user.password = password;

    // Upload avatar mới nếu có
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
// delete employee
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
