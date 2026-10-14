import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyVendorProfile, uploadKYCDocument } from '../store/slices/vendorSlice';
import { fetchVendorEvaluations } from '../store/slices/evaluationSlice';
import { fetchPurchaseOrders, fetchPODetails, updatePOStatus } from '../store/slices/purchaseOrderSlice';
import VendorStatusBanner from '../components/VendorStatusBanner';
import VendorOnboardingWizard from '../components/VendorOnboardingWizard';
import VendorScorecardView from '../components/VendorScorecardView';
import VendorDashboardView from '../components/VendorDashboardView';
import TierBadge from '../components/TierBadge';
import POStatusBadge from '../components/POStatusBadge';
import PODetailView from '../components/PODetailView';
import { getAssetUrl } from '../api/axiosClient';
import { 
  Truck, 
  UploadCloud, 
  FileText, 
  Building2, 
  FileUp, 
  CheckCircle, 
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Plus,
  Award,
  Layers,
  ShoppingBag,
  CheckCheck,
  XCircle,
  Receipt,
  Eye,
  ArrowLeft,
  Calendar,
  AlertCircle,
  LayoutDashboard
} from 'lucide-react';

const VendorPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { currentProfile, loading } = useSelector((state) => state.vendor);
  const { history } = useSelector((state) => state.evaluation);
  const { orders, loading: poLoading } = useSelector((state) => state.po);

  // 'dashboard' | 'profile' | 'scorecard' | 'orders' | 'view-po'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [inspectingPO, setInspectingPO] = useState(null);
  const [showWizard, setShowWizard] = useState(false);
  const [docType, setDocType] = useState('GST_CERTIFICATE');
  const [fileToUpload, setFileToUpload] = useState(null);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [poActionLoading, setPoActionLoading] = useState(null);

  const loadProfile = async () => {
    const res = await dispatch(fetchMyVendorProfile()).unwrap();
    if (res && (res._id || res.id)) {
      dispatch(fetchVendorEvaluations(res._id || res.id));
      dispatch(fetchPurchaseOrders());
    }
  };

  useEffect(() => {
    loadProfile();
  }, [dispatch]);

  const handleUploadSingleDoc = async (e) => {
    e.preventDefault();
    if (!fileToUpload) return;
    setUploadingDoc(true);

    const formData = new FormData();
    formData.append('documentType', docType);
    formData.append('file', fileToUpload);

    await dispatch(uploadKYCDocument(formData));
    setFileToUpload(null);
    setUploadingDoc(false);
    loadProfile();
  };

  const handleAcknowledgePO = async (po) => {
    setPoActionLoading(po._id);
    await dispatch(updatePOStatus({
      poId: po._id,
      status: 'Acknowledged',
      remarks: 'Supplier acknowledged order delivery terms and commitments'
    }));
    setPoActionLoading(null);
    dispatch(fetchPurchaseOrders());
  };

  const handleDeclinePO = async (po) => {
    const reason = window.prompt('Specify reason for declining this purchase order:');
    if (reason === null) return;
    setPoActionLoading(po._id);
    await dispatch(updatePOStatus({
      poId: po._id,
      status: 'Declined',
      remarks: reason || 'Supplier unable to meet delivery requirements'
    }));
    setPoActionLoading(null);
    dispatch(fetchPurchaseOrders());
  };

  const handleInvoicePO = async (po) => {
    setPoActionLoading(po._id);
    await dispatch(updatePOStatus({
      poId: po._id,
      status: 'Invoiced',
      remarks: 'Invoice generated and submitted for payment clearance'
    }));
    setPoActionLoading(null);
    dispatch(fetchPurchaseOrders());
  };

  const handleInspectPO = async (po) => {
    setInspectingPO(po);
    await dispatch(fetchPODetails(po._id));
    setActiveTab('view-po');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-600 mb-1">
            <Truck className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Supplier Workspace</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Vendor Profile & Orders</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your statutory profile, fulfill incoming purchase orders, and monitor performance evaluations.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {activeTab === 'view-po' ? (
            <button
              onClick={() => setActiveTab('orders')}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Incoming POs</span>
            </button>
          ) : (
            <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  activeTab === 'dashboard' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>
              {currentProfile && (
                <>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                      activeTab === 'profile' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Company Profile</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                      activeTab === 'orders' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Incoming POs ({orders.length})</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('scorecard')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                      activeTab === 'scorecard' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Scorecard</span>
                  </button>
                </>
              )}
            </div>
          )}

          <button
            onClick={() => { loadProfile(); dispatch(fetchPurchaseOrders()); }}
            disabled={loading || poLoading}
            className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold flex items-center space-x-2 border border-slate-200 transition-colors shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${(loading || poLoading) ? 'animate-spin text-emerald-600' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Main Vendor Content */}
      {showWizard ? (
        // Multi-Step Onboarding Form
        <VendorOnboardingWizard onComplete={() => { setShowWizard(false); loadProfile(); }} />
      ) : activeTab === 'dashboard' ? (
        <VendorDashboardView
          onNavigateTab={(tab) => setActiveTab(tab)}
          onStartOnboarding={() => setShowWizard(true)}
        />
      ) : currentProfile ? (
        activeTab === 'scorecard' ? (
          // Tab: Vendor's Own Read-Only Scorecard View
          <VendorScorecardView
            vendor={currentProfile}
            evaluations={history}
          />
        ) : activeTab === 'orders' ? (
          // Tab: Incoming Purchase Orders View
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Incoming Purchase Orders</h3>
                  <p className="text-xs text-slate-500">
                    Acknowledge contract orders, confirm manufacturing fulfillment, and register invoices
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase font-bold text-[11px] tracking-wider">
                      <th className="py-3 px-4">PO Reference</th>
                      <th className="py-3 px-4">Subject / Scope</th>
                      <th className="py-3 px-4">Total Value</th>
                      <th className="py-3 px-4">Promised Delivery</th>
                      <th className="py-3 px-4">Lifecycle State</th>
                      <th className="py-3 px-4 text-right">Supplier Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400">
                          No purchase orders received yet. Once procurement officers issue orders to your company, they will appear here.
                        </td>
                      </tr>
                    ) : (
                      orders.map((po) => (
                        <tr key={po._id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">
                            {po.poNumber}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">{po.title}</div>
                            <div className="text-[11px] text-slate-500">{po.items?.length || 0} line item(s)</div>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                            {po.totalAmount?.toLocaleString()} {po.currency}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">
                            {po.expectedDeliveryDate ? new Date(po.expectedDeliveryDate).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="py-3.5 px-4">
                            <POStatusBadge status={po.status} />
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end space-x-1.5">
                              {/* Sent -> Acknowledge or Decline */}
                              {po.status === 'Sent' && (
                                <>
                                  <button
                                    onClick={() => handleAcknowledgePO(po)}
                                    disabled={poActionLoading === po._id}
                                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold flex items-center space-x-1 shadow-xs transition-colors"
                                    title="Acknowledge Order"
                                  >
                                    <CheckCheck className="w-3 h-3" />
                                    <span>Acknowledge</span>
                                  </button>
                                  <button
                                    onClick={() => handleDeclinePO(po)}
                                    disabled={poActionLoading === po._id}
                                    className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[11px] font-bold flex items-center space-x-1 shadow-xs transition-colors"
                                    title="Decline Order"
                                  >
                                    <XCircle className="w-3 h-3" />
                                    <span>Decline</span>
                                  </button>
                                </>
                              )}

                              {/* Delivered -> Register Invoice */}
                              {po.status === 'Delivered' && (
                                <button
                                  onClick={() => handleInvoicePO(po)}
                                  disabled={poActionLoading === po._id}
                                  className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-bold flex items-center space-x-1 shadow-xs transition-colors"
                                  title="Submit Invoice"
                                >
                                  <Receipt className="w-3 h-3" />
                                  <span>Submit Invoice</span>
                                </button>
                              )}

                              {/* Inspect details & timeline stepper */}
                              <button
                                onClick={() => handleInspectPO(po)}
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
        ) : activeTab === 'view-po' && inspectingPO ? (
          // Tab: Detailed PO View with Stepper
          <PODetailView
            po={inspectingPO}
            onBack={() => setActiveTab('orders')}
            onStatusUpdated={() => {
              dispatch(fetchPurchaseOrders());
            }}
          />
        ) : (
          // Tab 1: Profile & KYC Management View
          <div className="space-y-6">
            {/* Live Status Tracker Banner */}
            <VendorStatusBanner
              status={currentProfile.status}
              reason={currentProfile.statusReason}
              updatedAt={currentProfile.statusUpdatedAt}
              complianceScore={currentProfile.complianceScore}
            />

            {/* Profile Overview Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base">{currentProfile.companyName}</h3>
                      <p className="text-xs text-slate-500">{currentProfile.category} • {currentProfile.businessType}</p>
                    </div>
                  </div>
                  <TierBadge tier={currentProfile.ratingTier || 'Approved'} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 uppercase font-bold text-[10px]">GSTIN / Tax ID:</span>
                    <div className="font-mono text-slate-900 font-bold mt-0.5">{currentProfile.taxId}</div>
                  </div>
                  <div>
                    <span className="text-slate-500 uppercase font-bold text-[10px]">PAN Reference:</span>
                    <div className="font-mono text-slate-900 font-bold mt-0.5">{currentProfile.panNumber || 'N/A'}</div>
                  </div>
                  <div>
                    <span className="text-slate-500 uppercase font-bold text-[10px]">Contact Email:</span>
                    <div className="text-slate-800 font-medium mt-0.5 truncate">{currentProfile.contactEmail}</div>
                  </div>
                  <div>
                    <span className="text-slate-500 uppercase font-bold text-[10px]">Phone Contact:</span>
                    <div className="text-slate-800 font-medium mt-0.5">{currentProfile.contactPhone}</div>
                  </div>
                  <div>
                    <span className="text-slate-500 uppercase font-bold text-[10px]">Registered City:</span>
                    <div className="text-slate-800 font-medium mt-0.5">{currentProfile.address?.city || 'N/A'}, {currentProfile.address?.state || ''}</div>
                  </div>
                  <div>
                    <span className="text-slate-500 uppercase font-bold text-[10px]">Bank Beneficiary:</span>
                    <div className="text-slate-800 font-medium mt-0.5">{currentProfile.bankDetails?.accountName || 'Configured'}</div>
                  </div>
                </div>
              </div>

              {/* Upload New Document Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-indigo-600 mb-2">
                    <UploadCloud className="w-5 h-5" />
                    <h4 className="font-extrabold text-slate-900 text-sm">Upload KYC Document</h4>
                  </div>
                  <p className="text-xs text-slate-500 mb-4">
                    Submit supplementary statutory records (PDF/PNG/JPEG) for compliance review.
                  </p>

                  <form onSubmit={handleUploadSingleDoc} className="space-y-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Document Category</label>
                      <select
                        value={docType}
                        onChange={(e) => setDocType(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                      >
                        <option value="GST_CERTIFICATE">GST Certificate</option>
                        <option value="PAN_CARD">PAN Card</option>
                        <option value="CANCELLED_CHEQUE">Cancelled Cheque</option>
                        <option value="MSME_CERTIFICATE">MSME / Udyam Certificate</option>
                        <option value="ISO_CERTIFICATE">ISO Compliance Cert</option>
                        <option value="OTHER">Other Compliance Document</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Select File</label>
                      <input
                        type="file"
                        onChange={(e) => setFileToUpload(e.target.files[0])}
                        className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!fileToUpload || uploadingDoc}
                      className="w-full mt-2 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs transition-colors"
                    >
                      <FileUp className="w-4 h-4" />
                      <span>{uploadingDoc ? 'Uploading...' : 'Submit Document'}</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Uploaded Documents List */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h4 className="font-extrabold text-slate-900 text-sm mb-4 flex items-center space-x-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Uploaded Statutory KYC Documents ({currentProfile.documents?.length || 0})</span>
              </h4>

              {currentProfile.documents && currentProfile.documents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {currentProfile.documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between space-y-2"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">{doc.documentType}</span>
                          {doc.verified ? (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                              Verified
                            </span>
                          ) : (
                            <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-bold">
                              Pending Audit
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate mt-1">{doc.fileName}</div>
                      </div>

                      <a
                        href={getAssetUrl(doc.documentUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center space-x-1 pt-1 border-t border-slate-200"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>View File</span>
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-400">
                  No KYC documents uploaded yet. Upload GST or PAN cards to fast-track approval.
                </div>
              )}
            </div>
          </div>
        )
      ) : (
        // Not onboarded yet -> Call to Action
        <div className="p-12 bg-white rounded-2xl border border-dashed border-slate-300 text-center max-w-2xl mx-auto space-y-4 shadow-sm">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto border border-indigo-100">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">Start Vendor Onboarding</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Register your company details, submit tax identification numbers (GSTIN/PAN), and upload compliance certificates to become an authorized supplier.
            </p>
          </div>
          <button
            onClick={() => setShowWizard(true)}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold inline-flex items-center space-x-2 transition-colors shadow-md shadow-emerald-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Launch Onboarding Wizard</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default VendorPage;
