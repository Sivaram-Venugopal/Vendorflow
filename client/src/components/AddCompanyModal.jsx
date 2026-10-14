import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerVendor, fetchVendors } from '../store/slices/vendorSlice';
import { 
  Building2, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Plus, 
  Mail, 
  Phone, 
  MapPin, 
  FileText 
} from 'lucide-react';

const AddCompanyModal = ({ isOpen, onClose, onCompanyAdded }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    companyName: '',
    legalEntityName: '',
    category: 'Industrial Equipment',
    businessType: 'Private Limited',
    taxId: '',
    panNumber: '',
    contactEmail: '',
    contactPhone: '',
    city: 'Bengaluru',
    state: 'Karnataka',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const generateQuickDummyTax = () => {
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    const pan = `ABCDE${Math.floor(1000 + Math.random() * 9000)}F`;
    const gst = `29${pan}1Z5`;
    setFormData((prev) => ({
      ...prev,
      panNumber: pan,
      taxId: gst,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.companyName.trim()) {
      setErrorMsg('Company Name is required');
      return;
    }
    if (!formData.taxId.trim() || !formData.panNumber.trim()) {
      setErrorMsg('Tax ID (GSTIN) and PAN are required');
      return;
    }
    if (!formData.contactEmail.trim() || !formData.contactPhone.trim()) {
      setErrorMsg('Contact email and phone number are required');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const payload = {
        companyName: formData.companyName,
        legalEntityName: formData.legalEntityName || formData.companyName,
        category: formData.category,
        businessType: formData.businessType,
        taxId: formData.taxId.toUpperCase(),
        panNumber: formData.panNumber.toUpperCase(),
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        address: {
          street: 'Industrial Area Phase 2',
          city: formData.city || 'Bengaluru',
          state: formData.state || 'Karnataka',
          country: 'India',
          postalCode: '560001',
        },
        status: 'Approved',
      };

      const result = await dispatch(registerVendor(payload)).unwrap();
      setSuccessMsg(`Company "${formData.companyName}" successfully registered & approved!`);
      dispatch(fetchVendors());
      if (onCompanyAdded) onCompanyAdded(result);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      setErrorMsg(typeof err === 'string' ? err : 'Failed to register supplier company');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-red-200 shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Red Accent Header */}
        <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-rose-500 to-red-700" />
        
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-red-50/40">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-600/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Onboard New Supplier Company</h3>
              <p className="text-xs text-slate-500">Add an authorized enterprise vendor to the directory</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Company / Supplier Trade Name *
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="e.g. Acme Precision Robotics Pvt Ltd"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white"
              >
                <option value="Raw Materials">Raw Materials</option>
                <option value="Industrial Equipment">Industrial Equipment</option>
                <option value="Electronics">Electronics & Hardware</option>
                <option value="Logistics">Logistics & Supply</option>
                <option value="Packaging">Packaging</option>
                <option value="Consulting">Consulting & Services</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Business Type
              </label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white"
              >
                <option value="Private Limited">Private Limited</option>
                <option value="Public Limited">Public Limited</option>
                <option value="Partnership">Partnership</option>
                <option value="LLP">LLP</option>
                <option value="Proprietorship">Proprietorship</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  PAN Number *
                </label>
                <button
                  type="button"
                  onClick={generateQuickDummyTax}
                  className="text-[10px] text-red-600 font-semibold hover:underline"
                >
                  Generate Tax IDs
                </button>
              </div>
              <input
                type="text"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleChange}
                placeholder="e.g. AABCA1234F"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 uppercase focus:outline-none focus:border-red-500 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                GSTIN / Tax ID *
              </label>
              <input
                type="text"
                name="taxId"
                value={formData.taxId}
                onChange={handleChange}
                placeholder="e.g. 29AABCA1234F1Z5"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 uppercase focus:outline-none focus:border-red-500 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Contact Email *
              </label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="orders@supplier.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Contact Phone *
              </label>
              <input
                type="text"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Bengaluru"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                State
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Karnataka"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md shadow-red-600/20 disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Onboarding Company...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Register & Approve Supplier</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCompanyModal;
