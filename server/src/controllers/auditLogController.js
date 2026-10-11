import asyncHandler from '../utils/asyncHandler.js';
import { AuditLog, User } from '../models/index.js';

/**
 * @desc    Get system-wide audit activity logs with filtering and pagination
 * @route   GET /api/audit-logs
 * @access  Private (Admin only)
 */
export const getAuditLogs = asyncHandler(async (req, res) => {
  const {
    entityType,
    entityId,
    actor,
    action,
    startDate,
    endDate,
    search,
    page = 1,
    limit = 50,
  } = req.query;

  const query = {};

  // Filter by Entity Type
  if (entityType && entityType !== 'All') {
    query.entityType = entityType;
  }

  // Filter by Entity ID
  if (entityId) {
    query.entityId = entityId;
  }

  // Filter by Action
  if (action && action !== 'All') {
    query.action = action;
  }

  // Filter by Actor (Search by User ID or Name)
  if (actor) {
    // If valid ObjectId, match directly
    if (actor.match(/^[0-9a-fA-F]{24}$/)) {
      query.user = actor;
    } else {
      // Find users matching name or email
      const matchedUsers = await User.find({
        $or: [
          { name: { $regex: actor, $options: 'i' } },
          { email: { $regex: actor, $options: 'i' } },
        ],
      }).select('_id');

      const userIds = matchedUsers.map((u) => u._id);
      query.user = { $in: userIds };
    }
  }

  // Filter by Date Range (startDate, endDate)
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) {
      query.createdAt.$gte = new Date(startDate);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query.createdAt.$lte = end;
    }
  }

  // Text search on details or action
  if (search) {
    query.$or = [
      { action: { $regex: search, $options: 'i' } },
      { 'details.remarks': { $regex: search, $options: 'i' } },
      { 'details.poNumber': { $regex: search, $options: 'i' } },
      { 'details.companyName': { $regex: search, $options: 'i' } },
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const total = await AuditLog.countDocuments(query);
  const logs = await AuditLog.find(query)
    .populate('user', 'name email role department')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum);

  res.status(200).json({
    status: 'success',
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum) || 1,
    count: logs.length,
    data: logs,
  });
});

/**
 * @desc    Get single audit log entry by ID
 * @route   GET /api/audit-logs/:id
 * @access  Private (Admin only)
 */
export const getAuditLogById = asyncHandler(async (req, res) => {
  const log = await AuditLog.findById(req.params.id).populate(
    'user',
    'name email role department'
  );

  if (!log) {
    res.status(404);
    throw new Error('Audit log entry not found');
  }

  res.status(200).json({
    status: 'success',
    data: log,
  });
});

export default {
  getAuditLogs,
  getAuditLogById,
};
