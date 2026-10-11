import nodemailer from 'nodemailer';

let transporterPromise = null;
const recentEmails = [];

/**
 * Initialize or reuse Nodemailer Transporter.
 * In development, automatically provisions an Ethereal test account if SMTP credentials
 * are not provided in environment variables.
 */
export const getTransporter = async () => {
  if (!transporterPromise) {
    transporterPromise = (async () => {
      // 1. If explicit SMTP env credentials are provided
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        return nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });
      }

      // 2. Default: Provision ephemeral Ethereal test account for dev/testing
      const testAccount = await nodemailer.createTestAccount();
      console.log('----------------------------------------------------');
      console.log('📧 [NODEMAILER] Initialized Ethereal Test SMTP Server');
      console.log(`👤 User: ${testAccount.user}`);
      console.log(`🌐 Server: ${testAccount.smtp.host}:${testAccount.smtp.port}`);
      console.log('----------------------------------------------------');

      return nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    })();
  }

  return transporterPromise;
};

/**
 * Low-level email sender returning Ethereal preview URL
 */
export const sendMail = async ({ to, subject, html, text }) => {
  try {
    const transporter = await getTransporter();
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"VendorFlow Portal" <no-reply@vendorflow.internal>',
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>?/gm, ''),
    });

    const previewUrl = nodemailer.getTestMessageUrl(info) || null;

    console.log('----------------------------------------------------');
    console.log(`📨 [EMAIL DISPATCHED] To: ${to}`);
    console.log(`📌 Subject: "${subject}"`);
    if (previewUrl) {
      console.log(`🔗 Ethereal Preview URL: ${previewUrl}`);
    }
    console.log('----------------------------------------------------');

    const record = {
      messageId: info.messageId,
      to,
      subject,
      previewUrl,
      timestamp: new Date().toISOString(),
    };

    recentEmails.unshift(record);
    if (recentEmails.length > 50) recentEmails.pop();

    return record;
  } catch (error) {
    console.error('❌ Failed to dispatch email via Nodemailer:', error.message);
    return {
      error: error.message,
      previewUrl: null,
    };
  }
};

/**
 * 1. Vendor Status Change (Approval / Rejection / Suspended)
 */
export const sendVendorStatusEmail = async ({
  vendor,
  status,
  reason,
  recipientEmail,
  updatedBy,
}) => {
  const targetEmail = recipientEmail || vendor.contactEmail;
  const isApproved = status === 'Approved';
  const color = isApproved ? '#10B981' : '#EF4444';

  const subject = `[VendorFlow] Your Supplier Registration is ${status}`;
  const html = `
    <div style="font-family: sans-serif; background: #0f172a; color: #f8fafc; padding: 24px; border-radius: 8px;">
      <h2 style="color: ${color}; margin-top: 0;">Vendor Status Update: ${status}</h2>
      <p>Hello <strong>${vendor.companyName}</strong>,</p>
      <p>Your supplier registration status has been updated by <strong>${updatedBy || 'Governance Officer'}</strong>.</p>
      
      <div style="background: #1e293b; padding: 16px; border-radius: 6px; border-left: 4px solid ${color}; margin: 20px 0;">
        <p style="margin: 0; font-size: 14px;"><strong>New Status:</strong> <span style="color: ${color}; font-weight: bold;">${status}</span></p>
        ${reason ? `<p style="margin: 8px 0 0 0; font-size: 13px; color: #cbd5e1;"><strong>Review Remarks:</strong> ${reason}</p>` : ''}
        <p style="margin: 8px 0 0 0; font-size: 12px; color: #94a3b8;"><strong>Tax ID / GSTIN:</strong> ${vendor.taxId}</p>
      </div>

      <p style="font-size: 13px; color: #94a3b8;">Log in to the VendorFlow portal to view your compliance scorecard and access incoming purchase orders.</p>
      <div style="margin-top: 24px; font-size: 11px; color: #64748b;">
        Automated notification sent by VendorFlow Enterprise Procurement System.
      </div>
    </div>
  `;

  return sendMail({ to: targetEmail, subject, html });
};

/**
 * 2. New Vendor Evaluation Scorecard Issued
 */
export const sendEvaluationEmail = async ({
  vendor,
  evaluation,
  recipientEmail,
  evaluatorName,
}) => {
  const targetEmail = recipientEmail || vendor.contactEmail;
  const subject = `[VendorFlow] Performance Scorecard Issued: ${evaluation.ratingTier} Tier`;
  const html = `
    <div style="font-family: sans-serif; background: #0f172a; color: #f8fafc; padding: 24px; border-radius: 8px;">
      <h2 style="color: #6366f1; margin-top: 0;">New Performance Evaluation Submitted</h2>
      <p>Hello <strong>${vendor.companyName}</strong>,</p>
      <p>A new supplier evaluation has been completed by <strong>${evaluatorName || 'Procurement Officer'}</strong>.</p>

      <div style="background: #1e293b; padding: 16px; border-radius: 6px; border-left: 4px solid #6366f1; margin: 20px 0;">
        <p style="margin: 0; font-size: 16px;"><strong>Composite Rating:</strong> <span style="color: #818cf8; font-weight: bold;">${evaluation.overallScore} / 5.0</span></p>
        <p style="margin: 6px 0 0 0; font-size: 14px;"><strong>Assigned Tier:</strong> <span style="color: #38bdf8; font-weight: bold;">${evaluation.ratingTier}</span></p>
        <hr style="border: 0; border-top: 1px solid #334155; margin: 12px 0;" />
        <div style="font-size: 12px; color: #cbd5e1; display: grid; gap: 4px;">
          <div>Quality Score: ${evaluation.scores?.quality || 'N/A'} / 5.0</div>
          <div>Delivery Score: ${evaluation.scores?.delivery || 'N/A'} / 5.0</div>
          <div>Pricing Score: ${evaluation.scores?.pricing || 'N/A'} / 5.0</div>
          <div>Compliance Score: ${evaluation.scores?.compliance || 'N/A'} / 5.0</div>
        </div>
        ${evaluation.notes ? `<p style="margin: 10px 0 0 0; font-size: 12px; color: #94a3b8;"><strong>Comments:</strong> "${evaluation.notes}"</p>` : ''}
      </div>

      <p style="font-size: 13px; color: #94a3b8;">Visit your VendorFlow supplier dashboard to inspect historical trends and breakdown charts.</p>
    </div>
  `;

  return sendMail({ to: targetEmail, subject, html });
};

/**
 * 3. Purchase Order Lifecycle Status Transition
 */
export const sendPOStatusChangeEmail = async ({
  po,
  fromStatus,
  toStatus,
  remarks,
  recipientEmail,
  actorName,
}) => {
  const targetEmail = recipientEmail || po.vendor?.contactEmail;
  const subject = `[VendorFlow] Purchase Order ${po.poNumber} Status: ${toStatus}`;
  const html = `
    <div style="font-family: sans-serif; background: #0f172a; color: #f8fafc; padding: 24px; border-radius: 8px;">
      <h2 style="color: #38bdf8; margin-top: 0;">Purchase Order Transition: ${toStatus}</h2>
      <p>Order Reference: <strong style="color: #818cf8; font-family: monospace;">${po.poNumber}</strong></p>
      <p>Subject: <strong>${po.title}</strong></p>
      
      <div style="background: #1e293b; padding: 16px; border-radius: 6px; border-left: 4px solid #38bdf8; margin: 20px 0;">
        <p style="margin: 0; font-size: 14px;">
          Transition: <span style="color: #94a3b8;">${fromStatus}</span> &rarr; <strong style="color: #38bdf8;">${toStatus}</strong>
        </p>
        <p style="margin: 8px 0 0 0; font-size: 13px; color: #cbd5e1;"><strong>Updated By:</strong> ${actorName}</p>
        <p style="margin: 8px 0 0 0; font-size: 13px; color: #cbd5e1;"><strong>Total Value:</strong> ${po.totalAmount?.toLocaleString()} ${po.currency || 'INR'}</p>
        ${remarks ? `<p style="margin: 8px 0 0 0; font-size: 12px; color: #94a3b8;"><strong>Remarks:</strong> ${remarks}</p>` : ''}
      </div>

      <p style="font-size: 13px; color: #94a3b8;">Inspect full line items, terms, and the audit stepper in the VendorFlow portal.</p>
    </div>
  `;

  return sendMail({ to: targetEmail, subject, html });
};

/**
 * Helper to get recent email logs with preview URLs for in-app testing/inspection
 */
export const getRecentEmailDispatches = () => {
  return recentEmails;
};

export default {
  getTransporter,
  sendMail,
  sendVendorStatusEmail,
  sendEvaluationEmail,
  sendPOStatusChangeEmail,
  getRecentEmailDispatches,
};
