import express from 'express';
import {
  getMyNotifications,
  markNotificationRead,
  getRecentEmails,
} from '../controllers/notificationController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validateNotificationId } from '../middleware/validator.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getMyNotifications);
router.patch('/:id/read', validateNotificationId, markNotificationRead);
router.get('/recent-emails', getRecentEmails);

export default router;
