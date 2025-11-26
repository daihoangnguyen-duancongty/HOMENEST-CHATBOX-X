import { Router } from 'express';
import AdminController from '../controllers/AdminController';
import { adminAuth } from '../middlewares/adminAuth';
import { upload } from '../middlewares/upload';

const router = Router();

// Sync phải đặt trước
router.post('/clients/sync', adminAuth, AdminController.syncClient);

// CRUD clients
router.get('/clients', adminAuth, AdminController.getClients);
router.get('/clients/:clientId', adminAuth, AdminController.getClientById);
router.post('/clients', adminAuth, upload.single('avatar'), AdminController.createClient);
router.put('/clients/:clientId', adminAuth, upload.single('avatar'), AdminController.updateClient);
router.delete('/clients/:clientId', adminAuth, AdminController.deleteClient);

// Khóa client
router.post('/clients/reactivate', adminAuth, AdminController.reactivateClient);
router.post('/clients/deactivate', adminAuth, AdminController.deactivateClient);
// Plans CRUD
router.get('/plans', adminAuth, AdminController.getPlans);
router.post('/plans', adminAuth, AdminController.createPlan);
router.put('/plans/:id', adminAuth, AdminController.updatePlan);
router.delete('/plans/:id', adminAuth, AdminController.deletePlan);
// Support
router.get(
  "/admin/support-tickets",
  adminAuth,
  AdminController.getSupportTickets
);
router.post('/admin-api/support-tickets/:ticketId/reply', AdminController.replySupportTicket);
// stats
router.get('/dashboard', adminAuth, AdminController.getDashboard);

export default router;
