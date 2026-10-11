import asyncHandler from '../utils/asyncHandler.js';
import { Evaluation, Vendor } from '../models/index.js';
import { evaluateVendor } from '../utils/scoring.js';
import { logAudit } from '../utils/auditLogger.js';
import { sendEvaluationEmail } from '../utils/mailer.js';

/**
 * @desc    Submit a new vendor evaluation with per-KPI scores & weights
 * @route   POST /api/evaluations
 * @access  Private (Buyer or Admin)
 */
export const createEvaluation = asyncHandler(async (req, res) => {
  const {
    vendorId,
    period,
    qualityScore,
    deliveryScore,
    pricingScore,
    complianceScore,
    weights,
    feedbackComments,
  } = req.body;

  if (!vendorId) {
    res.status(400);
    throw new Error('Target vendorId is required');
  }

  const vendor = await Vendor.findById(vendorId);
  if (!vendor) {
    res.status(404);
    throw new Error('Vendor not found');
  }

  // Pure scoring utility computation
  const scoringResult = evaluateVendor(
    {
      qualityScore: Number(qualityScore),
      deliveryScore: Number(deliveryScore),
      pricingScore: Number(pricingScore),
      complianceScore: Number(complianceScore),
    },
    weights
  );

  // Create Evaluation document
  const evaluation = await Evaluation.create({
    vendor: vendor._id,
    evaluator: req.user._id,
    period: period || `Period ${new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`,
    qualityScore: Number(qualityScore),
    deliveryScore: Number(deliveryScore),
    pricingScore: Number(pricingScore),
    complianceScore: Number(complianceScore),
    weights: scoringResult.weightsUsed,
    overallScore: scoringResult.weightedScore,
    ratingTier: scoringResult.tier,
    feedbackComments: feedbackComments || '',
  });

  // Calculate new cumulative vendor overallRating and ratingTier across all evaluations
  const allEvaluations = await Evaluation.find({ vendor: vendor._id });
  const totalAvg =
    allEvaluations.reduce((sum, item) => sum + item.overallScore, 0) /
    allEvaluations.length;

  const prevOverallRating = vendor.overallRating;
  const prevRatingTier = vendor.ratingTier;

  vendor.overallRating = Math.round(totalAvg * 10) / 10;
  vendor.ratingTier = scoringResult.tier; // Set to latest evaluated tier
  await vendor.save();

  // Dispatch real Nodemailer Ethereal test email
  const emailResult = await sendEvaluationEmail({
    vendor,
    evaluation,
    recipientEmail: vendor.contactEmail,
    evaluatorName: req.user.name,
  });

  // Centralized audit log with before/after state & in-app notification
  await logAudit(req, {
    action: 'EVALUATION_SUBMITTED',
    entityType: 'Evaluation',
    entityId: evaluation._id,
    beforeState: {
      overallRating: prevOverallRating,
      ratingTier: prevRatingTier,
    },
    afterState: {
      overallRating: vendor.overallRating,
      ratingTier: vendor.ratingTier,
      latestScore: evaluation.overallScore,
    },
    details: {
      vendorId: vendor._id,
      vendorName: vendor.companyName,
      period: evaluation.period,
      weightedScore: evaluation.overallScore,
      ratingTier: evaluation.ratingTier,
      emailPreviewUrl: emailResult?.previewUrl || null,
    },
    notify: {
      recipient: vendor.owner?._id || vendor.owner,
      targetRole: 'Vendor',
      title: 'New Performance Scorecard Issued',
      message: `${vendor.companyName} evaluated with score ${evaluation.overallScore}/5.0 (${evaluation.ratingTier} tier).`,
      type: 'EVALUATION',
      emailPreviewUrl: emailResult?.previewUrl || null,
    },
  });

  const populatedEvaluation = await Evaluation.findById(evaluation._id)
    .populate('evaluator', 'name email role department')
    .populate('vendor', 'companyName category ratingTier');

  res.status(201).json({
    status: 'success',
    message: 'Evaluation submitted successfully and vendor tier updated',
    data: {
      evaluation: populatedEvaluation,
      updatedVendor: {
        id: vendor._id,
        companyName: vendor.companyName,
        overallRating: vendor.overallRating,
        ratingTier: vendor.ratingTier,
      },
    },
  });
});

/**
 * @desc    Get historical evaluation scorecard for a vendor
 * @route   GET /api/vendors/:id/evaluations
 * @access  Private (Admin, Buyer, or Vendor owner)
 */
export const getVendorEvaluations = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const vendor = await Vendor.findById(id);
  if (!vendor) {
    res.status(404);
    throw new Error('Vendor not found');
  }

  // If role is Vendor, ensure they can only inspect their own evaluations
  if (req.user.role === 'Vendor' && vendor.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to access evaluations for another vendor');
  }

  const evaluations = await Evaluation.find({ vendor: id })
    .populate('evaluator', 'name email department')
    .sort({ createdAt: 1 }); // Chronological order for trend charts

  res.status(200).json({
    status: 'success',
    count: evaluations.length,
    vendor: {
      id: vendor._id,
      companyName: vendor.companyName,
      category: vendor.category,
      overallRating: vendor.overallRating,
      ratingTier: vendor.ratingTier,
      complianceScore: vendor.complianceScore,
    },
    data: evaluations,
  });
});

/**
 * @desc    Get all vendor scorecards comparison (Admin only)
 * @route   GET /api/evaluations/comparison
 * @access  Private (Admin)
 */
export const getVendorsComparison = asyncHandler(async (req, res) => {
  const vendors = await Vendor.find({})
    .select('companyName category ratingTier overallRating complianceScore status createdAt')
    .sort({ overallRating: -1 });

  res.status(200).json({
    status: 'success',
    count: vendors.length,
    data: vendors,
  });
});
