import asyncHandler from '../utils/asyncHandler.js';
import { PurchaseOrder, Vendor, User } from '../models/index.js';
import { validatePOTransition } from '../utils/poStateMachine.js';
import { logAudit } from '../utils/auditLogger.js';
import { sendPOStatusChangeEmail } from '../utils/mailer.js';

/**
 * Generate unique PO Number (e.g. PO-2026-0042)
 */
const generatePONumber = async () => {
  const currentYear = new Date().getFullYear();
  const count = await PurchaseOrder.countDocuments();
  const sequence = String(count + 1).padStart(4, '0');
  return `PO-${currentYear}-${sequence}`;
};

/**
 * @desc    Create a new Purchase Order (Draft status with auto-computed line items & tax)
 * @route   POST /api/purchase-orders
 * @access  Private (Buyer or Admin)
 */
export const createPurchaseOrder = asyncHandler(async (req, res) => {
  const {
    vendorId,
    title,
    items,
    deliveryDate,
    shippingAddress,
    notes,
    currency,
  } = req.body;

  if (!vendorId) {
    res.status(400);
    throw new Error('Target Vendor is required');
  }

  if (!title || !items || !Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error('Title and at least one line item are required');
  }

  const vendor = await Vendor.findById(vendorId);
  if (!vendor) {
    res.status(404);
    throw new Error('Vendor not found');
  }

  // Calculate totals
  const subtotal = items.reduce(
    (sum, item) => sum + (Number(item.quantity) * Number(item.unitPrice)),
    0
  );
  const taxAmount = Math.round(subtotal * 0.18 * 100) / 100;
  const totalAmount = subtotal + taxAmount;

  const poNumber = await generatePONumber();

  // Create PO
  const po = await PurchaseOrder.create({
    poNumber,
    vendor: vendor._id,
    buyer: req.user._id,
    title,
    items: items.map((i) => ({
      itemCode: i.itemCode || '',
      description: i.description,
      quantity: Number(i.quantity),
      unitPrice: Number(i.unitPrice),
      totalAmount: Number(i.quantity) * Number(i.unitPrice),
    })),
    subtotal,
    taxAmount,
    totalAmount,
    currency: currency || 'INR',
    status: 'Draft',
    deliveryDate: deliveryDate ? new Date(deliveryDate) : new Date(Date.now() + 14 * 86400000),
    shippingAddress: shippingAddress || {
      city: 'Default City',
      state: 'Default State',
      postalCode: '000000',
    },
    notes: notes || '',
    history: [
      {
        fromStatus: 'None',
        toStatus: 'Draft',
        actor: req.user._id,
        actorName: req.user.name,
        actorRole: req.user.role,
        remarks: 'Purchase Order created in Draft state',
        timestamp: new Date(),
      },
    ],
  });

  // Centralized audit log
  await logAudit(req, {
    action: 'PO_CREATED',
    entityType: 'PurchaseOrder',
    entityId: po._id,
    afterState: {
      status: 'Draft',
      poNumber: po.poNumber,
      totalAmount: po.totalAmount,
    },
    details: {
      poNumber: po.poNumber,
      totalAmount: po.totalAmount,
      vendor: vendor.companyName,
    },
  });

  const populatedPO = await PurchaseOrder.findById(po._id)
    .populate('vendor', 'companyName category contactEmail ratingTier')
    .populate('buyer', 'name email department');

  res.status(201).json({
    status: 'success',
    message: 'Purchase Order created successfully in Draft state',
    data: populatedPO,
  });
});

/**
 * @desc    Get all Purchase Orders (Filterable by status, role-sensitive)
 * @route   GET /api/purchase-orders
 * @access  Private (Admin, Buyer, Vendor)
 */
export const getPurchaseOrders = asyncHandler(async (req, res) => {
  const { status, search } = req.query;

  const query = {};

  // Role Scoping:
  // - Vendor only sees POs destined for their owned Vendor profile
  // - Buyer sees their created POs (or all if specified)
  // - Admin sees everything
  if (req.user.role === 'Vendor') {
    const myVendor = await Vendor.findOne({ owner: req.user._id });
    if (!myVendor) {
      return res.status(200).json({ status: 'success', count: 0, data: [] });
    }
    query.vendor = myVendor._id;
    // Vendors should not see internal Drafts not yet sent
    query.status = { $nin: ['Draft', 'Pending Approval', 'Rejected'] };
  } else if (req.user.role === 'Buyer') {
    // Buyers see their created POs
    query.buyer = req.user._id;
  }

  if (status && status !== 'All') {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { poNumber: { $regex: search, $options: 'i' } },
      { title: { $regex: search, $options: 'i' } },
    ];
  }

  const pos = await PurchaseOrder.find(query)
    .populate('vendor', 'companyName category ratingTier contactEmail address')
    .populate('buyer', 'name email department')
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    count: pos.length,
    data: pos,
  });
});

/**
 * @desc    Get single Purchase Order details with full timeline history
 * @route   GET /api/purchase-orders/:id
 * @access  Private (Admin, Buyer, or owning Vendor)
 */
export const getPurchaseOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const po = await PurchaseOrder.findById(id)
    .populate('vendor', 'companyName category ratingTier contactEmail address owner')
    .populate('buyer', 'name email department')
    .populate('history.actor', 'name email role');

  if (!po) {
    res.status(404);
    throw new Error('Purchase Order not found');
  }

  // Security check: If vendor user, ensure they own the target vendor
  if (req.user.role === 'Vendor') {
    if (po.vendor.owner.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to access this purchase order');
    }
  }

  res.status(200).json({
    status: 'success',
    data: po,
  });
});

/**
 * @desc    Transition Purchase Order status using Finite State Machine
 * @route   PATCH /api/purchase-orders/:id/status
 * @access  Private (Role-gated per transition rule)
 */
export const transitionPOStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status: targetStatus, remarks } = req.body;

  if (!targetStatus) {
    res.status(400);
    throw new Error('Target status is required');
  }

  const po = await PurchaseOrder.findById(id).populate('vendor', 'owner companyName contactEmail');
  if (!po) {
    res.status(404);
    throw new Error('Purchase Order not found');
  }

  // Extra ownership check for Vendor actions (Acknowledge / Decline):
  // Ensure the acknowledging vendor user is the actual vendor owner
  if (req.user.role === 'Vendor') {
    if (po.vendor.owner.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Forbidden: You can only acknowledge or decline POs issued to your company');
    }
  }

  // Validate state machine transition & role permissions
  const validation = validatePOTransition(po.status, targetStatus, req.user.role);
  if (!validation.isValid) {
    res.status(400);
    throw new Error(validation.error);
  }

  const previousStatus = po.status;
  po.status = targetStatus;

  // Append immutable transition history entry
  po.history.push({
    fromStatus: previousStatus,
    toStatus: targetStatus,
    actor: req.user._id,
    actorName: req.user.name,
    actorRole: req.user.role,
    remarks: remarks || `Transitioned from ${previousStatus} to ${targetStatus}`,
    timestamp: new Date(),
  });

  await po.save();

  // Dispatch real Nodemailer Ethereal test email
  const emailResult = await sendPOStatusChangeEmail({
    po,
    fromStatus: previousStatus,
    toStatus: targetStatus,
    remarks: remarks || '',
    recipientEmail: po.vendor?.contactEmail,
    actorName: req.user.name,
  });

  // Centralized audit log with before/after state & in-app notification
  await logAudit(req, {
    action: targetStatus === 'Acknowledged' ? 'PO_ACKNOWLEDGED' : 'PO_STATUS_UPDATED',
    entityType: 'PurchaseOrder',
    entityId: po._id,
    beforeState: { status: previousStatus },
    afterState: { status: targetStatus, remarks: remarks || '' },
    details: {
      poNumber: po.poNumber,
      fromStatus: previousStatus,
      toStatus: targetStatus,
      remarks: remarks || '',
      emailPreviewUrl: emailResult?.previewUrl || null,
    },
    notify: {
      targetRole: req.user.role === 'Vendor' ? 'Buyer' : 'Vendor',
      title: `PO ${po.poNumber} Status: ${targetStatus}`,
      message: `Order transitioned from "${previousStatus}" to "${targetStatus}" by ${req.user.name}.`,
      type: 'PO_STATUS',
      emailPreviewUrl: emailResult?.previewUrl || null,
    },
  });

  const updatedPO = await PurchaseOrder.findById(po._id)
    .populate('vendor', 'companyName category ratingTier contactEmail address')
    .populate('buyer', 'name email department')
    .populate('history.actor', 'name email role');

  res.status(200).json({
    status: 'success',
    message: `Purchase Order ${po.poNumber} transitioned to '${targetStatus}'`,
    data: updatedPO,
  });
});
