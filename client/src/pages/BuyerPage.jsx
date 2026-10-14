import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendors } from '../store/slices/vendorSlice';
import { fetchVendorEvaluations } from '../store/slices/evaluationSlice';
import { fetchPurchaseOrders, fetchPODetails, updatePOStatus } from '../store/slices/purchaseOrderSlice';
import POBuilder from '../components/POBuilder';
import PODetailView from '../components/PODetailView';
import POStatusBadge from '../components/POStatusBadge';
import EvaluatorForm from '../components/EvaluatorForm';
import VendorScorecardView from '../components/VendorScorecardView';
import TierBadge from '../components/TierBadge';
import BuyerDashboardView from '../components/BuyerDashboardView';
import AddCompanyModal from '../components/AddCompanyModal';
import { 
  LayoutDashboard,
  ShoppingBag, 
  Award, 
  FileText, 
  PlusCircle, 
  Search, 
  ArrowLeft, 
  Send, 
  Eye, 
  Star, 
  RefreshCw, 
  TrendingUp,
  UserPlus,
  Building2,
  CheckCircle2
} from 'lucide-react';

const BuyerPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { vendors } = useSelector((state) => state.vendor);
  const { history, selectedVendor } = useSelector((state) => state.evaluation);
  const { orders, loading: poLoading } = useSelector((state) => state.po);

  // Navigation tabs: 'dashboard' | 'pos' | 'new-po' | 'view-po' | 'evaluations' | 'new-evaluation' | 'view-scorecard'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPO, setSelectedPO] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);

  // Evaluation states
  const [evaluatingVendor, setEvaluatingVendor] = useState(null);
  const [viewingVendor, setViewingVendor] = useState(null);

  useEffect(() => {
    dispatch(fetchVendors());
    dispatch(fetchPurchaseOrders());
  }, [dispatch]);

  const handleRefresh = () => {
    if (activeTab === 'pos' || activeTab === 'view-po') {
      dispatch(fetchPurchaseOrders());
    } else {
      dispatch(fetchVendors());
    }
  };

  const handleOpenPODetails = async (po) => {
    setSelectedPO(po);
    await dispatch(fetchPODetails(po._id));
    setActiveTab('view-po');
  };

  const handleQuickSubmitDraft = async (po) => {
    await dispatch(updatePOStatus({ poId: po._id, status: 'Pending Approval', remarks: 'Submitted draft for admin approval' }));
    dispatch(fetchPurchaseOrders());
  };

  const handleQuickSendApproved = async (po) => {
    await dispatch(updatePOStatus({ poId: po._id, status: 'Sent', remarks: 'Dispatched to supplier' }));
    dispatch(fetchPurchaseOrders());
  };

  const handleStartEvaluate = (vendor) => {
    setEvaluatingVendor(vendor);
    setActiveTab('new-evaluation');
  };

  const handleViewScorecard = async (vendor) => {
    setViewingVendor(vendor);
    await dispatch(fetchVendorEvaluations(vendor._id || vendor.id));
    setActiveTab('view-scorecard');
  };

  // Filtering POs
  const filteredPOs = orders.filter((order) => {
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    const matchesSearch = 
      order.poNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.vendor?.companyName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Filter approved vendors for PO creation & evaluation
  const approvedVendors = vendors.filter((v) => v.status === 'Approved');

  return (
    <div className="space-y-6">
      {/* Header Banner - White & Red Modern Aesthetic */}
      <div className="border-b border-slate-200 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-red-600 mb-1">
            <ShoppingBag className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Procurement Operations</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Buyer Procurement & Lifecycle</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Draft Purchase Orders, enforce FSM approvals, dispatch to vendors, and evaluate supplier scorecards.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Main Top Tab Switcher */}
          {(activeTab === 'dashboard' || activeTab === 'pos' || activeTab === 'evaluations') && (
            <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  activeTab === 'dashboard' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => setActiveTab('pos')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  activeTab === 'pos' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>My POs ({orders.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('evaluations')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  activeTab === 'evaluations' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Suppliers</span>
              </button>
            </div>
          )}

          {/* Quick Onboard Company Button */}
          <button
            onClick={() => setIsAddCompanyOpen(true)}
            className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5 text-red-600" />
            <span>+ Onboard Company</span>
          </button>

          {/* Back Buttons for Sub-views */}
          {activeTab === 'new-po' && (
            <button
              onClick={() => setActiveTab('pos')}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Cancel Draft</span>
            </button>
          )}

          {activeTab === 'view-po' && (
            <button
              onClick={() => setActiveTab('pos')}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to My POs</span>
            </button>
          )}

          {(activeTab === 'new-evaluation' || activeTab === 'view-scorecard') && (
            <button
              onClick={() => setActiveTab('evaluations')}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Directory</span>
            </button>
          )}

          <button
            onClick={handleRefresh}
            className="p-2 bg-white hover:bg-slate-50 text-slate-600 rounded-xl border border-slate-200 transition-colors shadow-xs"
            title="Refresh records"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 0. BUYER PROCUREMENT & ANALYTICS DASHBOARD */}
      {activeTab === 'dashboard' && (
        <BuyerDashboardView
          onStartDraftPO={() => setActiveTab('new-po')}
          onStartEvaluate={(v) => {
            setEvaluatingVendor(v);
            setActiveTab('new-evaluation');
          }}
          onNavigateTab={(tab) => setActiveTab(tab)}
        />
      )}

      {/* 1. PURCHASE ORDERS LIST VIEW */}
      {activeTab === 'pos' && (
        <div className="space-y-6">
          {/* Action & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by PO#, title, vendor..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-red-500 focus:bg-white"
              >
                <option value="All">All Statuses ({orders.length})</option>
                <option value="Draft">Draft</option>
                <option value="Pending Approval">Pending Approval</option>
                <option value="Approved">Approved</option>
                <option value="Sent">Sent</option>
                <option value="Acknowledged">Acknowledged</option>
                <option value="Delivered">Delivered</option>
                <option value="Invoiced">Invoiced</option>
                <option value="Closed">Closed</option>
                <option value="Rejected">Rejected</option>
                <option value="Declined">Declined</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsAddCompanyOpen(true)}
                className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-xs"
              >
                <UserPlus className="w-4 h-4 text-red-600" />
                <span>+ Onboard Company</span>
              </button>
              <button
                onClick={() => setActiveTab('new-po')}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-md shadow-red-600/20 transition-all hover:scale-[1.02]"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Draft New Purchase Order</span>
              </button>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Purchase Orders Directory</h3>
                <p className="text-xs text-slate-500">Total {filteredPOs.length} order(s) match criteria</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[11px]">
                    <th className="py-3 px-4">PO Reference</th>
                    <th className="py-3 px-4">Title / Scope</th>
                    <th className="py-3 px-4">Target Supplier</th>
                    <th className="py-3 px-4">Total Value</th>
                    <th className="py-3 px-4">Lifecycle State</th>
                    <th className="py-3 px-4">Created Date</th>
                    <th className="py-3 px-4 text-right">Workflow Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredPOs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No purchase orders found. Create your first PO using "Draft New Purchase Order".
                      </td>
                    </tr>
                  ) : (
                    filteredPOs.map((order) => (
                      <tr key={order._id} className="hover:bg-red-50/20 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-red-600">
                          {order.poNumber}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 max-w-xs truncate">{order.title}</div>
                          <div className="text-[11px] text-slate-400">{order.items?.length || 0} line item(s)</div>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-800">
                          {order.vendor?.companyName || 'Unknown Vendor'}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                          {order.totalAmount?.toLocaleString()} {order.currency}
                        </td>
                        <td className="py-3.5 px-4">
                          <POStatusBadge status={order.status} />
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            {/* Quick Submit draft for approval */}
                            {order.status === 'Draft' && (
                              <button
                                onClick={() => handleQuickSubmitDraft(order)}
                                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-[11px] font-bold flex items-center space-x-1"
                                title="Submit Draft to Admin for Approval"
                              >
                                <Send className="w-3 h-3" />
                                <span>Submit</span>
                              </button>
                            )}

                            {/* Quick Send to Vendor */}
                            {order.status === 'Approved' && (
                              <button
                                onClick={() => handleQuickSendApproved(order)}
                                className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[11px] font-bold flex items-center space-x-1"
                                title="Send Approved PO to Supplier"
                              >
                                <Send className="w-3 h-3" />
                                <span>Send</span>
                              </button>
                            )}

                            <button
                              onClick={() => handleOpenPODetails(order)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-[11px] font-bold flex items-center space-x-1 border border-slate-200"
                            >
                              <Eye className="w-3 h-3 text-slate-600" />
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

      {/* 2. DRAFT NEW PURCHASE ORDER VIEW */}
      {activeTab === 'new-po' && (
        <POBuilder
          vendors={approvedVendors}
          onComplete={(newOrder) => {
            dispatch(fetchPurchaseOrders());
            setSelectedPO(newOrder);
            setActiveTab('view-po');
          }}
        />
      )}

      {/* 3. PO DETAIL & LIFECYCLE STEPPER VIEW */}
      {activeTab === 'view-po' && selectedPO && (
        <PODetailView
          po={selectedPO}
          onBack={() => setActiveTab('pos')}
          onStatusUpdated={() => {
            dispatch(fetchPurchaseOrders());
          }}
        />
      )}

      {/* 4. SUPPLIER DIRECTORY FOR EVALUATIONS */}
      {activeTab === 'evaluations' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Approved Supplier Directory</h3>
                <p className="text-xs text-slate-500">Audit supplier performance and issue weighted scorecard evaluations</p>
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter suppliers by name or category..."
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white"
                  />
                </div>
                <button
                  onClick={() => setIsAddCompanyOpen(true)}
                  className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1 shadow-xs whitespace-nowrap"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Add Company</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[11px]">
                    <th className="py-3 px-4">Supplier Company</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Current Rating Tier</th>
                    <th className="py-3 px-4">Composite Score</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {vendors
                    .filter((v) =>
                      v.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      v.category.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((vendor) => (
                      <tr key={vendor._id} className="hover:bg-red-50/20 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900">{vendor.companyName}</td>
                        <td className="py-3.5 px-4 text-slate-600">{vendor.category}</td>
                        <td className="py-3.5 px-4">
                          <TierBadge tier={vendor.ratingTier || 'Approved'} />
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-red-600">
                          {vendor.overallRating ? vendor.overallRating.toFixed(1) : '5.0'} / 5.0
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleViewScorecard(vendor)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-bold text-xs border border-slate-200"
                            >
                              Scorecard
                            </button>
                            <button
                              onClick={() => handleStartEvaluate(vendor)}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded font-bold text-xs flex items-center space-x-1 shadow-xs"
                            >
                              <Star className="w-3 h-3" />
                              <span>Evaluate Vendor</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. SUBMITTING EVALUATION FORM VIEW */}
      {activeTab === 'new-evaluation' && evaluatingVendor && (
        <div className="max-w-2xl mx-auto">
          <EvaluatorForm
            vendor={evaluatingVendor}
            onComplete={() => {
              dispatch(fetchVendors());
              handleViewScorecard(evaluatingVendor);
            }}
          />
        </div>
      )}

      {/* 6. VIEWING VENDOR SCORECARD HISTORY VIEW */}
      {activeTab === 'view-scorecard' && viewingVendor && (
        <div>
          <VendorScorecardView
            vendor={selectedVendor || viewingVendor}
            evaluations={history}
          />
        </div>
      )}

      {/* Add Company Modal */}
      <AddCompanyModal
        isOpen={isAddCompanyOpen}
        onClose={() => setIsAddCompanyOpen(false)}
        onCompanyAdded={() => {
          dispatch(fetchVendors());
        }}
      />
    </div>
  );
};

export default BuyerPage;
