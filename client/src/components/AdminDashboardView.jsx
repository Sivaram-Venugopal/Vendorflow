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
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Suppliers
            </span>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-slate-900 font-mono">
              {kpis?.activeVendors ?? 0}
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center space-x-1">
              <span>Out of {kpis?.totalVendors ?? 0} total registered</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Pending Governance Approvals */}
        <div className="p-5 bg-white rounded-2xl border border-amber-200/80 shadow-sm flex flex-col justify-between hover:border-amber-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Pending Approvals
            </span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-amber-700 font-mono">
              {kpis?.pendingApprovals ?? 0}
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center space-x-2">
              <span>{kpis?.pendingVendors ?? 0} vendors</span>
              <span>•</span>
              <span>{kpis?.pendingPOs ?? 0} POs</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Open POs */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Open Purchase Orders
            </span>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-slate-900 font-mono">
              {kpis?.openPOs ?? 0}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Active Value: <span className="text-indigo-600 font-bold font-mono">{kpis?.openPOValue?.toLocaleString() ?? 0} INR</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Spend This Month */}
        <div className="p-5 bg-white rounded-2xl border border-emerald-200/80 shadow-sm flex flex-col justify-between hover:border-emerald-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Monthly Procurement Spend
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-black text-emerald-700 font-mono truncate">
              {kpis?.spendThisMonth?.toLocaleString() ?? 0} INR
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Across {kpis?.spendPOCount ?? 0} order(s) this month
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Vendor Tier Distribution */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Vendor Statutory Tier Distribution</h3>
              <p className="text-xs text-slate-500">Approved suppliers partitioned by scorecard rating bracket</p>
            </div>
            <button
              onClick={() => onNavigateTab && onNavigateTab('comparison')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center space-x-1"
            >
              <span>Full Matrix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.vendorTierComparison || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="tier" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0f172a' }}
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
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Purchase Order Lifecycle Funnel</h3>
              <p className="text-xs text-slate-500">Order count and progression through the FSM state machine</p>
            </div>
            <button
              onClick={() => onNavigateTab && onNavigateTab('orders')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center space-x-1"
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
                    <span className="font-bold text-slate-700">{stage.stage}</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-slate-900 font-bold">{stage.count} orders</span>
                      {stage.value > 0 && (
                        <span className="text-[10px] text-emerald-700 font-mono font-semibold">
                          ({stage.value.toLocaleString()} INR)
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
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
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center space-x-2 text-amber-700">
                <Clock className="w-4 h-4 text-amber-600" />
                <h4 className="font-bold text-slate-900 text-sm">
                  Vendor Onboarding Verification Queue ({attention?.pendingVendors?.length || 0})
                </h4>
              </div>
              <button
                onClick={() => onNavigateTab && onNavigateTab('queue')}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-bold"
              >
                Review All
              </button>
            </div>

            {attention?.pendingVendors?.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 flex flex-col items-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-500/50 mb-2" />
                <span>All supplier onboarding queues are up to date!</span>
              </div>
            ) : (
              <div className="space-y-2.5">
                {attention?.pendingVendors?.map((v) => (
                  <div
                    key={v._id}
                    className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/80 flex items-center justify-between hover:bg-slate-100/70 transition-colors"
                  >
                    <div>
                      <div className="font-bold text-slate-900 text-xs">{v.companyName}</div>
                      <div className="text-[11px] text-slate-500">
                        {v.category} • GSTIN: {v.taxId}
                      </div>
                    </div>
                    <button
                      onClick={() => onNavigateTab && onNavigateTab('queue')}
                      className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-bold flex items-center space-x-1 shadow-xs transition-colors"
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
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center space-x-2 text-indigo-600">
                <FileCheck className="w-4 h-4" />
                <h4 className="font-bold text-slate-900 text-sm">
                  Purchase Orders Awaiting Governance Release ({attention?.pendingPOs?.length || 0})
                </h4>
              </div>
              <button
                onClick={() => onNavigateTab && onNavigateTab('orders')}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-bold"
              >
                Inspect All
              </button>
            </div>

            {attention?.pendingPOs?.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 flex flex-col items-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-500/50 mb-2" />
                <span>No purchase orders awaiting budget clearance!</span>
              </div>
            ) : (
              <div className="space-y-2.5">
                {attention?.pendingPOs?.map((po) => (
                  <div
                    key={po._id}
                    className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/80 flex items-center justify-between hover:bg-slate-100/70 transition-colors"
                  >
                    <div>
                      <div className="font-mono font-bold text-indigo-600 text-xs">
                        {po.poNumber} — <span className="text-slate-900 font-semibold">{po.title}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {po.vendor?.companyName} • By {po.buyer?.name}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-slate-900 font-bold text-xs">
                        {po.totalAmount?.toLocaleString()} INR
                      </span>
                      <button
                        onClick={() => onNavigateTab && onNavigateTab('orders')}
                        className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-bold shadow-xs transition-colors"
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
