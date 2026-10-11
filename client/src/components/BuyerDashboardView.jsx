import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBuyerDashboard } from '../store/slices/dashboardSlice';
import TierBadge from './TierBadge';
import {
  ShoppingBag,
  TrendingUp,
  PlusCircle,
  Award,
  Send,
  Archive,
  Star,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

const BuyerDashboardView = ({ onStartDraftPO, onStartEvaluate, onNavigateTab }) => {
  const dispatch = useDispatch();
  const { buyerData, loading } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchBuyerDashboard());
  }, [dispatch]);

  const kpis = buyerData?.kpis;
  const topVendors = buyerData?.topRatedVendors || [];
  const attention = buyerData?.attentionRequired;

  return (
    <div className="space-y-6">
      {/* Quick Action Callout & KPI Header */}
      <div className="p-6 bg-gradient-to-r from-indigo-900/60 via-slate-800 to-slate-800/80 rounded-2xl border border-indigo-700/50 shadow-xl backdrop-blur flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
            Procurement Action Hub
          </span>
          <h2 className="text-xl font-bold text-white mt-1">Ready to Initiate Procurement?</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Quickly draft purchase requisitions with dynamic line items, automated GST calculations, and route through the approval workflow.
          </p>
        </div>

        <button
          onClick={onStartDraftPO}
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] flex-shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Draft New Purchase Order</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Open Orders */}
        <div className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700/80 shadow-lg backdrop-blur flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Active Orders
            </span>
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-white font-mono">
              {kpis?.openPOCount ?? 0}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Active Value: <span className="text-sky-300 font-mono font-semibold">{kpis?.openPOValue?.toLocaleString() ?? 0} INR</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Spend This Month */}
        <div className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700/80 shadow-lg backdrop-blur flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 font-bold">
              My Spend This Month
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-emerald-400 font-mono truncate">
              {kpis?.spendThisMonth?.toLocaleString() ?? 0} INR
            </div>
            <div className="text-xs text-slate-400 mt-1">Authorized procurement expenditures</div>
          </div>
        </div>

        {/* KPI 3: Drafts to Submit */}
        <div className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700/80 shadow-lg backdrop-blur flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Drafts to Submit
            </span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-amber-400 font-mono">
              {kpis?.draftCount ?? 0}
            </div>
            <div className="text-xs text-slate-400 mt-1">Awaiting your approval submission</div>
          </div>
        </div>

        {/* KPI 4: Approved Ready to Send */}
        <div className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700/80 shadow-lg backdrop-blur flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-400 font-bold">
              Approved Ready to Send
            </span>
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Send className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-teal-400 font-mono">
              {kpis?.readyToSendCount ?? 0}
            </div>
            <div className="text-xs text-slate-400 mt-1">Cleared by admin; dispatch to suppliers</div>
          </div>
        </div>
      </div>

      {/* Main Attention & Top Vendors Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top-Rated Supplier Directory */}
        <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-5 shadow-xl backdrop-blur">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-3 mb-4">
            <div className="flex items-center space-x-2 text-indigo-400">
              <Award className="w-4 h-4" />
              <h3 className="font-bold text-white text-sm">Top-Rated Suppliers for Ordering</h3>
            </div>
            <button
              onClick={() => onNavigateTab && onNavigateTab('evaluations')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1"
            >
              <span>Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {topVendors.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No approved vendors rated yet.
            </div>
          ) : (
            <div className="space-y-3">
              {topVendors.map((vendor) => (
                <div
                  key={vendor._id}
                  className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/60 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-xs">{vendor.companyName}</span>
                      <TierBadge tier={vendor.ratingTier || 'Approved'} />
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {vendor.category} • Compliance: {vendor.complianceScore}%
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-bold text-indigo-400 text-xs">
                      {vendor.overallRating ? vendor.overallRating.toFixed(1) : 'Unrated'}★
                    </span>
                    <button
                      onClick={() => onStartEvaluate && onStartEvaluate(vendor)}
                      className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-[11px] font-semibold flex items-center space-x-1"
                    >
                      <Star className="w-3 h-3 text-amber-400" />
                      <span>Audit</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Immediate Action Items: Orders Awaiting Buyer Actions */}
        <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-5 shadow-xl backdrop-blur flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3 mb-4">
              <div className="flex items-center space-x-2 text-teal-400">
                <Clock className="w-4 h-4" />
                <h3 className="font-bold text-white text-sm">Action Items Needing Your Attention</h3>
              </div>
              <button
                onClick={() => onNavigateTab && onNavigateTab('pos')}
                className="text-xs text-sky-400 hover:text-sky-300 font-semibold"
              >
                View My POs
              </button>
            </div>

            <div className="space-y-3">
              {/* Drafts to submit */}
              {attention?.draftsToSubmit && attention.draftsToSubmit.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider mb-1.5">
                    Ready to Submit for Approval ({attention.draftsToSubmit.length})
                  </div>
                  {attention.draftsToSubmit.map((po) => (
                    <div
                      key={po._id}
                      className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-700/60 flex items-center justify-between mb-1.5"
                    >
                      <div className="text-xs truncate">
                        <span className="font-mono font-bold text-indigo-400">{po.poNumber}</span>
                        <span className="text-slate-300 ml-2">{po.title}</span>
                      </div>
                      <button
                        onClick={() => onNavigateTab && onNavigateTab('pos')}
                        className="px-2 py-0.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-[10px] font-semibold"
                      >
                        Submit
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Approved ready to send */}
              {attention?.approvedToSend && attention.approvedToSend.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-teal-400 uppercase tracking-wider mb-1.5">
                    Approved Orders to Transmit ({attention.approvedToSend.length})
                  </div>
                  {attention.approvedToSend.map((po) => (
                    <div
                      key={po._id}
                      className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-700/60 flex items-center justify-between mb-1.5"
                    >
                      <div className="text-xs truncate">
                        <span className="font-mono font-bold text-sky-400">{po.poNumber}</span>
                        <span className="text-slate-300 ml-2">{po.vendor?.companyName}</span>
                      </div>
                      <button
                        onClick={() => onNavigateTab && onNavigateTab('pos')}
                        className="px-2 py-0.5 bg-sky-600 hover:bg-sky-500 text-white rounded text-[10px] font-semibold"
                      >
                        Send
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Invoiced ready to close */}
              {attention?.invoicedToClose && attention.invoicedToClose.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider mb-1.5">
                    Invoiced Orders Ready to Close ({attention.invoicedToClose.length})
                  </div>
                  {attention.invoicedToClose.map((po) => (
                    <div
                      key={po._id}
                      className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-700/60 flex items-center justify-between mb-1.5"
                    >
                      <div className="text-xs truncate">
                        <span className="font-mono font-bold text-purple-400">{po.poNumber}</span>
                        <span className="text-slate-300 ml-2">{po.totalAmount?.toLocaleString()} INR</span>
                      </div>
                      <button
                        onClick={() => onNavigateTab && onNavigateTab('pos')}
                        className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-semibold"
                      >
                        Close PO
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {(!attention?.draftsToSubmit?.length &&
                !attention?.approvedToSend?.length &&
                !attention?.invoicedToClose?.length) && (
                <div className="py-8 text-center text-xs text-slate-500 flex flex-col items-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400/50 mb-2" />
                  <span>No orders requiring immediate buyer intervention!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboardView;
