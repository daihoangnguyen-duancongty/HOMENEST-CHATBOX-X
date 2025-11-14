import { Router } from 'express';
import AdminController from '../controllers/AdminController';
import { adminAuth } from '../middlewares/adminAuth';

const router = Router();
router.post('/clients', adminAuth, AdminController.syncClient);

export default router;
