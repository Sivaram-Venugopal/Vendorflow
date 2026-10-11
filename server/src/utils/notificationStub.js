/**
 * Notification service stub.
 * Phase 6/8 wires up real Nodemailer and in-app alerts.
 *
 * @param {Object} payload - Details of the event
 */
export const notifyVendorStatusChange = async ({
  vendorId,
  vendorName,
  recipientEmail,
  status,
  reason,
  updatedBy,
}) => {
  console.log('----------------------------------------------------');
  console.log(`🔔 [NOTIFICATION STUB] Vendor Status Update Dispatched`);
  console.log(`🏢 Vendor: ${vendorName} (ID: ${vendorId})`);
  console.log(`📧 Recipient: ${recipientEmail}`);
  console.log(`📌 New Status: [${status}]`);
  if (reason) console.log(`📝 Reason: ${reason}`);
  console.log(`👤 Reviewed by Admin: ${updatedBy}`);
  console.log(`⏱️ Timestamp: ${new Date().toISOString()}`);
  console.log('----------------------------------------------------');

  return {
    dispatched: true,
    recipientEmail,
    status,
    timestamp: new Date().toISOString(),
  };
};

export default {
  notifyVendorStatusChange,
};
