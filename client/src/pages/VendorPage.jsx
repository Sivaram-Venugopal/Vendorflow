import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyVendorProfile, uploadKYCDocument } from '../store/slices/vendorSlice';
import VendorStatusBanner from '../components/VendorStatusBanner';
import VendorOnboardingWizard from '../components/VendorOnboardingWizard';
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
  Plus
} from 'lucide-react';

const VendorPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { currentProfile, loading } = useSelector((state) => state.vendor);

  const [showWizard, setShowWizard] = useState(false);
  const [docType, setDocType] = useState('GST_CERTIFICATE');
  const [fileToUpload, setFileToUpload] = useState(null);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  const loadProfile = () => {
    dispatch(fetchMyVendorProfile());
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 mb-1">
            <Truck className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Supplier Workspace</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Vendor Profile & Compliance</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your statutory profile, upload compliance documents, and monitor approval status.
          </p>
        </div>

        <button
          onClick={loadProfile}
          disabled={loading}
          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center space-x-2 border border-slate-700 self-start md:self-auto transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
          <span>Refresh Status</span>
        </button>
      </div>

      {/* If Vendor already registered -> show live status tracker banner */}
      {currentProfile ? (
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
                <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-900 border border-slate-700 text-slate-300 uppercase">
                  {currentProfile.status}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 uppercase font-semibold">GSTIN / Tax ID:</span>
                  <div className="font-mono text-white font-medium mt-0.5">{currentProfile.taxId}</div>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-semibold">PAN Number:</span>
                  <div className="font-mono text-white font-medium mt-0.5">{currentProfile.panNumber}</div>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-semibold">Contact Email:</span>
                  <div className="text-white font-medium mt-0.5">{currentProfile.contactEmail}</div>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-semibold">Phone:</span>
                  <div className="text-white font-medium mt-0.5">{currentProfile.contactPhone}</div>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-semibold">Registered City:</span>
                  <div className="text-white font-medium mt-0.5">{currentProfile.address?.city}, {currentProfile.address?.state}</div>
                </div>
                <div>
                  <span className="text-slate-400 uppercase font-semibold">Bank Name:</span>
                  <div className="text-white font-medium mt-0.5">{currentProfile.bankDetails?.bankName || 'Not Set'}</div>
                </div>
              </div>
            </div>

            {/* Quick Upload More Documents */}
            <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-6 shadow-xl backdrop-blur flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-white text-sm mb-1">Add Compliance Document</h3>
                <p className="text-xs text-slate-400 mb-4">Attach updated certificates or insurance papers.</p>

                <form onSubmit={handleUploadSingleDoc} className="space-y-3">
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200"
                  >
                    <option value="GST_CERTIFICATE">GST Certificate</option>
                    <option value="PAN_CARD">PAN Card</option>
                    <option value="MSME_CERTIFICATE">MSME Certificate</option>
                    <option value="BANK_STATEMENT">Bank Statement</option>
                    <option value="NDA">Signed NDA</option>
                  </select>

                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={(e) => setFileToUpload(e.target.files[0])}
                    className="text-xs text-slate-400 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:bg-sky-600 file:text-white cursor-pointer w-full"
                  />

                  <button
                    type="submit"
                    disabled={!fileToUpload || uploadingDoc}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-1 transition-colors"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>{uploadingDoc ? 'Uploading...' : 'Upload Document'}</span>
                  </button>
                </form>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-700/60 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Verified Files:</span>
                <span className="font-bold text-emerald-400">
                  {currentProfile.documents?.filter((d) => d.verified).length || 0} / {currentProfile.documents?.length || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Attached KYC Documents List */}
          <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-6 shadow-xl backdrop-blur">
            <h3 className="font-bold text-white text-base mb-4 flex items-center space-x-2">
              <FileText className="w-4 h-4 text-sky-400" />
              <span>Attached Compliance Certificates ({currentProfile.documents?.length || 0})</span>
            </h3>

            {currentProfile.documents && currentProfile.documents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {currentProfile.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-700 flex flex-col justify-between space-y-2"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{doc.documentType}</span>
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
