import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendors } from '../store/slices/vendorSlice';
import { fetchVendorEvaluations } from '../store/slices/evaluationSlice';
import { fetchPurchaseOrders, fetchPODetails, updatePOStatus } from '../store/slices/purchaseOrderSlice';
import PendingVendorsQueue from '../components/PendingVendorsQueue';
import VendorTierComparisonView from '../components/VendorTierComparisonView';
import VendorScorecardView from '../components/VendorScorecardView';
import POStatusBadge from '../components/POStatusBadge';
import PODetailView from '../components/PODetailView';
import AdminActivityLog from '../components/AdminActivityLog';
import AdminDashboardView from '../components/AdminDashboardView';
import { 
  LayoutDashboard,
  ShieldCheck, 
  Users, 
  Filter, 
  Search, 
  RefreshCw, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  FileCheck, 
  BarChart2, 
  ArrowLeft,
  ShoppingBag,
  CheckCircle,
  Eye,
  FileText
} from 'lucide-react';

const AdminPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { vendors, loading } = useSelector((state) => state.vendor);
  const { history, selectedVendor } = useSelector((state) => state.evaluation);
  const { orders, loading: poLoading } = useSelector((state) => state.po);

  // 'dashboard' | 'queue' | 'orders' | 'comparison' | 'activity' | 'scorecard' | 'view-po'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [statusFilter, setStatusFilter] = useState('All');
  const [poStatusFilter, setPoStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectingVendor, setInspectingVendor] = useState(null);
  const [selectedPO, setSelectedPO] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const loadVendors = () => {
    dispatch(fetchVendors({ status: statusFilter, search: searchQuery }));
  };

  useEffect(() => {
    loadVendors();
    dispatch(fetchPurchaseOrders());
  }, [dispatch, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadVendors();
  };

  const handleSelectVendorForScorecard = async (vendor) => {
    setInspectingVendor(vendor);
    await dispatch(fetchVendorEvaluations(vendor._id || vendor.id));
    setActiveTab('scorecard');
  };

  const handleOpenPODetails = async (po) => {
    setSelectedPO(po);
    await dispatch(fetchPODetails(po._id));
    setActiveTab('view-po');
  };

  const handleApprovePO = async (po) => {
    setActionLoading(po._id);
    await dispatch(updatePOStatus({
      poId: po._id,
      status: 'Approved',
      remarks: 'Approved by admin governance review'
    }));
    setActionLoading(null);
    dispatch(fetchPurchaseOrders());
  };

  const handleRejectPO = async (po) => {
    const reason = window.prompt('Specify reason for rejecting this purchase order:');
    if (reason === null) return;
    setActionLoading(po._id);
    await dispatch(updatePOStatus({
      poId: po._id,
      status: 'Rejected',
      remarks: reason || 'PO rejected by administrator'
    }));
    setActionLoading(null);
    dispatch(fetchPurchaseOrders());
  };

  const pendingCount = vendors.filter((v) => v.status === 'Pending').length;
  const approvedCount = vendors.filter((v) => v.status === 'Approved').length;
  const rejectedCount = vendors.filter((v) => v.status === 'Rejected').length;
  const pendingPOCount = orders.filter((p) => p.status === 'Pending Approval').length;

  const filteredOrders = orders.filter((order) => {
    return poStatusFilter === 'All' || order.status === poStatusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 mb-1">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Governance Desk</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Admin Vendor Governance & Orders</h1>
          <p className="text-xs text-slate-500 mt-1">
            Review onboarding submissions, authorize purchase orders, and monitor supplier rating tiers.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {activeTab === 'scorecard' ? (
            <button
              onClick={() => setActiveTab('comparison')}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold flex items-center space-x-1.5 border border-slate-200 shadow-xs transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Comparisons</span>
            </button>
          ) : activeTab === 'view-po' ? (
            <button
              onClick={() => setActiveTab('orders')}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold flex items-center space-x-1.5 border border-slate-200 shadow-xs transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Orders List</span>
            </button>
          ) : (
            <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => setActiveTab('queue')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'queue' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Onboarding ({pendingCount})
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  activeTab === 'orders' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>PO Approvals {pendingPOCount > 0 && `(${pendingPOCount})`}</span>
              </button>
              <button
                onClick={() => setActiveTab('comparison')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  activeTab === 'comparison' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Tiers</span>
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  activeTab === 'activity' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Activity Log</span>
              </button>
            </div>
          )}

          <button
            onClick={() => { loadVendors(); dispatch(fetchPurchaseOrders()); }}
            className="p-2 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-xl border border-slate-200 transition-colors shadow-xs"
            title="Refresh records"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tab 0: Admin Executive & Operations Dashboard */}
      {activeTab === 'dashboard' && (
        <AdminDashboardView onNavigateTab={(tab) => setActiveTab(tab)} />
      )}

      {/* Tab 1: Onboarding Queue */}
      {activeTab === 'queue' && (
        <div className="space-y-6">
          {/* Overview Stat Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-amber-200/80 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-xs text-amber-700 font-bold uppercase">Pending Verification</div>
                <div className="text-2xl font-black text-slate-900 mt-1">{pendingCount}</div>
              </div>
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-200">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-emerald-200/80 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-xs text-emerald-700 font-bold uppercase">Approved Vendors</div>
                <div className="text-2xl font-black text-slate-900 mt-1">{approvedCount}</div>
              </div>
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-rose-200/80 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-xs text-rose-700 font-bold uppercase">Rejected Vendors</div>
                <div className="text-2xl font-black text-slate-900 mt-1">{rejectedCount}</div>
              </div>
              <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl border border-rose-200">
                <XCircle className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-indigo-200/80 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-xs text-indigo-700 font-bold uppercase">Pending PO Approvals</div>
                <div className="text-2xl font-black text-slate-900 mt-1">{pendingPOCount}</div>
              </div>
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-200">
                <ShoppingBag className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-700">Status Filter:</span>
              <div className="flex items-center space-x-1">
                {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      statusFilter === status
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search company or tax ID..."
                  className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold transition-colors shadow-xs"
              >
                Search
              </button>
            </form>
          </div>

          {/* Pending Vendors Review Queue */}
          <PendingVendorsQueue vendors={vendors} onStatusChange={loadVendors} />
        </div>
      )}

      {/* Tab: Purchase Orders Governance & Approvals */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="text-xs font-bold text-slate-700">Filter PO State:</div>
              <select
                value={poStatusFilter}
                onChange={(e) => setPoStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500"
              >
                <option value="All">All States ({orders.length})</option>
                <option value="Pending Approval">Pending Approval ({pendingPOCount})</option>
                <option value="Approved">Approved</option>
                <option value="Sent">Sent</option>
                <option value="Acknowledged">Acknowledged</option>
                <option value="Delivered">Delivered</option>
                <option value="Invoiced">Invoiced</option>
                <option value="Closed">Closed</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div className="text-xs font-medium text-slate-500">
              Showing {filteredOrders.length} order(s)
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-extrabold text-slate-900 text-base">Enterprise Purchase Orders</h3>
              <p className="text-xs text-slate-500">Review line items, grant budget approval, or monitor supplier execution</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase font-bold text-[11px] tracking-wider">
                    <th className="py-3 px-4">PO Reference</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Supplier</th>
                    <th className="py-3 px-4">Buyer Officer</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Governance Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No purchase orders matching criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((po) => (
                      <tr key={po._id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">{po.poNumber}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">{po.title}</td>
                        <td className="py-3.5 px-4 text-slate-700 font-medium">{po.vendor?.companyName || 'N/A'}</td>
                        <td className="py-3.5 px-4 text-slate-500">{po.buyer?.name || 'Buyer'}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          {po.totalAmount?.toLocaleString()} {po.currency}
                        </td>
                        <td className="py-3.5 px-4">
                          <POStatusBadge status={po.status} />
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            {po.status === 'Pending Approval' && (
                              <>
                                <button
                                  onClick={() => handleApprovePO(po)}
                                  disabled={actionLoading === po._id}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold flex items-center space-x-1 shadow-xs transition-colors"
                                  title="Approve Order"
                                >
                                  <CheckCircle className="w-3 h-3" />
                                  <span>Approve</span>
                                </button>
                                <button
                                  onClick={() => handleRejectPO(po)}
                                  disabled={actionLoading === po._id}
                                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[11px] font-bold flex items-center space-x-1 shadow-xs transition-colors"
                                  title="Reject Order"
                                >
                                  <XCircle className="w-3 h-3" />
                                  <span>Reject</span>
                                </button>
                              </>
                            )}

                            <button
                              onClick={() => handleOpenPODetails(po)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold flex items-center space-x-1 transition-colors"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Details</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Detailed PO View with Stepper */}
      {activeTab === 'view-po' && selectedPO && (
        <PODetailView
          po={selectedPO}
          onBack={() => setActiveTab('orders')}
          onStatusUpdated={() => {
            dispatch(fetchPurchaseOrders());
          }}
        />
      )}

      {/* Tab 2: Vendor Tier Comparison Matrix */}
      {activeTab === 'comparison' && (
        <VendorTierComparisonView onSelectVendor={handleSelectVendorForScorecard} />
      )}

      {/* Tab 3: Detailed Scorecard View */}
      {activeTab === 'scorecard' && inspectingVendor && (
        <VendorScorecardView
          vendor={selectedVendor || inspectingVendor}
          evaluations={history}
        />
      )}

      {/* Tab 4: System Audit Activity Log */}
      {activeTab === 'activity' && (
        <AdminActivityLog />
      )}
    </div>
  );
};

export default AdminPage;
