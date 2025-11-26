// DÙNG CHO CLIENT TẠO CLIENT-OWNER VÀ CLIENT TẠO USER NHÂN VIÊN
import { Router } from 'express';
import {
  clientCreateEmployee,
  clientGetEmployees,
  clientGetEmployee,
  clientUpdateEmployee,
  clientDeleteEmployee,
  loginUser,
} from '../controllers/UserController';
import { uploadAvatar } from '../controllers/UserController';
import AdminController from '../controllers/AdminController';
import { authMiddleware } from '../middlewares/auth';
import { requireRole } from '../middlewares/role';
import { adminAuth } from '../middlewares/adminAuth';
import { clientSendSupport } from "../controllers/UserController";

const router = Router();

// Admin tạo Client Owner
// router.post('/admin/create-client-user', adminAuth, clientCreateEmployee);
// Route mở lại client sau khi đóng phí
router.post('/client/reactivate', authMiddleware, AdminController.reactivateClient);
// Client CRUD employee
router.post('/client/create-employee', authMiddleware, requireRole('client'), uploadAvatar.single('avatar'), clientCreateEmployee);
router.get('/client/employees', authMiddleware, requireRole('client'), clientGetEmployees);
router.get('/client/employees/:userId', authMiddleware, requireRole('client'), clientGetEmployee);
router.put('/client/employees/:userId', authMiddleware, requireRole('client'), uploadAvatar.single('avatar'), clientUpdateEmployee);
router.delete('/client/employees/:userId', authMiddleware, requireRole('client'), clientDeleteEmployee);
// Client gửi hỗ trợ
router.post(
  "/client/support",
  authMiddleware,
  requireRole("client"),
  clientSendSupport
);

// Login chung
router.post('/login', loginUser);

export default router;
