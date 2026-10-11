import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyVendorProfile, uploadKYCDocument } from '../store/slices/vendorSlice';
import { fetchVendorEvaluations } from '../store/slices/evaluationSlice';
import { fetchPurchaseOrders, fetchPODetails, updatePOStatus } from '../store/slices/purchaseOrderSlice';
import VendorStatusBanner from '../components/VendorStatusBanner';
import VendorOnboardingWizard from '../components/VendorOnboardingWizard';
import VendorScorecardView from '../components/VendorScorecardView';
import TierBadge from '../components/TierBadge';
import POStatusBadge from '../components/POStatusBadge';
import PODetailView from '../components/PODetailView';
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
  AlertCircle
} from 'lucide-react';

const VendorPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { currentProfile, loading } = useSelector((state) => state.vendor);
  const { history } = useSelector((state) => state.evaluation);
  const { orders, loading: poLoading } = useSelector((state) => state.po);

  // 'profile' | 'scorecard' | 'orders' | 'view-po'
  const [activeTab, setActiveTab] = useState('profile');
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
      <div className="border-b border-slate-800 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 mb-1">
            <Truck className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Supplier Workspace</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Vendor Profile & Orders</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your statutory profile, fulfill incoming purchase orders, and monitor performance evaluations.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {currentProfile && (
            activeTab === 'view-po' ? (
              <button
                onClick={() => setActiveTab('orders')}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Incoming POs</span>
              </button>
            ) : (
              <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
                    activeTab === 'profile' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Company Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
                    activeTab === 'orders' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Incoming POs ({orders.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('scorecard')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
                    activeTab === 'scorecard' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Scorecard</span>
                </button>
              </div>
            )
          )}

          <button
            onClick={() => { loadProfile(); dispatch(fetchPurchaseOrders()); }}
            disabled={loading || poLoading}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center space-x-2 border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${(loading || poLoading) ? 'animate-spin text-emerald-400' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Main Vendor Content */}
      {currentProfile ? (
        activeTab === 'scorecard' ? (
          // Tab: Vendor's Own Read-Only Scorecard View
          <VendorScorecardView
            vendor={currentProfile}
            evaluations={history}
          />
        ) : activeTab === 'orders' ? (
          // Tab: Incoming Purchase Orders View
          <div className="space-y-6">
            <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 overflow-hidden shadow-xl backdrop-blur">
              <div className="p-4 border-b border-slate-700/80 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">Incoming Purchase Orders</h3>
                  <p className="text-xs text-slate-400">
                    Acknowledge contract orders, confirm manufacturing fulfillment, and register invoices
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-900/60 border-b border-slate-700/60 text-slate-400 uppercase font-semibold">
                      <th className="py-3 px-4">PO Reference</th>
                      <th className="py-3 px-4">Subject / Scope</th>
                      <th className="py-3 px-4">Total Value</th>
                      <th className="py-3 px-4">Promised Delivery</th>
                      <th className="py-3 px-4">Lifecycle State</th>
                      <th className="py-3 px-4 text-right">Supplier Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50 text-slate-200">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400">
                          No purchase orders received yet. Once procurement officers issue orders to your company, they will appear here.
                        </td>
                      </tr>
                    ) : (
                      orders.map((po) => (
                        <tr key={po._id} className="hover:bg-slate-700/30 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                            {po.poNumber}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-white">{po.title}</div>
                            <div className="text-[11px] text-slate-400">{po.items?.length || 0} line item(s)</div>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-sky-400">
                            {po.totalAmount?.toLocaleString()} {po.currency}
                          </td>
                          <td className="py-3.5 px-4 text-slate-300">
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
                                    className="px-2.5 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded text-[11px] font-semibold flex items-center space-x-1"
                                    title="Acknowledge Order"
                                  >
                                    <CheckCheck className="w-3 h-3" />
                                    <span>Acknowledge</span>
                                  </button>
                                  <button
                                    onClick={() => handleDeclinePO(po)}
                                    disabled={poActionLoading === po._id}
                                    className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-[11px] font-semibold flex items-center space-x-1"
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
                                  className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded text-[11px] font-semibold flex items-center space-x-1"
                                  title="Submit Invoice"
                                >
                                  <Receipt className="w-3 h-3" />
                                  <span>Submit Invoice</span>
                                </button>
                              )}

                              {/* Inspect details & timeline stepper */}
                              <button
                                onClick={() => handleInspectPO(po)}
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
              <div className="md:col-span-2 bg-slate-800/80 rounded-2xl border border-slate-700/80 p-6 shadow-xl backdrop-blur space-y-4">
                <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">{currentProfile.companyName}</h3>
                      <p className="text-xs text-slate-400">{currentProfile.category} • {currentProfile.businessType}</p>
                    </div>
                  </div>
                  <TierBadge tier={currentProfile.ratingTier || 'Approved'} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 uppercase font-semibold">GSTIN / Tax ID:</span>
                    <div className="font-mono text-white font-medium mt-0.5">{currentProfile.taxId}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase font-semibold">PAN Reference:</span>
                    <div className="font-mono text-white font-medium mt-0.5">{currentProfile.panNumber || 'N/A'}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase font-semibold">Contact Email:</span>
                    <div className="text-white font-medium mt-0.5 truncate">{currentProfile.contactEmail}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase font-semibold">Phone Contact:</span>
                    <div className="text-white font-medium mt-0.5">{currentProfile.contactPhone}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase font-semibold">Registered City:</span>
                    <div className="text-white font-medium mt-0.5">{currentProfile.address?.city || 'N/A'}, {currentProfile.address?.state || ''}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase font-semibold">Bank Beneficiary:</span>
                    <div className="text-white font-medium mt-0.5">{currentProfile.bankDetails?.accountName || 'Configured'}</div>
                  </div>
                </div>
              </div>

              {/* Upload New Document Card */}
              <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-6 shadow-xl backdrop-blur flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-sky-400 mb-2">
                    <UploadCloud className="w-5 h-5" />
                    <h4 className="font-bold text-white text-sm">Upload KYC Document</h4>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">
                    Submit supplementary statutory records (PDF/PNG/JPEG) for compliance review.
                  </p>

                  <form onSubmit={handleUploadSingleDoc} className="space-y-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">Document Category</label>
                      <select
                        value={docType}
                        onChange={(e) => setDocType(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
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
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">Select File</label>
                      <input
                        type="file"
                        onChange={(e) => setFileToUpload(e.target.files[0])}
                        className="w-full text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-700 file:text-slate-200 hover:file:bg-slate-600"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!fileToUpload || uploadingDoc}
                      className="w-full mt-2 py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
                    >
                      <FileUp className="w-4 h-4" />
                      <span>{uploadingDoc ? 'Uploading...' : 'Submit Document'}</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Uploaded Documents List */}
            <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-6 shadow-xl backdrop-blur">
              <h4 className="font-bold text-white text-sm mb-4 flex items-center space-x-2">
                <FileText className="w-4 h-4 text-sky-400" />
                <span>Uploaded Statutory KYC Documents ({currentProfile.documents?.length || 0})</span>
              </h4>

              {currentProfile.documents && currentProfile.documents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {currentProfile.documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/60 flex flex-col justify-between space-y-2"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-white">{doc.documentType}</span>
                          {doc.verified ? (
                            <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded">
                              Verified
                            </span>
                          ) : (
                            <span className="text-[10px] bg-amber-950 text-amber-400 border border-amber-800 px-1.5 py-0.5 rounded">
                              Pending Audit
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate mt-1">{doc.fileName}</div>
                      </div>

                      <a
                        href={`http://localhost:5000${doc.documentUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center space-x-1 pt-1 border-t border-slate-800"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>View File</span>
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 border border-dashed border-slate-700 rounded-xl text-center text-xs text-slate-500">
                  No KYC documents uploaded yet. Upload GST or PAN cards to fast-track approval.
                </div>
              )}
            </div>
          </div>
        )
      ) : showWizard ? (
        // Multi-Step Onboarding Form
        <VendorOnboardingWizard onComplete={() => { setShowWizard(false); loadProfile(); }} />
      ) : (
        // Not onboarded yet -> Call to Action
        <div className="p-12 bg-slate-800/50 rounded-2xl border border-dashed border-slate-700 text-center max-w-2xl mx-auto space-y-4">
          <div className="w-14 h-14 bg-sky-500/10 text-sky-400 rounded-2xl flex items-center justify-center mx-auto border border-sky-500/20">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Start Vendor Onboarding</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Register your company details, submit tax identification numbers (GSTIN/PAN), and upload compliance certificates to become an authorized supplier.
            </p>
          </div>
          <button
            onClick={() => setShowWizard(true)}
            className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-sm font-semibold inline-flex items-center space-x-2 transition-colors shadow-lg shadow-sky-600/20"
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
