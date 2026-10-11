import asyncHandler from '../utils/asyncHandler.js';
import { Vendor, User } from '../models/index.js';
import { logAudit } from '../utils/auditLogger.js';
import { sendVendorStatusEmail } from '../utils/mailer.js';

/**
 * @desc    Self-register vendor profile (creates vendor in status=Pending linked to authenticated user)
 * @route   POST /api/vendors
 * @access  Private (Vendor only)
 */
export const registerVendorProfile = asyncHandler(async (req, res) => {
  const {
    companyName,
    legalEntityName,
    businessType,
    category,
    taxId,
    panNumber,
    contactEmail,
    contactPhone,
    address,
    bankDetails,
  } = req.body;

  // Verify mandatory fields
  if (!companyName || !category || !taxId || !panNumber || !contactEmail || !contactPhone) {
    res.status(400);
    throw new Error('Please provide all required company, tax ID, and contact fields');
  }

  // Check if current user already has an active vendor registration
  const existingVendorForUser = await Vendor.findOne({ owner: req.user._id });
  if (existingVendorForUser) {
    res.status(409);
    throw new Error('A vendor profile already exists for your account');
  }

  // Check unique GSTIN and PAN
  const duplicateTax = await Vendor.findOne({
    $or: [{ taxId: taxId.toUpperCase() }, { panNumber: panNumber.toUpperCase() }],
  });
  if (duplicateTax) {
    res.status(409);
    throw new Error('A vendor with this GSTIN/Tax ID or PAN number is already registered');
  }

  // Create vendor profile
  const vendor = await Vendor.create({
    owner: req.user._id,
    companyName,
    legalEntityName: legalEntityName || companyName,
    businessType: businessType || 'Private Limited',
    category,
    taxId: taxId.toUpperCase(),
    panNumber: panNumber.toUpperCase(),
    contactEmail,
    contactPhone,
    address: address || {
      street: '',
      city: 'Default City',
      state: 'Default State',
      country: 'India',
      postalCode: '000000',
    },
    bankDetails: bankDetails || {},
    status: 'Pending',
    complianceScore: 50, // Initial onboarding score
  });

  // Record centralized audit log & notify admin
  await logAudit(req, {
    action: 'VENDOR_CREATED',
    entityType: 'Vendor',
    entityId: vendor._id,
    afterState: {
      companyName: vendor.companyName,
      taxId: vendor.taxId,
      status: 'Pending',
    },
    details: {
      companyName: vendor.companyName,
      taxId: vendor.taxId,
      status: 'Pending',
    },
    notify: {
      targetRole: 'Admin',
      title: 'New Vendor Registration',
      message: `${vendor.companyName} submitted their supplier profile for review.`,
      type: 'VENDOR_STATUS',
    },
  });

  res.status(201).json({
    status: 'success',
    message: 'Vendor onboarding profile submitted for review',
    data: vendor,
  });
});

/**
 * @desc    Upload KYC compliance document (stores file metadata on Vendor document)
 * @route   POST /api/vendors/documents
 * @access  Private (Vendor or Admin)
 */
export const uploadDocument = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Please select a file to upload');
  }

  const { documentType, vendorId } = req.body;
  if (!documentType) {
    res.status(400);
    throw new Error('Please specify documentType (e.g. GST_CERTIFICATE, PAN_CARD, etc.)');
  }

  // Determine target vendor:
  // If vendorId passed by Admin, use that; otherwise find vendor owned by req.user
  let vendor;
  if (req.user.role === 'Admin' && vendorId) {
    vendor = await Vendor.findById(vendorId);
  } else {
    vendor = await Vendor.findOne({ owner: req.user._id });
  }

  if (!vendor) {
    res.status(404);
    throw new Error('Vendor profile not found');
  }

  // Compute public document reference URL
  const documentUrl = `/uploads/documents/${req.file.filename}`;

  const newDoc = {
    documentType,
    documentUrl,
    fileName: req.file.originalname,
    uploadedAt: new Date(),
    verified: req.user.role === 'Admin',
  };

  vendor.documents.push(newDoc);
  // Re-evaluate compliance score based on uploaded docs
  vendor.complianceScore = Math.min(100, 50 + vendor.documents.length * 20);
  await vendor.save();

  // Centralized audit log
  await logAudit(req, {
    action: 'VENDOR_UPDATED',
    entityType: 'Vendor',
    entityId: vendor._id,
    afterState: {
      complianceScore: vendor.complianceScore,
      documentsCount: vendor.documents.length,
    },
    details: {
      uploadedDocument: newDoc.documentType,
      fileName: newDoc.fileName,
      documentUrl: newDoc.documentUrl,
    },
  });

  res.status(200).json({
    status: 'success',
    message: 'Document uploaded successfully',
    data: {
      document: newDoc,
      complianceScore: vendor.complianceScore,
      totalDocuments: vendor.documents.length,
    },
  });
});

/**
 * @desc    Get all vendors with status filter and search (Admin or Buyer)
 * @route   GET /api/vendors
 * @access  Private (Admin or Buyer)
 */
export const getVendors = asyncHandler(async (req, res) => {
  const { status, category, search } = req.query;

  const query = {};

  if (status && status !== 'All') {
    query.status = status;
  }

  if (category && category !== 'All') {
    query.category = category;
  }

  if (search) {
    query.$or = [
      { companyName: { $regex: search, $options: 'i' } },
      { taxId: { $regex: search, $options: 'i' } },
      { panNumber: { $regex: search, $options: 'i' } },
      { contactEmail: { $regex: search, $options: 'i' } },
    ];
  }

  const vendors = await Vendor.find(query)
    .populate('owner', 'name email phone role department')
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    count: vendors.length,
    data: vendors,
  });
});

/**
 * @desc    Get current authenticated vendor profile
 * @route   GET /api/vendors/me
 * @access  Private (Vendor)
 */
export const getMyVendorProfile = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findOne({ owner: req.user._id }).populate(
    'owner',
    'name email role department'
  );

  if (!vendor) {
    return res.status(200).json({
      status: 'success',
      data: null,
      message: 'No vendor profile onboarded yet',
    });
  }

  res.status(200).json({
    status: 'success',
    data: vendor,
  });
});

/**
 * @desc    Approve or reject vendor profile with audit reason
 * @route   PATCH /api/vendors/:id/status
 * @access  Private (Admin only)
 */
export const updateVendorStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, reason } = req.body;

  const allowedStatuses = ['Approved', 'Rejected', 'Under Review', 'Suspended'];
  if (!status || !allowedStatuses.includes(status)) {
    res.status(400);
    throw new Error(
      `Invalid status. Permitted values: ${allowedStatuses.join(', ')}`
    );
  }

  const vendor = await Vendor.findById(id).populate('owner', 'name email');
  if (!vendor) {
    res.status(404);
    throw new Error('Vendor not found');
  }

  const prevStatus = vendor.status;
  vendor.status = status;
  vendor.statusReason = reason || '';
  vendor.statusUpdatedAt = new Date();

  // If approved, verify all documents
  if (status === 'Approved') {
    vendor.documents.forEach((doc) => {
      doc.verified = true;
    });
    vendor.complianceScore = Math.max(85, vendor.complianceScore);
  }

  await vendor.save();

  // Dispatch real Nodemailer Ethereal test email
  const emailResult = await sendVendorStatusEmail({
    vendor,
    status,
    reason: reason || '',
    recipientEmail: vendor.contactEmail || vendor.owner?.email,
    updatedBy: req.user.name,
  });

  // Centralized audit log with before/after state & in-app notification
  await logAudit(req, {
    action: status === 'Approved' ? 'VENDOR_APPROVED' : 'VENDOR_REJECTED',
    entityType: 'Vendor',
    entityId: vendor._id,
    beforeState: { status: prevStatus },
    afterState: { status, reason: vendor.statusReason },
    details: {
      prevStatus,
      newStatus: status,
      reason: reason || '',
      companyName: vendor.companyName,
      emailPreviewUrl: emailResult?.previewUrl || null,
    },
    notify: {
      recipient: vendor.owner?._id || vendor.owner,
      targetRole: 'Vendor',
      title: `Vendor Registration ${status}`,
      message: `Your company profile status was updated to "${status}". ${reason ? `Notes: ${reason}` : ''}`,
      type: 'VENDOR_STATUS',
      emailPreviewUrl: emailResult?.previewUrl || null,
    },
  });

  res.status(200).json({
    status: 'success',
    message: `Vendor profile status updated to ${status}`,
    data: vendor,
  });
});
