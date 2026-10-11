import mongoose from 'mongoose';

const evaluationSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: [true, 'Evaluation must be linked to a Vendor'],
      index: true,
    },
    evaluator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Evaluation must be authored by an evaluator User'],
      index: true,
    },
    period: {
      type: String,
      required: [true, 'Evaluation period is required (e.g. Q1-2026, Oct-2026)'],
      trim: true,
    },
    // Dimension Scores: scale 1 - 5
    qualityScore: {
      type: Number,
      required: [true, 'Quality score is required'],
      min: [1, 'Quality score must be at least 1'],
      max: [5, 'Quality score cannot exceed 5'],
    },
    deliveryScore: {
      type: Number,
      required: [true, 'Delivery score is required'],
      min: [1, 'Delivery score must be at least 1'],
      max: [5, 'Delivery score cannot exceed 5'],
    },
    pricingScore: {
      type: Number,
      required: [true, 'Pricing score is required'],
      min: [1, 'Pricing score must be at least 1'],
      max: [5, 'Pricing score cannot exceed 5'],
    },
    complianceScore: {
      type: Number,
      required: [true, 'Compliance score is required'],
      min: [1, 'Compliance score must be at least 1'],
      max: [5, 'Compliance score cannot exceed 5'],
    },
    // Weights configuration used for this evaluation
    weights: {
      quality: { type: Number, default: 0.35 },
      delivery: { type: Number, default: 0.25 },
      pricing: { type: Number, default: 0.20 },
      compliance: { type: Number, default: 0.20 },
    },
    // Computed weighted overall score (scale 1 - 5)
    overallScore: {
      type: Number,
      min: 1,
      max: 5,
    },
    // Derived statutory tier: Preferred, Approved, On-Watch, Blacklisted
    ratingTier: {
      type: String,
      enum: ['Preferred', 'Approved', 'On-Watch', 'Blacklisted'],
      default: 'Approved',
      index: true,
    },
    feedbackComments: {
      type: String,
      trim: true,
      maxlength: [1000, 'Comments cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Index to query evaluations for a vendor by period & chronological order
evaluationSchema.index({ vendor: 1, createdAt: -1 });
evaluationSchema.index({ vendor: 1, period: 1 });

const Evaluation = mongoose.model('Evaluation', evaluationSchema);
export default Evaluation;
