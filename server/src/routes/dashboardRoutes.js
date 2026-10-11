import express from 'express';
import {
  getAdminDashboard,
  getBuyerDashboard,
  getVendorDashboard,
} from '../controllers/dashboardController.js';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/admin', roleMiddleware('Admin'), getAdminDashboard);
router.get('/buyer', roleMiddleware('Buyer', 'Admin'), getBuyerDashboard);
router.get('/vendor', roleMiddleware('Vendor'), getVendorDashboard);

export default router;
