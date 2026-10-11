import asyncHandler from '../utils/asyncHandler.js';
import { Vendor, User } from '../models/index.js';

/**
 * @desc    Get all seeded vendors with populated owner user (Temporary Dev Route)
 * @route   GET /api/dev/vendors
 * @access  Public (Dev only - to be removed in Phase 7)
 */
export const getDevVendors = asyncHandler(async (req, res) => {
  const vendors = await Vendor.find({})
    .populate('owner', 'name email role department')
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    count: vendors.length,
    message: 'Temporary dev route for verifying seeded vendors (to be removed in Phase 7)',
    data: vendors,
  });
});
