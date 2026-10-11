import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminDashboard } from '../store/slices/dashboardSlice';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';
import {
  Users,
  Clock,
  ShoppingBag,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  FileCheck,
  ArrowRight,
  ShieldAlert,
  Building2,
  RefreshCw,
  Award,
  ChevronRight,
} from 'lucide-react';

const TIER_COLORS = {
  Preferred: '#10B981',
  Approved: '#38BDF8',
  'On-Watch': '#F59E0B',
  Blacklisted: '#F43F5E',
};

const AdminDashboardView = ({ onNavigateTab }) => {
  const dispatch = useDispatch();
  const { adminData, loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchAdminDashboard());
  }, [dispatch]);

  const kpis = adminData?.kpis;
  const analytics = adminData?.analytics;
  const attention = adminData?.attentionRequired;

  return (
    <div className="space-y-6">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Active Vendors */}
        <div className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700/80 shadow-lg backdrop-blur flex flex-col justify-between hover:border-slate-600 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Active Suppliers
            </span>
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-white font-mono">
              {kpis?.activeVendors ?? 0}
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center space-x-1">
              <span>Out of {kpis?.totalVendors ?? 0} total registered</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Pending Governance Approvals */}
        <div className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700/80 shadow-lg backdrop-blur flex flex-col justify-between hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 font-bold">
              Pending Approvals
            </span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-amber-400 font-mono">
              {kpis?.pendingApprovals ?? 0}
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center space-x-2">
              <span>{kpis?.pendingVendors ?? 0} vendors</span>
              <span>•</span>
              <span>{kpis?.pendingPOs ?? 0} POs</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Open POs */}
        <div className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700/80 shadow-lg backdrop-blur flex flex-col justify-between hover:border-slate-600 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Open Purchase Orders
            </span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-white font-mono">
              {kpis?.openPOs ?? 0}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Active Value: <span className="text-indigo-300 font-semibold font-mono">{kpis?.openPOValue?.toLocaleString() ?? 0} INR</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Spend This Month */}
        <div className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700/80 shadow-lg backdrop-blur flex flex-col justify-between hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 font-bold">
              Monthly Procurement Spend
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-emerald-400 font-mono truncate">
              {kpis?.spendThisMonth?.toLocaleString() ?? 0} INR
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Across {kpis?.spendPOCount ?? 0} order(s) this month
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Vendor Tier Distribution */}
        <div className="p-6 bg-slate-800/80 rounded-2xl border border-slate-700/80 shadow-xl backdrop-blur">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-white text-sm">Vendor Statutory Tier Distribution</h3>
              <p className="text-xs text-slate-400">Approved suppliers partitioned by scorecard rating bracket</p>
            </div>
            <button
              onClick={() => onNavigateTab && onNavigateTab('comparison')}
              className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center space-x-1"
            >
              <span>Full Matrix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.vendorTierComparison || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="tier" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#F8FAFC' }}
                  formatter={(value, name) => [value, name === 'count' ? 'Suppliers' : name]}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {analytics?.vendorTierComparison?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={TIER_COLORS[entry.tier] || '#38BDF8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: PO Status Funnel */}
        <div className="p-6 bg-slate-800/80 rounded-2xl border border-slate-700/80 shadow-xl backdrop-blur">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-white text-sm">Purchase Order Lifecycle Funnel</h3>
              <p className="text-xs text-slate-400">Order count and progression through the FSM state machine</p>
            </div>
            <button
              onClick={() => onNavigateTab && onNavigateTab('orders')}
              className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center space-x-1"
            >
              <span>View All POs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {analytics?.poStatusFunnel?.map((stage) => {
              const maxCount = Math.max(...(analytics?.poStatusFunnel?.map((s) => s.count) || [1]), 1);
              const percentage = Math.round((stage.count / maxCount) * 100);

              return (
                <div key={stage.stage} className="text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-300">{stage.stage}</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-white font-bold">{stage.count} orders</span>
                      {stage.value > 0 && (
                        <span className="text-[10px] text-emerald-400 font-mono">
                          ({stage.value.toLocaleString()} INR)
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-sky-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(percentage, stage.count > 0 ? 5 : 0)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Immediate Attention Required Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Vendors Awaiting Verification */}
        <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-5 shadow-xl backdrop-blur flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3 mb-4">
              <div className="flex items-center space-x-2 text-amber-400">
                <Clock className="w-4 h-4" />
                <h4 className="font-bold text-white text-sm">
                  Vendor Onboarding Verification Queue ({attention?.pendingVendors?.length || 0})
                </h4>
              </div>
              <button
                onClick={() => onNavigateTab && onNavigateTab('queue')}
                className="text-xs text-sky-400 hover:text-sky-300 font-semibold"
              >
                Review All
              </button>
            </div>

            {attention?.pendingVendors?.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500 flex flex-col items-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400/50 mb-2" />
                <span>All supplier onboarding queues are up to date!</span>
              </div>
            ) : (
              <div className="space-y-2.5">
                {attention?.pendingVendors?.map((v) => (
                  <div
                    key={v._id}
                    className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/60 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
                  >
                    <div>
                      <div className="font-bold text-white text-xs">{v.companyName}</div>
                      <div className="text-[11px] text-slate-400">
                        {v.category} • GSTIN: {v.taxId}
                      </div>
                    </div>
                    <button
                      onClick={() => onNavigateTab && onNavigateTab('queue')}
                      className="px-2.5 py-1 bg-amber-600/80 hover:bg-amber-500 text-white rounded text-[11px] font-semibold flex items-center space-x-1"
                    >
                      <span>Audit KYC</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pending POs Awaiting Governance Approval */}
        <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-5 shadow-xl backdrop-blur flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3 mb-4">
              <div className="flex items-center space-x-2 text-sky-400">
                <FileCheck className="w-4 h-4" />
                <h4 className="font-bold text-white text-sm">
                  Purchase Orders Awaiting Governance Release ({attention?.pendingPOs?.length || 0})
                </h4>
              </div>
              <button
                onClick={() => onNavigateTab && onNavigateTab('orders')}
                className="text-xs text-sky-400 hover:text-sky-300 font-semibold"
              >
                Inspect All
              </button>
            </div>

            {attention?.pendingPOs?.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500 flex flex-col items-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400/50 mb-2" />
                <span>No purchase orders awaiting budget clearance!</span>
              </div>
            ) : (
              <div className="space-y-2.5">
                {attention?.pendingPOs?.map((po) => (
                  <div
                    key={po._id}
                    className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/60 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
                  >
                    <div>
                      <div className="font-mono font-bold text-sky-400 text-xs">
                        {po.poNumber} — <span className="text-white font-normal">{po.title}</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {po.vendor?.companyName} • By {po.buyer?.name}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-emerald-400 font-bold text-xs">
                        {po.totalAmount?.toLocaleString()} INR
                      </span>
                      <button
                        onClick={() => onNavigateTab && onNavigateTab('orders')}
                        className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded text-[11px] font-semibold"
                      >
                        Authorize
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardView;
