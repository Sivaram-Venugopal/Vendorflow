import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { User, Vendor, PurchaseOrder, Evaluation, AuditLog, Notification } from './src/models/index.js';
import { logAudit } from './src/utils/auditLogger.js';
import { 
  sendVendorStatusEmail, 
  sendEvaluationEmail, 
  sendPOStatusChangeEmail 
} from './src/utils/mailer.js';

const runTest = async () => {
  console.log('🧪 Starting Phase 6 Backend Verification...');
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vendorflow');
  console.log(' Connected to MongoDB');

  const admin = await User.findOne({ role: 'Admin' });
  const buyer = await User.findOne({ role: 'Buyer' });
  const vendor = await Vendor.findOne();
  const po = await PurchaseOrder.findOne();

  if (!admin || !vendor) {
    console.error('❌ Database missing seeded Admin or Vendor');
    process.exit(1);
  }

  // 1. Test Vendor Status Email & Audit
  console.log('\n--- 1. Testing Vendor Status Email & logAudit ---');
  const vEmail = await sendVendorStatusEmail({
    vendor,
    status: 'Approved',
    reason: 'Verified statutory documents during automated audit',
    recipientEmail: vendor.contactEmail || 'supplier@test.internal',
    updatedBy: admin.name,
  });
  console.log('✅ Vendor email dispatched. Preview URL:', vEmail.previewUrl);

  const mockReq = {
    user: admin,
    ip: '127.0.0.1',
    headers: { 'user-agent': 'VendorFlow-Audit-Tester/1.0' },
  };

  const vAudit = await logAudit(mockReq, {
    action: 'VENDOR_APPROVED',
    entityType: 'Vendor',
    entityId: vendor._id,
    beforeState: { status: 'Pending' },
    afterState: { status: 'Approved' },
    details: {
      companyName: vendor.companyName,
      emailPreviewUrl: vEmail.previewUrl,
    },
    notify: {
      recipient: vendor.owner,
      targetRole: 'Vendor',
      title: 'Vendor Approved',
      message: 'Your vendor profile has been approved.',
      type: 'VENDOR_STATUS',
      emailPreviewUrl: vEmail.previewUrl,
    },
  });
  console.log('✅ Vendor AuditLog recorded with ID:', vAudit._id);

  // 2. Test Evaluation Email & Audit
  console.log('\n--- 2. Testing Evaluation Email & logAudit ---');
  const evalEmail = await sendEvaluationEmail({
    vendor,
    evaluation: {
      overallScore: 4.8,
      ratingTier: 'Preferred',
      scores: { quality: 5.0, delivery: 4.6, pricing: 4.8, compliance: 5.0 },
      notes: 'Exceptional SLA delivery metrics',
    },
    recipientEmail: vendor.contactEmail || 'supplier@test.internal',
    evaluatorName: buyer?.name || 'Buyer Lead',
  });
  console.log('✅ Evaluation email dispatched. Preview URL:', evalEmail.previewUrl);

  const evalAudit = await logAudit(mockReq, {
    action: 'EVALUATION_SUBMITTED',
    entityType: 'Evaluation',
    entityId: new mongoose.Types.ObjectId(),
    beforeState: { overallRating: 4.0, ratingTier: 'Approved' },
    afterState: { overallRating: 4.8, ratingTier: 'Preferred' },
    details: {
      vendorId: vendor._id,
      vendorName: vendor.companyName,
      emailPreviewUrl: evalEmail.previewUrl,
    },
    notify: {
      recipient: vendor.owner,
      targetRole: 'Vendor',
      title: 'New Evaluation Scorecard',
      message: 'Scorecard issued: 4.8 / 5.0 Preferred tier.',
      type: 'EVALUATION',
      emailPreviewUrl: evalEmail.previewUrl,
    },
  });
  console.log('✅ Evaluation AuditLog recorded with ID:', evalAudit._id);

  // 3. Test PO Status Change Email & Audit
  if (po) {
    console.log('\n--- 3. Testing PO Status Change Email & logAudit ---');
    const poEmail = await sendPOStatusChangeEmail({
      po,
      fromStatus: 'Approved',
      toStatus: 'Sent',
      remarks: 'Transmitted purchase order agreement',
      recipientEmail: vendor.contactEmail || 'supplier@test.internal',
      actorName: buyer?.name || 'Buyer Lead',
    });
    console.log('✅ PO email dispatched. Preview URL:', poEmail.previewUrl);

    const poAudit = await logAudit(mockReq, {
      action: 'PO_STATUS_UPDATED',
      entityType: 'PurchaseOrder',
      entityId: po._id,
      beforeState: { status: 'Approved' },
      afterState: { status: 'Sent' },
      details: {
        poNumber: po.poNumber,
        fromStatus: 'Approved',
        toStatus: 'Sent',
        emailPreviewUrl: poEmail.previewUrl,
      },
      notify: {
        targetRole: 'Vendor',
        title: `PO ${po.poNumber} Status: Sent`,
        message: 'A new purchase order was sent for fulfillment.',
        type: 'PO_STATUS',
        emailPreviewUrl: poEmail.previewUrl,
      },
    });
    console.log('✅ PO AuditLog recorded with ID:', poAudit._id);
  }

  // 4. Verify querying AuditLog with filters
  console.log('\n--- 4. Querying Audit Logs via Mongoose ---');
  const count = await AuditLog.countDocuments({ user: admin._id });
  console.log(`✅ Total AuditLogs for Admin: ${count}`);

  const notifCount = await Notification.countDocuments();
  console.log(`✅ Total in-app Notifications generated: ${notifCount}`);

  await mongoose.disconnect();
  console.log('\n🎉 Phase 6 Backend Verification Succeeded cleanly!\n');
};

runTest().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
