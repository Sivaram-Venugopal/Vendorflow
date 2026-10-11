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
import { 
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

  // 'queue' | 'comparison' | 'scorecard' | 'orders' | 'view-po'
  const [activeTab, setActiveTab] = useState('queue');
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
      <div className="border-b border-slate-800 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-sky-400 mb-1">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Governance Desk</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Vendor Governance & Orders</h1>
          <p className="text-sm text-slate-400 mt-1">
            Review onboarding submissions, authorize purchase orders, and monitor supplier rating tiers.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {activeTab === 'scorecard' ? (
            <button
              onClick={() => setActiveTab('comparison')}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center space-x-1.5 border border-slate-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Comparisons</span>
            </button>
          ) : activeTab === 'view-po' ? (
            <button
              onClick={() => setActiveTab('orders')}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center space-x-1.5 border border-slate-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Orders List</span>
            </button>
          ) : (
            <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setActiveTab('queue')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'queue' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Onboarding ({pendingCount})
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
                  activeTab === 'orders' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>PO Approvals {pendingPOCount > 0 && `(${pendingPOCount})`}</span>
              </button>
              <button
                onClick={() => setActiveTab('comparison')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
                  activeTab === 'comparison' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Tiers</span>
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
                  activeTab === 'activity' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Activity Log</span>
              </button>
            </div>
          )}

          <button
            onClick={() => { loadVendors(); dispatch(fetchPurchaseOrders()); }}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
            title="Refresh records"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tab 1: Onboarding Queue */}
      {activeTab === 'queue' && (
        <div className="space-y-6">
          {/* Overview Stat Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase">Pending Verification</div>
                <div className="text-2xl font-bold text-amber-400 mt-1">{pendingCount}</div>
              </div>
              <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase">Approved Vendors</div>
                <div className="text-2xl font-bold text-emerald-400 mt-1">{approvedCount}</div>
              </div>
              <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase">Rejected Vendors</div>
                <div className="text-2xl font-bold text-rose-400 mt-1">{rejectedCount}</div>
              </div>
              <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
                <XCircle className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase">Pending PO Approvals</div>
                <div className="text-2xl font-bold text-sky-400 mt-1">{pendingPOCount}</div>
              </div>
              <div className="p-2.5 bg-sky-500/10 text-sky-400 rounded-xl border border-sky-500/20">
                <ShoppingBag className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-4 shadow-lg backdrop-blur flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-300">Status Filter:</span>
              <div className="flex items-center space-x-1">
                {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                      statusFilter === status
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search company or tax ID..."
                  className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold"
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
          <div className="flex items-center justify-between bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 shadow-lg backdrop-blur">
            <div className="flex items-center space-x-3">
              <div className="text-xs font-semibold text-slate-300">Filter PO State:</div>
              <select
                value={poStatusFilter}
                onChange={(e) => setPoStatusFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-sky-500"
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
            <div className="text-xs text-slate-400">
              Showing {filteredOrders.length} order(s)
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 overflow-hidden shadow-xl backdrop-blur">
            <div className="p-4 border-b border-slate-700/80">
              <h3 className="font-bold text-white text-base">Enterprise Purchase Orders</h3>
              <p className="text-xs text-slate-400">Review line items, grant budget approval, or monitor supplier execution</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900/60 border-b border-slate-700/60 text-slate-400 uppercase font-semibold">
                    <th className="py-3 px-4">PO Reference</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Supplier</th>
                    <th className="py-3 px-4">Buyer Officer</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Governance Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50 text-slate-200">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No purchase orders matching criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((po) => (
                      <tr key={po._id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-sky-400">{po.poNumber}</td>
                        <td className="py-3.5 px-4 font-semibold text-white">{po.title}</td>
                        <td className="py-3.5 px-4 text-slate-300">{po.vendor?.companyName || 'N/A'}</td>
                        <td className="py-3.5 px-4 text-slate-400">{po.buyer?.name || 'Buyer'}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
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
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-semibold flex items-center space-x-1"
                                  title="Approve Order"
                                >
                                  <CheckCircle className="w-3 h-3" />
                                  <span>Approve</span>
                                </button>
                                <button
                                  onClick={() => handleRejectPO(po)}
                                  disabled={actionLoading === po._id}
                                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-[11px] font-semibold flex items-center space-x-1"
                                  title="Reject Order"
                                >
                                  <XCircle className="w-3 h-3" />
                                  <span>Reject</span>
                                </button>
                              </>
                            )}

                            <button
                              onClick={() => handleOpenPODetails(po)}
                              className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded text-[11px] font-semibold flex items-center space-x-1"
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
