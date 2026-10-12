import express from 'express';
import {
  createEvaluation,
  getVendorEvaluations,
  getVendorsComparison,
} from '../controllers/evaluationController.js';
import {
  authMiddleware,
  roleMiddleware,
} from '../middleware/authMiddleware.js';
import { validateEvaluation } from '../middleware/validator.js';

const router = express.Router();

// 1. Submit a vendor evaluation (Buyer or Admin)
router.post(
  '/',
  authMiddleware,
  roleMiddleware('Buyer', 'Admin'),
  validateEvaluation,
  createEvaluation
);

// 2. Compare tiers and scores across all vendors (Admin only)
router.get(
  '/comparison',
  authMiddleware,
  roleMiddleware('Admin'),
  getVendorsComparison
);

// 3. Get evaluation history for a vendor
router.get(
  '/vendor/:id',
  authMiddleware,
  getVendorEvaluations
);

export default router;
