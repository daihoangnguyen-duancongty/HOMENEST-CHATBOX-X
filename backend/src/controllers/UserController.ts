import { Request, Response } from "express";
import { UserModel } from "../models/User";
import { ClientModel } from "../models/Client";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

//
// ──────────────────────────────────────────────────────────────
// 1) ADMIN TẠO CLIENT-OWNER
// ──────────────────────────────────────────────────────────────
//


export const adminCreateClientUser = async (req: Request, res: Response) => {
  try {
    const { clientId, username, password, name, avatar, ai_provider, api_keys, meta } = req.body;

    if (!clientId || !username || !password || !name) 
      return res.status(400).json({ error: "Missing fields" });

    const exists = await UserModel.findOne({ username, clientId });
    if (exists) return res.status(400).json({ error: "Username already exists" });

    // Tạo client-owner
    const user = await UserModel.create({
      userId: uuidv4(),
      clientId,
      username,
      password,
      name,
      avatar,
      role: "client",
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
        ai_provider: ai_provider || "openai",
        api_keys: api_keys || {},
        meta: meta || {},
        user_count: 1,
        active: true,
        trial: true,
        trial_end: trialEnd,
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
    const loggedUser: any = req.body._user; // từ middleware auth

    if (loggedUser.role !== "client")
      return res.status(403).json({ error: "Forbidden" });

    const clientId = loggedUser.clientId;
    const { username, password, name, avatar } = req.body;

    if (!username || !password || !name)
      return res.status(400).json({ error: "Missing fields" });

    const exists = await UserModel.findOne({ username, clientId });
    if (exists) return res.status(400).json({ error: "Username already exists" });

    // Tạo nhân viên
    const user = await UserModel.create({
      userId: uuidv4(),
      clientId,
      username,
      password,
      name,
      avatar,
      role: "employee",
    });

    // ✅ Tăng user_count cho client hiện có
    const client = await ClientModel.findOne({ clientId });
    if (client) {
      client.user_count = (client.user_count || 0) + 1;
      await client.save();
    } else {
      // Client không tồn tại → không tạo mới, log cảnh báo
      console.warn(`Client ${clientId} not found when creating employee`);
    }

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
  const { clientId, username, password } = req.body;

  if (!clientId || !username || !password)
    return res.status(400).json({ error: "Missing fields" });

  const user = await UserModel.findOne({ clientId, username });
  if (!user) return res.status(404).json({ error: "User not found" });

  const valid = await user.comparePassword(password);
  if (!valid) return res.status(401).json({ error: "Invalid password" });

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
    { expiresIn: "7d" }
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
