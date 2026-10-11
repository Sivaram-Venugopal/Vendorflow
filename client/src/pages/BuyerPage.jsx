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
import { 
  ShoppingBag, 
  Award, 
  FileText, 
  PlusCircle, 
  Search, 
  ArrowLeft,
  Calendar,
  Layers,
  Send,
  Eye,
  Star,
  RefreshCw,
  TrendingUp
} from 'lucide-react';

const BuyerPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { vendors } = useSelector((state) => state.vendor);
  const { history, selectedVendor } = useSelector((state) => state.evaluation);
  const { orders, loading: poLoading } = useSelector((state) => state.po);

  // Navigation tabs: 'pos' | 'new-po' | 'view-po' | 'evaluations' | 'new-evaluation' | 'view-scorecard'
  const [activeTab, setActiveTab] = useState('pos');
  const [selectedPO, setSelectedPO] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

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
      {/* Header Banner */}
      <div className="border-b border-slate-800 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 mb-1">
            <ShoppingBag className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Procurement Operations</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Buyer Procurement & Lifecycle</h1>
          <p className="text-sm text-slate-400 mt-1">
            Draft Purchase Orders, enforce FSM approvals, dispatch to vendors, and evaluate supplier scorecards.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Main Top Tab Switcher */}
          {(activeTab === 'pos' || activeTab === 'evaluations') && (
            <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setActiveTab('pos')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
                  activeTab === 'pos' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>My Purchase Orders ({orders.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('evaluations')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
                  activeTab === 'evaluations' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Supplier Evaluations</span>
              </button>
            </div>
          )}

          {/* Back Buttons for Sub-views */}
          {activeTab === 'new-po' && (
            <button
              onClick={() => setActiveTab('pos')}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Cancel Draft</span>
            </button>
          )}

          {activeTab === 'view-po' && (
            <button
              onClick={() => setActiveTab('pos')}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to My POs</span>
            </button>
          )}

          {(activeTab === 'new-evaluation' || activeTab === 'view-scorecard') && (
            <button
              onClick={() => setActiveTab('evaluations')}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Directory</span>
            </button>
          )}

          <button
            onClick={handleRefresh}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
            title="Refresh records"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 1. PURCHASE ORDERS LIST VIEW */}
      {activeTab === 'pos' && (
        <div className="space-y-6">
          {/* Action & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 shadow-lg backdrop-blur">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by PO#, title, vendor..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500"
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

            <button
              onClick={() => setActiveTab('new-po')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Draft New Purchase Order</span>
            </button>
          </div>

          {/* Orders Table */}
          <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 overflow-hidden shadow-xl backdrop-blur">
            <div className="p-4 border-b border-slate-700/80 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">Purchase Orders Directory</h3>
                <p className="text-xs text-slate-400">Total {filteredPOs.length} order(s) match criteria</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900/60 border-b border-slate-700/60 text-slate-400 uppercase font-semibold">
                    <th className="py-3 px-4">PO Reference</th>
                    <th className="py-3 px-4">Title / Scope</th>
                    <th className="py-3 px-4">Target Supplier</th>
                    <th className="py-3 px-4">Total Value</th>
                    <th className="py-3 px-4">Lifecycle State</th>
                    <th className="py-3 px-4">Created Date</th>
                    <th className="py-3 px-4 text-right">Workflow Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50 text-slate-200">
                  {filteredPOs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No purchase orders found. Create your first PO using "Draft New Purchase Order".
                      </td>
                    </tr>
                  ) : (
                    filteredPOs.map((order) => (
                      <tr key={order._id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">
                          {order.poNumber}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-white max-w-xs truncate">{order.title}</div>
                          <div className="text-[11px] text-slate-400">{order.items?.length || 0} line item(s)</div>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-200">
                          {order.vendor?.companyName || 'Unknown Vendor'}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                          {order.totalAmount?.toLocaleString()} {order.currency}
                        </td>
                        <td className="py-3.5 px-4">
                          <POStatusBadge status={order.status} />
                        </td>
                        <td className="py-3.5 px-4 text-slate-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            {/* Quick Submit draft for approval */}
                            {order.status === 'Draft' && (
                              <button
                                onClick={() => handleQuickSubmitDraft(order)}
                                className="px-2.5 py-1 bg-amber-600/80 hover:bg-amber-500 text-white rounded text-[11px] font-semibold flex items-center space-x-1"
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
                                className="px-2.5 py-1 bg-sky-600/80 hover:bg-sky-500 text-white rounded text-[11px] font-semibold flex items-center space-x-1"
                                title="Send Approved PO to Supplier"
                              >
                                <Send className="w-3 h-3" />
                                <span>Send</span>
                              </button>
                            )}

                            <button
                              onClick={() => handleOpenPODetails(order)}
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
          <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 overflow-hidden shadow-xl backdrop-blur">
            <div className="p-4 border-b border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-white text-base">Approved Supplier Directory</h3>
                <p className="text-xs text-slate-400">Audit supplier performance and issue weighted scorecard evaluations</p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter suppliers by name or category..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900/60 border-b border-slate-700/60 text-slate-400 uppercase font-semibold">
                    <th className="py-3 px-4">Supplier Company</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Current Rating Tier</th>
                    <th className="py-3 px-4">Composite Score</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50 text-slate-200">
                  {vendors
                    .filter((v) =>
                      v.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      v.category.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((vendor) => (
                      <tr key={vendor._id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-white">{vendor.companyName}</td>
                        <td className="py-3.5 px-4 text-slate-300">{vendor.category}</td>
                        <td className="py-3.5 px-4">
                          <TierBadge tier={vendor.ratingTier || 'Approved'} />
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">
                          {vendor.overallRating ? vendor.overallRating.toFixed(1) : 'Unrated'} / 5.0
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleViewScorecard(vendor)}
                              className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded font-semibold text-xs"
                            >
                              Scorecard
                            </button>
                            <button
                              onClick={() => handleStartEvaluate(vendor)}
                              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-semibold text-xs flex items-center space-x-1"
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
    </div>
  );
};

export default BuyerPage;
