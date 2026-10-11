import express from 'express';
import {
  getMyNotifications,
  markNotificationRead,
  getRecentEmails,
} from '../controllers/notificationController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getMyNotifications);
router.patch('/:id/read', markNotificationRead);
router.get('/recent-emails', getRecentEmails);

export default router;
