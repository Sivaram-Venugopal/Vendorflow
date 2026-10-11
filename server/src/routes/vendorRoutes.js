import express from 'express';
import {
  registerVendorProfile,
  uploadDocument,
  getVendors,
  getMyVendorProfile,
  updateVendorStatus,
} from '../controllers/vendorController.js';
import { getVendorEvaluations } from '../controllers/evaluationController.js';
import {
  authMiddleware,
  roleMiddleware,
} from '../middleware/authMiddleware.js';
import { uploadKYCDocument } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// 1. Get current logged-in vendor's own profile
router.get(
  '/me',
  authMiddleware,
  roleMiddleware('Vendor'),
  getMyVendorProfile
);

// 2. Self-register vendor profile (creates in status=Pending)
router.post(
  '/',
  authMiddleware,
  roleMiddleware('Vendor'),
  registerVendorProfile
);

// 3. Upload KYC document (Vendor or Admin)
router.post(
  '/documents',
  authMiddleware,
  uploadKYCDocument.single('file'),
  uploadDocument
);

// 4. Admin/Buyer: List vendors with status filter and search
router.get(
  '/',
  authMiddleware,
  roleMiddleware('Admin', 'Buyer'),
  getVendors
);

// 5. Admin: Update vendor approval status (approve/reject with reason)
router.patch(
  '/:id/status',
  authMiddleware,
  roleMiddleware('Admin'),
  updateVendorStatus
);

// 6. Get evaluations for a specific vendor
router.get(
  '/:id/evaluations',
  authMiddleware,
  getVendorEvaluations
);

export default router;
