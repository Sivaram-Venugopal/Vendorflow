import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendorDashboard } from '../store/slices/dashboardSlice';
import { updatePOStatus, fetchPurchaseOrders } from '../store/slices/purchaseOrderSlice';
import TierBadge from './TierBadge';
import {
  Truck,
  ShoppingBag,
  Award,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Receipt,
  CheckCheck,
  XCircle,
  FileText,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

const VendorDashboardView = ({ onNavigateTab, onStartOnboarding }) => {
  const dispatch = useDispatch();
  const { vendorData, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchVendorDashboard());
  }, [dispatch]);

  const handleAcknowledge = async (poId) => {
    await dispatch(
      updatePOStatus({
        poId,
        status: 'Acknowledged',
        remarks: 'Supplier acknowledged order fulfillment terms via Dashboard',
      })
    );
    dispatch(fetchVendorDashboard());
  };

  const handleDecline = async (poId) => {
    const reason = window.prompt('Specify reason for declining this order:');
    if (reason === null) return;
    await dispatch(
      updatePOStatus({
        poId,
        status: 'Declined',
        remarks: reason || 'Declined via Dashboard',
      })
    );
    dispatch(fetchVendorDashboard());
  };

  const handleInvoice = async (poId) => {
    await dispatch(
      updatePOStatus({
        poId,
        status: 'Invoiced',
        remarks: 'Invoice generated and submitted for payment clearance',
      })
    );
    dispatch(fetchVendorDashboard());
  };

  if (!vendorData?.hasProfile) {
    return (
      <div className="p-12 bg-white rounded-2xl border border-dashed border-slate-300 text-center max-w-2xl mx-auto space-y-4 shadow-sm">
        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-100">
          <Truck className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-xl font-extrabold text-slate-900">Welcome to VendorFlow Supplier Portal</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            You do not have an active supplier profile yet. Complete the onboarding wizard with your GSTIN and KYC documents to start receiving purchase orders.
          </p>
        </div>
        <button
          onClick={onStartOnboarding}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 inline-flex items-center space-x-2"
        >
          <span>Start Onboarding Registration</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const onboarding = vendorData.onboarding;
  const scorecard = vendorData.scorecard;
  const kpis = vendorData.kpis;
  const attention = vendorData.attentionRequired;

  return (
    <div className="space-y-6">
      {/* Onboarding & Statutory Status Banner */}
      <div
        className={`p-6 rounded-2xl border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white ${
          onboarding.status === 'Approved'
            ? 'border-emerald-200'
            : 'border-amber-200'
        }`}
      >
        <div className="flex items-start space-x-3.5">
          <div
            className={`p-3 rounded-xl border mt-0.5 ${
              onboarding.status === 'Approved'
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                : 'bg-amber-50 text-amber-600 border-amber-200'
            }`}
          >
            {onboarding.status === 'Approved' ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : (
              <AlertTriangle className="w-6 h-6" />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-extrabold text-slate-900">
                Supplier Registration Status: {onboarding.status}
              </h2>
              <TierBadge tier={onboarding.ratingTier || 'Approved'} />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {onboarding.status === 'Approved'
                ? 'Your company profile and statutory KYC compliance documents are verified and cleared for commercial orders.'
                : `Profile is currently in ${onboarding.status} state. Notes: ${onboarding.statusReason || 'Pending review'}`}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-6 text-right">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500">Compliance Score</div>
            <div className="text-2xl font-black text-emerald-600 font-mono">
              {onboarding.complianceScore}%
            </div>
          </div>
          <div className="border-l border-slate-200 pl-6">
            <div className="text-[10px] uppercase font-bold text-slate-500">Composite Score</div>
            <div className="text-2xl font-black text-indigo-600 font-mono">
              {onboarding.overallRating?.toFixed(1) || '0.0'}★
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* KPI 1: Incoming Orders Needing Acknowledgement */}
        <div className="p-5 bg-white rounded-2xl border border-teal-200 shadow-sm flex flex-col justify-between hover:border-teal-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Orders Needing Acknowledgement
            </span>
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600 border border-teal-200">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-teal-700 font-mono">
              {kpis?.awaitingAckCount ?? 0}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Incoming contracts awaiting delivery commitments
            </div>
          </div>
        </div>

        {/* KPI 2: Active Orders in Fulfillment */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active in Fulfillment
            </span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-slate-900 font-mono">
              {kpis?.activeFulfillmentCount ?? 0}
            </div>
            <div className="text-xs text-slate-500 mt-1">Acknowledged and under manufacturing/shipping</div>
          </div>
        </div>

        {/* KPI 3: Ready for Invoicing */}
        <div className="p-5 bg-white rounded-2xl border border-purple-200 shadow-sm flex flex-col justify-between hover:border-purple-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
              Delivered Ready to Invoice
            </span>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-200">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-purple-700 font-mono">
              {kpis?.readyToInvoiceCount ?? 0}
            </div>
            <div className="text-xs text-slate-500 mt-1">Submit billing to clear accounts payable</div>
          </div>
        </div>
      </div>

      {/* Main Attention & Scorecard Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Immediate Attention: Incoming POs Awaiting Acknowledgement */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center space-x-2 text-teal-700">
                <ShoppingBag className="w-4 h-4 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Orders Awaiting Acknowledgement ({attention?.awaitingAcknowledgement?.length || 0})
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab && onNavigateTab('orders')}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-bold"
              >
                All POs
              </button>
            </div>

            {attention?.awaitingAcknowledgement?.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 flex flex-col items-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-500/50 mb-2" />
                <span>No incoming purchase orders pending acknowledgement!</span>
              </div>
            ) : (
              <div className="space-y-3">
                {attention?.awaitingAcknowledgement?.map((po) => (
                  <div
                    key={po._id}
                    className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 hover:bg-slate-100/70 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-teal-700 text-xs">{po.poNumber}</span>
                      <span className="font-mono font-bold text-slate-900 text-xs">
                        {po.totalAmount?.toLocaleString()} INR
                      </span>
                    </div>
                    <div className="text-xs text-slate-800 font-bold">{po.title}</div>
                    <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                      <span>Delivery: {po.expectedDeliveryDate ? new Date(po.expectedDeliveryDate).toLocaleDateString() : 'N/A'}</span>
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => handleAcknowledge(po._id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold flex items-center space-x-1 shadow-xs transition-colors"
                        >
                          <CheckCheck className="w-3 h-3" />
                          <span>Acknowledge</span>
                        </button>
                        <button
                          onClick={() => handleDecline(po._id)}
                          className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[11px] font-bold flex items-center space-x-1 shadow-xs transition-colors"
                        >
                          <XCircle className="w-3 h-3" />
                          <span>Decline</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Current Scorecard Performance Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center space-x-2 text-indigo-600">
              <Award className="w-4 h-4" />
              <h3 className="font-bold text-slate-900 text-sm">
                Current Performance Scorecard ({scorecard?.totalEvaluations || 0} Audits)
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab && onNavigateTab('scorecard')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-bold"
            >
              Full Details
            </button>
          </div>

          <div className="space-y-4 pt-1">
            {/* Dimension 1: Quality */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-700 font-medium">Quality & Defect SLA (35% weight)</span>
                <span className="font-mono font-bold text-emerald-600">
                  {scorecard?.avgQuality || 0} / 5.0
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-2 rounded-full"
                  style={{ width: `${Math.min(100, ((scorecard?.avgQuality || 0) / 5) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Dimension 2: Delivery */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-700 font-medium">On-Time Delivery Rate (25% weight)</span>
                <span className="font-mono font-bold text-sky-600">
                  {scorecard?.avgDelivery || 0} / 5.0
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-sky-500 h-2 rounded-full"
                  style={{ width: `${Math.min(100, ((scorecard?.avgDelivery || 0) / 5) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Dimension 3: Pricing */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-700 font-medium">Commercial Competitiveness (20% weight)</span>
                <span className="font-mono font-bold text-indigo-600">
                  {scorecard?.avgPricing || 0} / 5.0
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{ width: `${Math.min(100, ((scorecard?.avgPricing || 0) / 5) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Dimension 4: Compliance */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-700 font-medium">Statutory Tax & Regulatory (20% weight)</span>
                <span className="font-mono font-bold text-teal-600">
                  {scorecard?.avgCompliance || 0} / 5.0
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-teal-500 h-2 rounded-full"
                  style={{ width: `${Math.min(100, ((scorecard?.avgCompliance || 0) / 5) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboardView;
