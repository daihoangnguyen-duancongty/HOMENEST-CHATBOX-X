// tạo Admin HomeNest
// routes/AdminAuthRoutes.ts
import { Router } from "express";
import { AdminModel } from "../models/Admin";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// ────────────────
// Register Admin Homenest
// ────────────────
router.post("/register", async (req, res) => {
  try {
    const { username, password, name, avatar } = req.body;

    if (!username || !password || !name) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Kiểm tra xem admin đã tồn tại chưa
    const exists = await AdminModel.findOne({ username });
    if (exists) {
      return res.status(400).json({ error: "Admin already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo admin mới
    const admin = await AdminModel.create({
      userId: `admin-${Date.now()}`,
      username,
      password: hashedPassword,
      name,
      avatar: avatar || null,
      role: "admin",
      created_at: new Date(),
    });

    // Tạo token JWT
    const token = jwt.sign({
      userId: admin.userId,
      username: admin.username,
      role: admin.role,
        avatar: admin.avatar,   
  name: admin.name       
    }, JWT_SECRET, { expiresIn: "7d" });

    return res.json({
      ok: true,
      token,
      admin: {
        username: admin.username,
        name: admin.name,
        role: admin.role,
        avatar: admin.avatar,
      },
    });

  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// ────────────────
// Login Admin Homenest
// ────────────────
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: "Missing fields" });

    const admin = await AdminModel.findOne({ username });
    if (!admin) return res.status(404).json({ error: "Admin not found" });

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign({
      userId: admin.userId,
      username: admin.username,
      role: admin.role,
    }, JWT_SECRET, { expiresIn: "7d" });

    return res.json({
      ok: true,
      token,
      admin: {
        username: admin.username,
        name: admin.name,
        role: admin.role,
        avatar: admin.avatar,
      },
    });

  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
