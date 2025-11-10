// src/routes/admin.routes.ts
import { Router } from 'express';
import AdminController from '../controllers/AdminController';
import { adminAuth } from '../middlewares/adminAuth';

const router = Router();

// Protected route for WP dashboard to sync clients
router.post('/clients', adminAuth, AdminController.syncClient);

export default router;
