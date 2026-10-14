import { body, param, validationResult } from 'express-validator';

/**
 * Universal validation result interceptor.
 * If validation errors exist, short-circuits the request with a structured 400 Bad Request response.
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg,
        value: err.value,
      })),
    });
  }
  next();
};

/**
 * Auth Route Validations
 */
export const validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email address is required')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['Admin', 'Buyer', 'Vendor'])
    .withMessage('Role must be one of: Admin, Buyer, Vendor'),
  validate,
];

export const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email address is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  validate,
];

/**
 * Vendor Route Validations
 */
export const validateVendorRegister = [
  body('companyName')
    .trim()
    .notEmpty()
    .withMessage('Company name is required'),
  body('taxId')
    .trim()
    .notEmpty()
    .withMessage('Tax ID / GSTIN / PAN is required'),
  body('businessType')
    .optional()
    .isIn(['Manufacturer', 'Wholesaler', 'Distributor', 'Service Provider', 'Other'])
    .withMessage('Invalid business type'),
  body('contactEmail')
    .trim()
    .isEmail()
    .withMessage('Valid contact email is required'),
  body('contactPhone')
    .trim()
    .notEmpty()
    .withMessage('Contact phone number is required'),
  body('address.city')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('City cannot be empty'),
  body('address.state')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('State cannot be empty'),
  body('address.country')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Country cannot be empty'),
  validate,
];

export const validateVendorStatus = [
  param('id')
    .isMongoId()
    .withMessage('Valid vendor ID parameter is required'),
  body('status')
    .isIn(['Approved', 'Rejected', 'Suspended'])
    .withMessage('Status must be Approved, Rejected, or Suspended'),
  body('reason')
    .optional()
    .trim(),
  validate,
];

/**
 * Vendor Evaluation Validations
 */
export const validateEvaluation = [
  body('vendorId')
    .isMongoId()
    .withMessage('Valid vendor ID is required'),
  body('qualityScore')
    .isFloat({ min: 1, max: 5 })
    .withMessage('Quality score must be a number between 1.0 and 5.0'),
  body('deliveryScore')
    .isFloat({ min: 1, max: 5 })
    .withMessage('Delivery score must be a number between 1.0 and 5.0'),
  body('pricingScore')
    .isFloat({ min: 1, max: 5 })
    .withMessage('Pricing score must be a number between 1.0 and 5.0'),
  body('complianceScore')
    .isFloat({ min: 1, max: 5 })
    .withMessage('Compliance score must be a number between 1.0 and 5.0'),
  body('period')
    .optional()
    .trim(),
  body('comments')
    .optional()
    .trim(),
  validate,
];

/**
 * Purchase Order Validations
 */
export const validatePOCreate = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Purchase order title is required'),
  body('items')
    .isArray({ min: 1 })
    .withMessage('At least one line item is required'),
  body('items.*.description')
    .trim()
    .notEmpty()
    .withMessage('Item description is required'),
  body('items.*.quantity')
    .isFloat({ min: 0.01 })
    .withMessage('Item quantity must be greater than zero'),
  body('items.*.unitPrice')
    .isFloat({ min: 0 })
    .withMessage('Item unit price must be positive'),
  body('currency')
    .optional()
    .isIn(['INR', 'USD', 'EUR', 'GBP'])
    .withMessage('Invalid currency code'),
  body('expectedDeliveryDate')
    .optional(),
  body('deliveryDate')
    .optional(),
  body().custom((value) => {
    const vId = value.vendor || value.vendorId;
    if (!vId) {
      throw new Error('Valid vendor ID is required');
    }
    return true;
  }),
  validate,
];

export const validatePOStatus = [
  param('id')
    .isMongoId()
    .withMessage('Valid purchase order ID parameter is required'),
  body('status')
    .isIn([
      'Draft',
      'Pending Approval',
      'Approved',
      'Rejected',
      'Sent',
      'Acknowledged',
      'Declined',
      'Delivered',
      'Invoiced',
      'Closed',
      'Cancelled',
    ])
    .withMessage('Invalid purchase order status transition target'),
  body('remarks')
    .optional()
    .trim(),
  validate,
];

/**
 * Notification Validations
 */
export const validateNotificationId = [
  param('id')
    .isMongoId()
    .withMessage('Valid notification ID parameter is required'),
  validate,
];
