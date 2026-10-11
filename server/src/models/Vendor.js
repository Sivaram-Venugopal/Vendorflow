import mongoose from 'mongoose';

const complianceDocumentSchema = new mongoose.Schema(
  {
    documentType: {
      type: String,
      required: true,
      enum: ['GST_CERTIFICATE', 'PAN_CARD', 'MSME_CERTIFICATE', 'BANK_STATEMENT', 'NDA', 'OTHER'],
    },
    documentUrl: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const vendorSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Vendor must be associated with an owner User'],
      index: true,
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [150, 'Company name cannot exceed 150 characters'],
      index: true,
    },
    legalEntityName: {
      type: String,
      trim: true,
      default: '',
    },
    businessType: {
      type: String,
      enum: ['Private Limited', 'Partnership', 'Sole Proprietorship', 'Public Limited', 'LLP', 'Other'],
      default: 'Private Limited',
    },
    category: {
      type: String,
      required: [true, 'Vendor category is required'],
      enum: ['Hardware', 'Software', 'Raw Materials', 'Logistics', 'Services', 'Office Supplies'],
      index: true,
    },
    taxId: {
      // GSTIN / Tax Identification
      type: String,
      required: [true, 'Tax ID / GSTIN is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    panNumber: {
      type: String,
      required: [true, 'PAN number is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    contactEmail: {
      type: String,
      required: [true, 'Vendor contact email is required'],
      trim: true,
      lowercase: true,
    },
    contactPhone: {
      type: String,
      required: [true, 'Vendor contact phone is required'],
      trim: true,
    },
    address: {
      street: { type: String, default: '' },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, default: 'India' },
      postalCode: { type: String, required: true },
    },
    bankDetails: {
      bankName: { type: String, default: '' },
      accountNumber: { type: String, default: '' },
      ifscCode: { type: String, default: '' },
      branchName: { type: String, default: '' },
    },
    status: {
      type: String,
      enum: ['Pending', 'Under Review', 'Approved', 'Rejected', 'Suspended'],
      default: 'Pending',
      index: true,
    },
    statusReason: {
      type: String,
      default: '',
      trim: true,
    },
    statusUpdatedAt: {
      type: Date,
      default: null,
    },
    complianceScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    overallRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    documents: [complianceDocumentSchema],
  },
  {
    timestamps: true,
  }
);

// Compound index for querying active category vendors
vendorSchema.index({ category: 1, status: 1 });

const Vendor = mongoose.model('Vendor', vendorSchema);
export default Vendor;
