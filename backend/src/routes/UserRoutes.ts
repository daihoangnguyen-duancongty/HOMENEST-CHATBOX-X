// DÙNG CHO CLIENT TẠO CLIENT-OWNER VÀ CLIENT TẠO USER NHÂN VIÊN
import { Router } from 'express';
import {
  clientCreateEmployee,
  loginUser,
} from '../controllers/UserController';
import AdminController from '../controllers/AdminController';
import { authMiddleware } from '../middlewares/auth';
import { requireRole } from '../middlewares/role';
import { adminAuth } from '../middlewares/adminAuth';

const router = Router();

// Admin tạo Client Owner
router.post('/admin/create-client-user', adminAuth, clientCreateEmployee);
// Route mở lại client sau khi đóng phí
router.post('/client/reactivate', authMiddleware, AdminController.reactivateClient);
// Client tạo Employee
router.post('/client/create-employee', authMiddleware, requireRole('client'), clientCreateEmployee);

// Login chung
router.post('/login', loginUser);

export default router;
