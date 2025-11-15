import { Router } from "express";
import {
  adminCreateClientUser,
  clientCreateEmployee,
  loginUser,
} from "../controllers/UserController";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { reactivateClient } from "../controllers/AdminController";
import { authMiddleware } from "../middlewares/auth";
import { requireRole } from "../middlewares/role";
import { adminAuth } from "../middlewares/adminAuth";
import { UserModel } from "../models/User";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Admin tạo Client Owner
router.post("/admin/create-client-user", adminAuth, adminCreateClientUser);
// Route mở lại client sau khi đóng phí
router.post("/client/reactivate", authMiddleware, reactivateClient);
// Client tạo Employee
router.post("/client/create-employee", authMiddleware, requireRole("client"), clientCreateEmployee);


//  Login chung cho Admin Homenest + Client + Employee
// ────────────────
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // Tìm user theo username
    const user = await UserModel.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    // So sánh mật khẩu
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid password" });

    // Tạo token JWT
    const token = jwt.sign({
      userId: user.userId,
      username: user.username,
      role: user.role,
      clientId: user.clientId
    }, JWT_SECRET, { expiresIn: "7d" });

    return res.json({
      ok: true,
      token,
      user: {
        username: user.username,
        role: user.role,
        name: user.name,
        clientId: user.clientId
      }
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
