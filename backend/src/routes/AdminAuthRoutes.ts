// dung dang ky va dang nhap admin homnest

import { Router } from "express";
import { UserModel } from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// ────────────────
// 1️⃣ Route đăng ký admin
// ────────────────
router.post("/register", async (req, res) => {
  try {
    const { username, password, name, avatar } = req.body;

    if (!username || !password || !name) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // Kiểm tra username đã tồn tại chưa
    const exists = await UserModel.findOne({ username, role: "admin" });
    if (exists) return res.status(400).json({ error: "Username already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo admin mới
    const admin = await UserModel.create({
      userId: `admin-${Date.now()}`,
      clientId: null,
      username,
      password: hashedPassword,
      name,
      avatar: avatar || null,
      role: "admin",
      created_at: new Date(),
    });

    // Tạo token ngay sau khi đăng ký
    const token = jwt.sign({
      userId: admin.userId,
      username: admin.username,
      role: admin.role,
    }, JWT_SECRET, { expiresIn: "7d" });

    return res.json({ ok: true, token, admin: { username: admin.username, name: admin.name, role: admin.role } });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// ────────────────
// 2️⃣ Route login admin
// ────────────────
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ error: "Missing fields" });

    const admin = await UserModel.findOne({ username, role: "admin" });
    if (!admin) return res.status(404).json({ error: "Admin not found" });

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign({
      userId: admin.userId,
      username: admin.username,
      role: admin.role,
    }, JWT_SECRET, { expiresIn: "7d" });

    return res.json({ ok: true, token, admin: { username: admin.username, name: admin.name, role: admin.role } });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
