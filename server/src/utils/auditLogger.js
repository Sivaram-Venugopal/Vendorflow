import { AuditLog, Notification } from '../models/index.js';

/**
 * Centralized Reusable Audit Logger Helper.
 * Invoked across all controllers to record immutable audit logs on state-changing actions
 * (who/what/when/before-after) without duplicate logging code.
 *
 * @param {Object} req - Express request object (captures actor user, IP, User-Agent)
 * @param {Object} params
 * @param {string} params.action - State-changing action (e.g., 'VENDOR_APPROVED', 'PO_STATUS_UPDATED')
 * @param {string} params.entityType - 'Vendor' | 'Evaluation' | 'PurchaseOrder' | 'User'
 * @param {string|mongoose.Types.ObjectId} params.entityId - Mutated entity ID
 * @param {Object} [params.beforeState] - Snapshot of relevant fields before change
 * @param {Object} [params.afterState] - Snapshot of relevant fields after change
 * @param {Object} [params.details] - Metadata (remarks, names, emailPreviewUrl, etc.)
 * @param {Object} [params.notify] - Optional in-app notification trigger config
 * @returns {Promise<AuditLog>} Created AuditLog document
 */
export const logAudit = async (req, {
  action,
  entityType,
  entityId,
  beforeState = null,
  afterState = null,
  details = {},
  notify = null,
}) => {
  try {
    const actorId = req?.user?._id;
    const ipAddress = req?.ip || req?.connection?.remoteAddress || '';
    const userAgent = req?.headers?.['user-agent'] || '';

    const auditEntry = await AuditLog.create({
      user: actorId,
      action,
      entityType,
      entityId,
      beforeState,
      afterState,
      details,
      ipAddress,
      userAgent,
    });

    console.log(
      `🛡️ [AUDIT LOGGED] Action: ${action} | Entity: ${entityType} (${entityId}) | Actor: ${req?.user?.name || actorId}`
    );

    // If notification options provided, also persist in-app Notification record
    if (notify) {
      await Notification.create({
        recipient: notify.recipient || null,
        targetRole: notify.targetRole || 'All',
        title: notify.title || action,
        message: notify.message || `Action ${action} occurred on ${entityType}`,
        type: notify.type || 'SYSTEM',
        entityType,
        entityId,
        emailPreviewUrl: notify.emailPreviewUrl || details.emailPreviewUrl || null,
        metadata: {
          ...details,
          actorName: req?.user?.name,
          actorRole: req?.user?.role,
        },
      });
    }

    return auditEntry;
  } catch (error) {
    console.error(`❌ [AUDIT ERROR] Failed to record audit log for "${action}":`, error.message);
    return null;
  }
};

export default {
  logAudit,
};
