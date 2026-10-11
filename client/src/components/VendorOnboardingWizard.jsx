import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerVendor, uploadKYCDocument } from '../store/slices/vendorSlice';
import { 
  Building2, 
  CreditCard, 
  FileUp, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  UploadCloud, 
  FileText, 
  Trash2, 
  AlertCircle,
  Loader2
} from 'lucide-react';

const VendorOnboardingWizard = ({ onComplete }) => {
  const dispatch = useDispatch();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Step 1: Company Profile Form State
  const [companyData, setCompanyData] = useState({
    companyName: '',
    legalEntityName: '',
    businessType: 'Private Limited',
    category: 'Hardware',
    taxId: '',
    panNumber: '',
    contactEmail: '',
    contactPhone: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
    },
    bankDetails: {
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      branchName: '',
    },
  });

  // Step 2: Upload Documents State
  const [documentsList, setDocumentsList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedDocType, setSelectedDocType] = useState('GST_CERTIFICATE');

  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setCompanyData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setCompanyData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateStep1 = () => {
    if (!companyData.companyName.trim()) return 'Company name is required';
    if (!companyData.taxId.trim()) return 'GSTIN / Tax ID is required';
    if (!companyData.panNumber.trim()) return 'PAN number is required';
    if (!companyData.contactEmail.trim()) return 'Contact email is required';
    if (!companyData.contactPhone.trim()) return 'Contact phone is required';
    if (!companyData.address.city.trim()) return 'City is required';
    if (!companyData.address.postalCode.trim()) return 'Postal code is required';
    return null;
  };

  const handleNextStep1 = () => {
    const err = validateStep1();
    if (err) {
      setErrorMsg(err);
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

  const handleAddFile = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg('Please select a file to add');
      return;
    }
    setDocumentsList((prev) => [
      ...prev,
      {
        file: selectedFile,
        documentType: selectedDocType,
        fileName: selectedFile.name,
      },
    ]);
    setSelectedFile(null);
    setErrorMsg('');
  };

  const handleRemoveDoc = (index) => {
    setDocumentsList((prev) => prev.filter((_, i) => i !== index));
  };

  // Step 3: Final Submission
  const handleSubmitOnboarding = async () => {
    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Submit Vendor Profile
      const resultAction = await dispatch(registerVendor(companyData));
      if (registerVendor.rejected.match(resultAction)) {
        throw new Error(resultAction.payload || 'Failed to submit profile');
      }

      // 2. Upload any staged documents
      for (const item of documentsList) {
        const formData = new FormData();
        formData.append('documentType', item.documentType);
        formData.append('file', item.file);
        await dispatch(uploadKYCDocument(formData));
      }

      if (onComplete) onComplete();
    } catch (err) {
      setErrorMsg(err.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 shadow-2xl p-6 md:p-8 backdrop-blur">
      {/* Wizard Step Indicator */}
      <div className="flex items-center justify-between max-w-xl mx-auto mb-8 border-b border-slate-700 pb-5">
        <div className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
            step >= 1 ? 'bg-sky-600 text-white' : 'bg-slate-700 text-slate-400'
          }`}>
            1
          </div>
          <span className={`text-xs font-semibold ${step >= 1 ? 'text-white' : 'text-slate-400'}`}>
            Company Profile
          </span>
        </div>

        <div className={`h-0.5 w-12 ${step >= 2 ? 'bg-sky-600' : 'bg-slate-700'}`}></div>

        <div className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
            step >= 2 ? 'bg-sky-600 text-white' : 'bg-slate-700 text-slate-400'
          }`}>
            2
          </div>
          <span className={`text-xs font-semibold ${step >= 2 ? 'text-white' : 'text-slate-400'}`}>
            KYC Documents
          </span>
        </div>

        <div className={`h-0.5 w-12 ${step >= 3 ? 'bg-sky-600' : 'bg-slate-700'}`}></div>

        <div className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
            step >= 3 ? 'bg-sky-600 text-white' : 'bg-slate-700 text-slate-400'
          }`}>
            3
          </div>
          <span className={`text-xs font-semibold ${step >= 3 ? 'text-white' : 'text-slate-400'}`}>
            Review & Submit
          </span>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center space-x-2 text-rose-400 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: Company Profile Form */}
      {step === 1 && (
        <div className="space-y-5">
          <div className="border-b border-slate-700/60 pb-3">
            <h3 className="text-lg font-bold text-white">Step 1: Company & Tax Identification</h3>
            <p className="text-xs text-slate-400">Provide legal entity details for enterprise compliance review.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Company Trading Name *</label>
              <input
                type="text"
                name="companyName"
                value={companyData.companyName}
                onChange={handleCompanyChange}
                placeholder="e.g. Acme Tech Solutions Pvt Ltd"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Legal Registered Name</label>
              <input
                type="text"
                name="legalEntityName"
                value={companyData.legalEntityName}
                onChange={handleCompanyChange}
                placeholder="Official statutory registered title"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Industry Category *</label>
              <select
                name="category"
                value={companyData.category}
                onChange={handleCompanyChange}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-sky-500"
              >
                <option value="Hardware">Hardware & Networking</option>
                <option value="Software">Software & Cloud Services</option>
                <option value="Raw Materials">Raw Materials & Fabrication</option>
                <option value="Logistics">Logistics & Supply Chain</option>
                <option value="Services">Consulting & Facility Services</option>
                <option value="Office Supplies">Office Supplies & Stationery</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Constitution Type</label>
              <select
                name="businessType"
                value={companyData.businessType}
                onChange={handleCompanyChange}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-sky-500"
              >
                <option value="Private Limited">Private Limited</option>
                <option value="Partnership">Partnership</option>
                <option value="LLP">LLP</option>
                <option value="Public Limited">Public Limited</option>
                <option value="Sole Proprietorship">Sole Proprietorship</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">GSTIN / Tax ID *</label>
              <input
                type="text"
                name="taxId"
                value={companyData.taxId}
                onChange={handleCompanyChange}
                placeholder="29ABCDE1234F1Z5"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 uppercase focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">PAN Number *</label>
              <input
                type="text"
                name="panNumber"
                value={companyData.panNumber}
                onChange={handleCompanyChange}
                placeholder="ABCDE1234F"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 uppercase focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Contact Email *</label>
              <input
                type="email"
                name="contactEmail"
                value={companyData.contactEmail}
                onChange={handleCompanyChange}
                placeholder="procurement@company.com"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Contact Phone *</label>
              <input
                type="text"
                name="contactPhone"
                value={companyData.contactPhone}
                onChange={handleCompanyChange}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <h4 className="text-xs font-semibold text-slate-300 uppercase mb-2">Registered Address</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                name="address.city"
                value={companyData.address.city}
                onChange={handleCompanyChange}
                placeholder="City *"
                className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200"
              />
              <input
                type="text"
                name="address.state"
                value={companyData.address.state}
                onChange={handleCompanyChange}
                placeholder="State"
                className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200"
              />
              <input
                type="text"
                name="address.postalCode"
                value={companyData.address.postalCode}
                onChange={handleCompanyChange}
                placeholder="Postal Code *"
                className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleNextStep1}
              className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-sm font-semibold flex items-center space-x-2 transition-colors"
            >
              <span>Continue to Documents</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Document Upload */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="border-b border-slate-700/60 pb-3">
            <h3 className="text-lg font-bold text-white">Step 2: Compliance & KYC Documents</h3>
            <p className="text-xs text-slate-400">
              Upload PDF or image certificates (GST certificate, PAN card, MSME) to accelerate verification.
            </p>
          </div>

          <div className="p-5 bg-slate-900/60 rounded-xl border border-slate-700">
            <h4 className="text-xs font-semibold text-slate-300 uppercase mb-3">Add Certificate</h4>
            <div className="flex flex-col md:flex-row gap-3 items-center">
              <select
                value={selectedDocType}
                onChange={(e) => setSelectedDocType(e.target.value)}
                className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200"
              >
                <option value="GST_CERTIFICATE">GST Registration Certificate</option>
                <option value="PAN_CARD">Company PAN Card</option>
                <option value="MSME_CERTIFICATE">MSME / Udyam Certificate</option>
                <option value="BANK_STATEMENT">Cancelled Cheque / Bank Statement</option>
                <option value="NDA">Non-Disclosure Agreement</option>
              </select>

              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-sky-600 file:text-white hover:file:bg-sky-500 cursor-pointer"
              />

              <button
                type="button"
                onClick={handleAddFile}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 ml-auto"
              >
                <FileUp className="w-3.5 h-3.5" />
                <span>Stage Document</span>
              </button>
            </div>
          </div>

          {/* Staged Documents List */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Staged Documents ({documentsList.length})
            </h4>
            {documentsList.length === 0 ? (
              <div className="p-6 border border-dashed border-slate-700 rounded-xl text-center text-xs text-slate-500">
                No documents staged yet. You may upload GST/PAN now or after registration.
              </div>
            ) : (
              <div className="space-y-2">
                {documentsList.map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-900/80 rounded-lg border border-slate-700/60 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="w-4 h-4 text-sky-400" />
                      <div>
                        <div className="text-xs font-semibold text-white">{doc.documentType}</div>
                        <div className="text-[11px] text-slate-400">{doc.fileName}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDoc(idx)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-semibold flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-sm font-semibold flex items-center space-x-2"
            >
              <span>Review Submission</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Review and Final Submit */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="border-b border-slate-700/60 pb-3">
            <h3 className="text-lg font-bold text-white">Step 3: Review & Submit Application</h3>
            <p className="text-xs text-slate-400">
              Confirm details before transmitting to the procurement governance desk.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-slate-900/60 p-4 rounded-xl border border-slate-700/70">
            <div>
              <span className="text-slate-400 uppercase font-semibold">Company:</span>
              <div className="text-white font-medium text-sm mt-0.5">{companyData.companyName}</div>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-semibold">Category:</span>
              <div className="text-white font-medium text-sm mt-0.5">{companyData.category}</div>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-semibold">GSTIN / Tax ID:</span>
              <div className="text-white font-mono mt-0.5">{companyData.taxId}</div>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-semibold">PAN Number:</span>
              <div className="text-white font-mono mt-0.5">{companyData.panNumber}</div>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-semibold">Contact Email:</span>
              <div className="text-white mt-0.5">{companyData.contactEmail}</div>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-semibold">Location:</span>
              <div className="text-white mt-0.5">{companyData.address.city}, {companyData.address.state}</div>
            </div>
          </div>

          <div className="p-4 bg-sky-950/30 rounded-xl border border-sky-800/40 text-xs text-sky-300">
            Staged Documents for Upload: <span className="font-bold">{documentsList.length}</span> compliance files.
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(2)}
              disabled={loading}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-semibold flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={handleSubmitOnboarding}
              disabled={loading}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold flex items-center space-x-2 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Onboarding Profile...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Submit for Admin Approval</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorOnboardingWizard;
