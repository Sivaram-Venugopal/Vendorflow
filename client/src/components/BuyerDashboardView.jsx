import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBuyerDashboard } from '../store/slices/dashboardSlice';
import TierBadge from './TierBadge';
import AddCompanyModal from './AddCompanyModal';
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
  PieChart,
  BarChart3,
  Layers,
  Zap,
  Building2,
  UserPlus
} from 'lucide-react';

const BuyerDashboardView = ({ onStartDraftPO, onStartEvaluate, onNavigateTab }) => {
  const dispatch = useDispatch();
  const { buyerData, loading } = useSelector((state) => state.dashboard);
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchBuyerDashboard());
  }, [dispatch]);

  const kpis = buyerData?.kpis;
  const topVendors = buyerData?.topRatedVendors || [];
  const attention = buyerData?.attentionRequired;

  // Category Spend Analytics
  const categorySpendData = [
    { category: 'Industrial Equipment', spend: 320000, percentage: 42, color: 'bg-red-600' },
    { category: 'Raw Materials & Castings', spend: 210000, percentage: 28, color: 'bg-rose-500' },
    { category: 'Electronics & Sensors', spend: 145000, percentage: 19, color: 'bg-indigo-600' },
    { category: 'Logistics & Packaging', spend: 85000, percentage: 11, color: 'bg-emerald-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Action Callout Header - White & Red Theme */}
      <div className="p-6 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 rounded-2xl shadow-xl text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold tracking-wider uppercase mb-1">
            <Zap className="w-3 h-3" />
            <span>Procurement Command Desk</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight mt-1">Initiate Requisitions & Supplier Contracts</h2>
          <p className="text-xs text-red-100 mt-1 max-w-xl leading-relaxed">
            Draft itemized purchase orders with automated 18% GST tax computations, onboard accredited suppliers, and review delivery compliance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={() => setIsAddCompanyOpen(true)}
            className="px-4 py-2.5 bg-white text-red-700 hover:bg-red-50 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md transition-all hover:scale-[1.02]"
          >
            <UserPlus className="w-4 h-4 text-red-600" />
            <span>+ Onboard Company</span>
          </button>
          <button
            onClick={onStartDraftPO}
            className="px-5 py-2.5 bg-red-900/40 hover:bg-red-900/60 border border-white/30 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md transition-all hover:scale-[1.02]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Draft Purchase Order</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Active PO Count & Value */}
        <div className="p-5 bg-white rounded-2xl border border-red-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Orders
            </span>
            <div className="p-2.5 rounded-xl bg-red-50 text-red-600 border border-red-100">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-slate-900 font-mono">
              {kpis?.openPOCount ?? 0}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Active Pipeline: <span className="text-red-600 font-mono font-bold">{kpis?.openPOValue?.toLocaleString() ?? 0} INR</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Spend This Month */}
        <div className="p-5 bg-white rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Spend This Month
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-emerald-700 font-mono truncate">
              {kpis?.spendThisMonth?.toLocaleString() ?? 0} INR
            </div>
            <div className="text-xs text-slate-500 mt-1">Authorized procurement disbursements</div>
          </div>
        </div>

        {/* KPI 3: Drafts to Submit */}
        <div className="p-5 bg-white rounded-2xl border border-amber-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Drafts to Submit
            </span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-amber-700 font-mono">
              {kpis?.draftCount ?? 0}
            </div>
            <div className="text-xs text-slate-500 mt-1">Pending approval submission</div>
          </div>
        </div>

        {/* KPI 4: Approved Ready to Dispatch */}
        <div className="p-5 bg-white rounded-2xl border border-indigo-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
              Approved for Dispatch
            </span>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Send className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-indigo-700 font-mono">
              {kpis?.readyToSendCount ?? 0}
            </div>
            <div className="text-xs text-slate-500 mt-1">Cleared by admin; ready to send</div>
          </div>
        </div>
      </div>

      {/* Advanced Analytical Insights: Category Spend & Operational Velocity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Spend Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
              <BarChart3 className="w-4 h-4 text-red-600" />
              <span>Category Spend Allocation & Budget Analytics</span>
            </div>
            <span className="text-[11px] font-bold text-slate-500 uppercase">Q1 Fiscal Year</span>
          </div>

          <div className="space-y-4">
            {categorySpendData.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{item.category}</span>
                  <span className="font-mono text-slate-600 font-semibold">
                    {item.spend.toLocaleString()} INR ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-[10px] uppercase font-bold text-slate-400">On-Time Fulfillment</div>
              <div className="text-base font-extrabold text-emerald-600 mt-0.5">96.8%</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-[10px] uppercase font-bold text-slate-400">Average Turnaround</div>
              <div className="text-base font-extrabold text-red-600 mt-0.5">4.2 Days</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-[10px] uppercase font-bold text-slate-400">Budget Adherence</div>
              <div className="text-base font-extrabold text-indigo-600 mt-0.5">99.1%</div>
            </div>
          </div>
        </div>

        {/* Action Items Needing Attention */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center space-x-2 text-red-600 font-bold text-sm">
                <Clock className="w-4 h-4" />
                <span>Action Required</span>
              </div>
              <button
                onClick={() => onNavigateTab && onNavigateTab('pos')}
                className="text-xs text-red-600 hover:underline font-bold"
              >
                View POs →
              </button>
            </div>

            <div className="space-y-3">
              {attention?.draftsToSubmit && attention.draftsToSubmit.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider mb-1.5">
                    Ready to Submit ({attention.draftsToSubmit.length})
                  </div>
                  {attention.draftsToSubmit.slice(0, 3).map((po) => (
                    <div
                      key={po._id}
                      className="p-2.5 bg-amber-50/50 rounded-xl border border-amber-100 flex items-center justify-between mb-1.5"
                    >
                      <div className="text-xs truncate pr-2">
                        <span className="font-mono font-bold text-slate-900">{po.poNumber}</span>
                        <div className="text-[11px] text-slate-500 truncate">{po.title}</div>
                      </div>
                      <button
                        onClick={() => onNavigateTab && onNavigateTab('pos')}
                        className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10px] font-bold flex-shrink-0"
                      >
                        Submit
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {attention?.approvedToSend && attention.approvedToSend.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider mb-1.5">
                    Approved to Transmit ({attention.approvedToSend.length})
                  </div>
                  {attention.approvedToSend.slice(0, 3).map((po) => (
                    <div
                      key={po._id}
                      className="p-2.5 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-center justify-between mb-1.5"
                    >
                      <div className="text-xs truncate pr-2">
                        <span className="font-mono font-bold text-slate-900">{po.poNumber}</span>
                        <div className="text-[11px] text-slate-500 truncate">{po.vendor?.companyName}</div>
                      </div>
                      <button
                        onClick={() => onNavigateTab && onNavigateTab('pos')}
                        className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] font-bold flex-shrink-0"
                      >
                        Send
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {(!attention?.draftsToSubmit?.length && !attention?.approvedToSend?.length) && (
                <div className="py-8 text-center text-xs text-slate-400">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                  <span>All purchase orders are synchronized! No urgent buyer actions pending.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Top-Rated Supplier Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
            <Award className="w-4 h-4 text-red-600" />
            <span>Top-Tier Verified Suppliers</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsAddCompanyOpen(true)}
              className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center space-x-1"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Onboard Supplier</span>
            </button>
            <button
              onClick={() => onNavigateTab && onNavigateTab('evaluations')}
              className="text-xs text-slate-600 hover:text-slate-900 font-bold flex items-center space-x-1"
            >
              <span>Full Directory →</span>
            </button>
          </div>
        </div>

        {topVendors.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No rated suppliers available in directory yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {topVendors.map((vendor) => (
              <div
                key={vendor._id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-red-300 hover:bg-red-50/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-slate-900 text-xs truncate max-w-[160px]">
                      {vendor.companyName}
                    </span>
                    <TierBadge tier={vendor.ratingTier || 'Approved'} />
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {vendor.category} • Score: {vendor.complianceScore}%
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-700 text-xs">
                    {vendor.overallRating ? vendor.overallRating.toFixed(1) : '5.0'} ★
                  </span>
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => onStartEvaluate && onStartEvaluate(vendor)}
                      className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded text-[11px] font-bold"
                    >
                      Audit
                    </button>
                    <button
                      onClick={onStartDraftPO}
                      className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[11px] font-bold"
                    >
                      Issue PO
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Company Modal */}
      <AddCompanyModal
        isOpen={isAddCompanyOpen}
        onClose={() => setIsAddCompanyOpen(false)}
        onCompanyAdded={() => {
          dispatch(fetchBuyerDashboard());
        }}
      />
    </div>
  );
};

export default BuyerDashboardView;
