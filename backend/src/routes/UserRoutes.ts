import { Router } from "express";
import {
  adminCreateClientUser,
  clientCreateEmployee,
  loginUser,
} from "../controllers/UserController";
import { reactivateClient } from "../controllers/AdminController";
import { authMiddleware } from "../middlewares/auth";
import { requireRole } from "../middlewares/role";
import { adminAuth } from "../middlewares/adminAuth";

const router = Router();

// Admin tạo Client Owner
router.post("/admin/create-client-user", adminAuth, adminCreateClientUser);
// Route mở lại client sau khi đóng phí
router.post("/client/reactivate", authMiddleware, reactivateClient);
// Client tạo Employee
router.post("/client/create-employee", authMiddleware, requireRole("client"), clientCreateEmployee);

// Login chung
router.post("/login-client", loginUser);

export default router;
