import express from 'express';
import { getAuditLogs, getAuditLogById } from '../controllers/auditLogController.js';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// All audit log routes are restricted to Admin role
router.use(authMiddleware);
router.use(roleMiddleware('Admin'));

router.get('/', getAuditLogs);
router.get('/:id', getAuditLogById);

export default router;
