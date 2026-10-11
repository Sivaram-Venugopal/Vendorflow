import express from 'express';
import { getDevVendors } from '../controllers/devController.js';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public seeded vendors route (to be deleted in Phase 7)
router.get('/vendors', getDevVendors);

// Protected sample routes verifying authMiddleware and roleMiddleware:
// 1. Any authenticated user can access /api/dev/protected
router.get('/protected', authMiddleware, (req, res) => {
  res.json({
    status: 'success',
    message: 'Access granted to authenticated user',
    user: req.user,
  });
});

// 2. Only Admin can access /api/dev/admin-only
router.get(
  '/admin-only',
  authMiddleware,
  roleMiddleware('Admin'),
  (req, res) => {
    res.json({
      status: 'success',
      message: 'Access granted: Welcome to Admin restricted zone',
      user: req.user,
    });
  }
);

// 3. Only Buyer or Admin can access /api/dev/buyer-only
router.get(
  '/buyer-only',
  authMiddleware,
  roleMiddleware('Buyer', 'Admin'),
  (req, res) => {
    res.json({
      status: 'success',
      message: 'Access granted: Buyer workspace area',
      user: req.user,
    });
  }
);

// 4. Only Vendor can access /api/dev/vendor-only
router.get(
  '/vendor-only',
  authMiddleware,
  roleMiddleware('Vendor'),
  (req, res) => {
    res.json({
      status: 'success',
      message: 'Access granted: Vendor workspace area',
      user: req.user,
    });
  }
);

export default router;
