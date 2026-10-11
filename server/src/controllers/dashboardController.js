import asyncHandler from '../utils/asyncHandler.js';
import { Vendor, PurchaseOrder, Evaluation, User } from '../models/index.js';

/**
 * @desc    Get aggregated Admin Dashboard metrics (computed via MongoDB Aggregation Pipelines)
 * @route   GET /api/dashboard/admin
 * @access  Private (Admin only)
 */
export const getAdminDashboard = asyncHandler(async (req, res) => {
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  // 1. KPI Pipeline: Spend this month & open PO count
  const poKpiPipeline = [
    {
      $facet: {
        monthSpend: [
          {
            $match: {
              createdAt: { $gte: startOfMonth },
              status: { $nin: ['Cancelled', 'Rejected'] },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$totalAmount' },
              count: { $sum: 1 },
            },
          },
        ],
        openPOs: [
          {
            $match: {
              status: { $nin: ['Closed', 'Cancelled', 'Rejected'] },
            },
          },
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
              totalValue: { $sum: '$totalAmount' },
            },
          },
        ],
        pendingPOApprovals: [
          {
            $match: { status: 'Pending Approval' },
          },
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
              totalValue: { $sum: '$totalAmount' },
            },
          },
        ],
      },
    },
  ];

  // 2. Vendor KPI Pipeline: Active vendors, pending verifications, total
  const vendorKpiPipeline = [
    {
      $facet: {
        active: [
          { $match: { status: 'Approved' } },
          { $count: 'count' },
        ],
        pending: [
          { $match: { status: 'Pending' } },
          { $count: 'count' },
        ],
        total: [{ $count: 'count' }],
      },
    },
  ];

  // 3. Vendor Tier Comparison Pipeline ($group by ratingTier)
  const vendorTierPipeline = [
    {
      $match: { status: 'Approved' },
    },
    {
      $group: {
        _id: '$ratingTier',
        count: { $sum: 1 },
        avgRating: { $avg: '$overallRating' },
      },
    },
    {
      $sort: { count: -1 },
    },
  ];

  // 4. PO Status Funnel Pipeline ($group by status)
  const poStatusFunnelPipeline = [
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalValue: { $sum: '$totalAmount' },
      },
    },
    {
      $sort: { count: -1 },
    },
  ];

  // Execute pipelines in parallel
  const [
    [poKpiResult],
    [vendorKpiResult],
    vendorTiers,
    poStatusFunnel,
    pendingVendorsList,
    pendingPOsList,
  ] = await Promise.all([
    PurchaseOrder.aggregate(poKpiPipeline),
    Vendor.aggregate(vendorKpiPipeline),
    Vendor.aggregate(vendorTierPipeline),
    PurchaseOrder.aggregate(poStatusFunnelPipeline),
    Vendor.find({ status: 'Pending' })
      .select('companyName category taxId contactEmail createdAt')
      .sort({ createdAt: -1 })
      .limit(5),
    PurchaseOrder.find({ status: 'Pending Approval' })
      .populate('vendor', 'companyName')
      .populate('buyer', 'name')
      .select('poNumber title totalAmount createdAt')
      .sort({ createdAt: -1 })
      .limit(5),
  ]);

  const activeVendors = vendorKpiResult?.active[0]?.count || 0;
  const pendingVendors = vendorKpiResult?.pending[0]?.count || 0;
  const totalVendors = vendorKpiResult?.total[0]?.count || 0;

  const spendThisMonth = poKpiResult?.monthSpend[0]?.total || 0;
  const spendPOCount = poKpiResult?.monthSpend[0]?.count || 0;
  const openPOCount = poKpiResult?.openPOs[0]?.count || 0;
  const openPOValue = poKpiResult?.openPOs[0]?.totalValue || 0;
  const pendingPOCount = poKpiResult?.pendingPOApprovals[0]?.count || 0;

  // Format Tier Comparison for Recharts bar chart
  const standardTiers = ['Preferred', 'Approved', 'On-Watch', 'Blacklisted'];
  const formattedTiers = standardTiers.map((tierName) => {
    const found = vendorTiers.find((t) => t._id === tierName);
    return {
      tier: tierName,
      count: found ? found.count : 0,
      avgRating: found ? Math.round(found.avgRating * 10) / 10 : 0,
    };
  });

  // Format Status Funnel
  const funnelStages = [
    'Draft',
    'Pending Approval',
    'Approved',
    'Sent',
    'Acknowledged',
    'Delivered',
    'Invoiced',
    'Closed',
  ];
  const formattedFunnel = funnelStages.map((stage) => {
    const found = poStatusFunnel.find((s) => s._id === stage);
    return {
      stage,
      count: found ? found.count : 0,
      value: found ? found.totalValue : 0,
    };
  });

  res.status(200).json({
    status: 'success',
    data: {
      kpis: {
        activeVendors,
        pendingApprovals: pendingVendors + pendingPOCount,
        pendingVendors,
        pendingPOs: pendingPOCount,
        openPOs: openPOCount,
        openPOValue,
        spendThisMonth,
        spendPOCount,
        totalVendors,
      },
      analytics: {
        vendorTierComparison: formattedTiers,
        poStatusFunnel: formattedFunnel,
      },
      attentionRequired: {
        pendingVendors: pendingVendorsList,
        pendingPOs: pendingPOsList,
      },
    },
  });
});

/**
 * @desc    Get aggregated Buyer Dashboard metrics
 * @route   GET /api/dashboard/buyer
 * @access  Private (Buyer or Admin)
 */
export const getBuyerDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  // 1. Buyer PO Aggregation
  const buyerPOPipeline = [
    {
      $match: { buyer: userId },
    },
    {
      $facet: {
        byStatus: [
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
              totalValue: { $sum: '$totalAmount' },
            },
          },
        ],
        monthSpend: [
          {
            $match: {
              createdAt: { $gte: startOfMonth },
              status: { $nin: ['Cancelled', 'Rejected'] },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$totalAmount' },
              count: { $sum: 1 },
            },
          },
        ],
        openCount: [
          {
            $match: {
              status: { $nin: ['Closed', 'Cancelled', 'Rejected'] },
            },
          },
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
              totalValue: { $sum: '$totalAmount' },
            },
          },
        ],
      },
    },
  ];

  // 2. Top-Rated Approved Vendors ($sort, $limit, $project)
  const topVendorsPipeline = [
    {
      $match: { status: 'Approved' },
    },
    {
      $sort: { overallRating: -1, complianceScore: -1 },
    },
    {
      $limit: 5,
    },
    {
      $project: {
        companyName: 1,
        category: 1,
        ratingTier: 1,
        overallRating: 1,
        complianceScore: 1,
      },
    },
  ];

  const [[poAggResult], topVendors, draftPOs, approvedReadyToSend, deliveredReadyToInvoice] =
    await Promise.all([
      PurchaseOrder.aggregate(buyerPOPipeline),
      Vendor.aggregate(topVendorsPipeline),
      PurchaseOrder.find({ buyer: userId, status: 'Draft' })
        .populate('vendor', 'companyName')
        .select('poNumber title totalAmount createdAt')
        .limit(5),
      PurchaseOrder.find({ buyer: userId, status: 'Approved' })
        .populate('vendor', 'companyName')
        .select('poNumber title totalAmount createdAt')
        .limit(5),
      PurchaseOrder.find({ buyer: userId, status: 'Invoiced' })
        .populate('vendor', 'companyName')
        .select('poNumber title totalAmount createdAt')
        .limit(5),
    ]);

  const openPOCount = poAggResult?.openCount[0]?.count || 0;
  const openPOValue = poAggResult?.openCount[0]?.totalValue || 0;
  const spendThisMonth = poAggResult?.monthSpend[0]?.total || 0;
  const statusBreakdown = poAggResult?.byStatus || [];

  res.status(200).json({
    status: 'success',
    data: {
      kpis: {
        openPOCount,
        openPOValue,
        spendThisMonth,
        draftCount: draftPOs.length,
        readyToSendCount: approvedReadyToSend.length,
        readyToCloseCount: deliveredReadyToInvoice.length,
      },
      statusBreakdown: statusBreakdown.map((s) => ({
        status: s._id,
        count: s.count,
        totalValue: s.totalValue,
      })),
      topRatedVendors: topVendors,
      attentionRequired: {
        draftsToSubmit: draftPOs,
        approvedToSend: approvedReadyToSend,
        invoicedToClose: deliveredReadyToInvoice,
      },
    },
  });
});

/**
 * @desc    Get aggregated Vendor Dashboard metrics
 * @route   GET /api/dashboard/vendor
 * @access  Private (Vendor only)
 */
export const getVendorDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const vendor = await Vendor.findOne({ owner: userId });
  if (!vendor) {
    return res.status(200).json({
      status: 'success',
      data: {
        hasProfile: false,
        message: 'No vendor profile onboarded yet',
      },
    });
  }

  // 1. Scorecard breakdown aggregation across all evaluations
  const scorecardPipeline = [
    {
      $match: { vendor: vendor._id },
    },
    {
      $group: {
        _id: null,
        avgQuality: { $avg: '$qualityScore' },
        avgDelivery: { $avg: '$deliveryScore' },
        avgPricing: { $avg: '$pricingScore' },
        avgCompliance: { $avg: '$complianceScore' },
        totalEvaluations: { $sum: 1 },
      },
    },
  ];

  // 2. Incoming POs breakdown
  const poSummaryPipeline = [
    {
      $match: { vendor: vendor._id },
    },
    {
      $facet: {
        byStatus: [
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
              totalValue: { $sum: '$totalAmount' },
            },
          },
        ],
        awaitingAcknowledgement: [
          { $match: { status: 'Sent' } },
          { $count: 'count' },
        ],
        activeFulfillment: [
          { $match: { status: { $in: ['Acknowledged', 'Delivered'] } } },
          { $count: 'count' },
        ],
      },
    },
  ];

  const [[scorecardAgg], [poSummaryAgg], incomingNeedingAck, deliveredReadyToInvoice] =
    await Promise.all([
      Evaluation.aggregate(scorecardPipeline),
      PurchaseOrder.aggregate(poSummaryPipeline),
      PurchaseOrder.find({ vendor: vendor._id, status: 'Sent' })
        .select('poNumber title totalAmount expectedDeliveryDate createdAt')
        .sort({ createdAt: -1 }),
      PurchaseOrder.find({ vendor: vendor._id, status: 'Delivered' })
        .select('poNumber title totalAmount createdAt')
        .sort({ createdAt: -1 }),
    ]);

  const awaitingAckCount = poSummaryAgg?.awaitingAcknowledgement[0]?.count || 0;
  const activeFulfillmentCount = poSummaryAgg?.activeFulfillment[0]?.count || 0;
  const statusBreakdown = poSummaryAgg?.byStatus || [];

  res.status(200).json({
    status: 'success',
    data: {
      hasProfile: true,
      onboarding: {
        status: vendor.status,
        statusReason: vendor.statusReason,
        complianceScore: vendor.complianceScore,
        documentsCount: vendor.documents?.length || 0,
        ratingTier: vendor.ratingTier || 'Approved',
        overallRating: vendor.overallRating || 0,
      },
      scorecard: {
        totalEvaluations: scorecardAgg?.totalEvaluations || 0,
        avgQuality: scorecardAgg ? Math.round(scoreAggAvg(scorecardAgg.avgQuality) * 10) / 10 : 0,
        avgDelivery: scorecardAgg ? Math.round(scoreAggAvg(scorecardAgg.avgDelivery) * 10) / 10 : 0,
        avgPricing: scorecardAgg ? Math.round(scoreAggAvg(scorecardAgg.avgPricing) * 10) / 10 : 0,
        avgCompliance: scorecardAgg ? Math.round(scoreAggAvg(scorecardAgg.avgCompliance) * 10) / 10 : 0,
      },
      kpis: {
        awaitingAckCount,
        activeFulfillmentCount,
        readyToInvoiceCount: deliveredReadyToInvoice.length,
      },
      statusBreakdown: statusBreakdown.map((s) => ({
        status: s._id,
        count: s.count,
        totalValue: s.totalValue,
      })),
      attentionRequired: {
        awaitingAcknowledgement: incomingNeedingAck,
        readyToInvoice: deliveredReadyToInvoice,
      },
    },
  });
});

const scoreAggAvg = (val) => (val !== undefined && val !== null ? val : 0);

export default {
  getAdminDashboard,
  getBuyerDashboard,
  getVendorDashboard,
};
