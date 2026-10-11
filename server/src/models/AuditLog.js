import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Audit log must record the performing User'],
      index: true,
    },
    action: {
      type: String,
      required: [true, 'Action type is required'],
      enum: [
        'USER_LOGIN',
        'VENDOR_CREATED',
        'VENDOR_UPDATED',
        'VENDOR_APPROVED',
        'VENDOR_REJECTED',
        'EVALUATION_SUBMITTED',
        'PO_CREATED',
        'PO_STATUS_UPDATED',
        'PO_ACKNOWLEDGED',
        'PO_DELIVERED',
        'PO_CANCELLED',
      ],
      index: true,
    },
    entityType: {
      type: String,
      required: [true, 'Entity type is required'],
      enum: ['User', 'Vendor', 'Evaluation', 'PurchaseOrder'],
      index: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Entity ID is required'],
      index: true,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Audit logs are immutable
  }
);

// Compound index for querying audit events on an entity over time
auditLogSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });
auditLogSchema.index({ user: 1, createdAt: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
