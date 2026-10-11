import mongoose from 'mongoose';

const lineItemSchema = new mongoose.Schema(
  {
    itemCode: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Line item description is required'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    unitPrice: {
      type: Number,
      required: [true, 'Unit price is required'],
      min: [0, 'Unit price cannot be negative'],
    },
    totalAmount: {
      type: Number,
      min: 0,
    },
  },
  { _id: false }
);

lineItemSchema.pre('validate', function (next) {
  if (this.quantity !== undefined && this.unitPrice !== undefined) {
    this.totalAmount = this.quantity * this.unitPrice;
  }
  next();
});

const purchaseOrderSchema = new mongoose.Schema(
  {
    poNumber: {
      type: String,
      required: [true, 'PO number is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: [true, 'Purchase order must be associated with a Vendor'],
      index: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Purchase order must have a creator Buyer User'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Purchase order title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    items: {
      type: [lineItemSchema],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'A purchase order must contain at least one line item',
      },
    },
    subtotal: {
      type: Number,
      default: 0,
    },
    taxAmount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: 'INR',
      enum: ['INR', 'USD', 'EUR', 'GBP'],
    },
    status: {
      type: String,
      enum: [
        'Draft',
        'Issued',
        'Acknowledged',
        'In Transit',
        'Delivered',
        'Completed',
        'Cancelled',
      ],
      default: 'Draft',
      index: true,
    },
    deliveryDate: {
      type: Date,
      required: [true, 'Expected delivery date is required'],
    },
    shippingAddress: {
      street: { type: String, default: '' },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, default: 'India' },
      postalCode: { type: String, required: true },
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate totals before saving
purchaseOrderSchema.pre('save', function (next) {
  if (this.items && this.items.length > 0) {
    this.subtotal = this.items.reduce((sum, item) => sum + (item.totalAmount || item.quantity * item.unitPrice), 0);
    // Standard 18% GST estimate if not specified
    if (this.taxAmount === 0 || this.taxAmount === undefined) {
      this.taxAmount = Math.round(this.subtotal * 0.18 * 100) / 100;
    }
    this.totalAmount = this.subtotal + this.taxAmount;
  }
  next();
});

// Compound index for querying vendor purchase orders by status
purchaseOrderSchema.index({ vendor: 1, status: 1 });
purchaseOrderSchema.index({ buyer: 1, createdAt: -1 });

const PurchaseOrder = mongoose.model('PurchaseOrder', purchaseOrderSchema);
export default PurchaseOrder;
