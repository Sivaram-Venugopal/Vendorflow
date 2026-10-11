import express from 'express';
import {
  createPurchaseOrder,
  getPurchaseOrders,
  getPurchaseOrderById,
  transitionPOStatus,
} from '../controllers/purchaseOrderController.js';
import {
  authMiddleware,
  roleMiddleware,
} from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. Create Purchase Order (Buyer or Admin)
router.post(
  '/',
  authMiddleware,
  roleMiddleware('Buyer', 'Admin'),
  createPurchaseOrder
);

// 2. List Purchase Orders (Scoped by user role: Buyer, Vendor, Admin)
router.get(
  '/',
  authMiddleware,
  getPurchaseOrders
);

// 3. Get Single Purchase Order Details with History
router.get(
  '/:id',
  authMiddleware,
  getPurchaseOrderById
);

// 4. Transition Status (State Machine + Role-Gated)
router.patch(
  '/:id/status',
  authMiddleware,
  transitionPOStatus
);

export default router;
