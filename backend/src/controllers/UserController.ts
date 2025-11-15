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
    const { clientId, username, password, name, avatar } = req.body;

    if (!clientId || !username || !password || !name)
      return res.status(400).json({ error: "Missing fields" });

    const exists = await UserModel.findOne({ username, clientId });
    if (exists) return res.status(400).json({ error: "Username already exists" });

    // Tạo client owner
    const user = await UserModel.create({
      userId: uuidv4(),
      clientId,
      username,
      password,
      name,
      avatar,
      role: "client",
    });

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
    const loggedUser: any = req.body._user; // được đính từ middleware

    if (loggedUser.role !== "client")
      return res.status(403).json({ error: "Forbidden" });

    const clientId = loggedUser.clientId;
    const { username, password, name, avatar } = req.body;

    if (!username || !password || !name)
      return res.status(400).json({ error: "Missing fields" });

    const exists = await UserModel.findOne({ username, clientId });
    if (exists) return res.status(400).json({ error: "Username already exists" });

    // Tạo nhân viên telesale
    const user = await UserModel.create({
      userId: uuidv4(),
      clientId,
      username,
      password,
      name,
      avatar,
      role: "employee",
    });

    // Tăng số lượng user cho client
    await ClientModel.updateOne(
      { clientId },
      { $inc: { user_count: 1 } },
    );

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

  // Thêm role vào token!
  const token = jwt.sign(
    {
      userId: user.userId,
      clientId: user.clientId,
      name: user.name,
      avatar: user.avatar,
      role: user.role, // <<< BẮT BUỘC !!!
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
