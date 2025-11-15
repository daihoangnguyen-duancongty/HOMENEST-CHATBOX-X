import { Router } from "express";
import {
  adminCreateClientUser,
  clientCreateEmployee,
  loginUser,
} from "../controllers/UserController";

import { authMiddleware } from "../middlewares/auth";
import { requireRole } from "../middlewares/role";
import { adminAuth } from "../middlewares/adminAuth";

const router = Router();

// Admin tạo Client Owner
router.post("/admin/create-client-user", adminAuth, adminCreateClientUser);

// Client tạo Employee
router.post("/client/create-employee", authMiddleware, requireRole("client"), clientCreateEmployee);

// Login chung
router.post("/login", loginUser);

export default router;
