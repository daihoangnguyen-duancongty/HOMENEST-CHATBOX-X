import { Router } from 'express';
import AdminController from '../controllers/AdminController';
import { adminAuth } from '../middlewares/adminAuth';

const router = Router();

// Sync phải đặt trước
router.post('/clients/sync', adminAuth, AdminController.syncClient);

// CRUD clients
router.get('/clients', adminAuth, AdminController.getClients);
router.get('/clients/:clientId', adminAuth, AdminController.getClientById);
router.post('/clients', adminAuth, AdminController.createClient);
router.put('/clients/:clientId', adminAuth, AdminController.updateClient);
router.delete('/clients/:clientId', adminAuth, AdminController.deleteClient);

// Reactivate
router.post('/clients/reactivate', adminAuth, AdminController.reactivateClient);

// Plans CRUD
router.get('/plans', adminAuth, AdminController.getPlans);
router.post('/plans', adminAuth, AdminController.createPlan);
router.put('/plans/:id', adminAuth, AdminController.updatePlan);
router.delete('/plans/:id', adminAuth, AdminController.deletePlan);

export default router;
