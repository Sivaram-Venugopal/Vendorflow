import asyncHandler from '../utils/asyncHandler.js';
import { Notification } from '../models/index.js';
import { getRecentEmailDispatches } from '../utils/mailer.js';

/**
 * @desc    Get in-app notifications for current user (polled by frontend)
 * @route   GET /api/notifications
 * @access  Private
 */
export const getMyNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const userRole = req.user.role;

  // Query notifications: Admin sees all portal notifications; other roles see targeted/general
  const query =
    userRole === 'Admin'
      ? {}
      : {
          $or: [
            { recipient: userId },
            { targetRole: userRole },
            { targetRole: 'All' },
          ],
        };

  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .limit(30);

  // Mark if read by current user
  const formatted = notifications.map((n) => {
    const isRead = n.readBy.some((uid) => uid.toString() === userId.toString());
    return {
      _id: n._id,
      title: n.title,
      message: n.message,
      type: n.type,
      entityType: n.entityType,
      entityId: n.entityId,
      emailPreviewUrl: n.emailPreviewUrl,
      metadata: n.metadata,
      createdAt: n.createdAt,
      isRead,
    };
  });

  const unreadCount = formatted.filter((n) => !n.isRead).length;

  res.status(200).json({
    status: 'success',
    count: formatted.length,
    unreadCount,
    data: formatted,
  });
});

/**
 * @desc    Mark a notification as read
 * @route   PATCH /api/notifications/:id/read
 * @access  Private
 */
export const markNotificationRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const notification = await Notification.findById(id);
  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  if (!notification.readBy.includes(userId)) {
    notification.readBy.push(userId);
    await notification.save();
  }

  res.status(200).json({
    status: 'success',
    message: 'Notification marked as read',
  });
});

/**
 * @desc    Get recently dispatched Ethereal test emails with live preview URLs
 * @route   GET /api/notifications/recent-emails
 * @access  Private
 */
export const getRecentEmails = asyncHandler(async (req, res) => {
  const emails = getRecentEmailDispatches();
  res.status(200).json({
    status: 'success',
    count: emails.length,
    data: emails,
  });
});

export default {
  getMyNotifications,
  markNotificationRead,
  getRecentEmails,
};
