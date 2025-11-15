import { Router } from 'express';
import AdminController from '../controllers/AdminController';
import { adminAuth } from '../middlewares/adminAuth';

const router = Router();


// tạo client mới
router.post('/clients', adminAuth, AdminController.syncClient);

export default router;
