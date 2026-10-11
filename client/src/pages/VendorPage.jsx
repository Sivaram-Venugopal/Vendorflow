import React from 'react';
import { Truck, UploadCloud, CheckCircle } from 'lucide-react';

const VendorPage = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center space-x-2 text-emerald-400 mb-1">
          <Truck className="w-5 h-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">Vendor Portal</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Vendor Workspace</h1>
        <p className="text-sm text-slate-400 mt-1">
          Vendor profile registration, compliance document uploads, and PO acknowledgments.
        </p>
      </div>

      <div className="p-8 bg-slate-800/40 rounded-xl border border-dashed border-slate-700 text-center">
        <UploadCloud className="w-10 h-10 text-slate-500 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-200">Vendor Onboarding & Documents</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
          Self-serve vendor onboarding, GST/tax profile details, and certificate uploads.
        </p>
      </div>
    </div>
  );
};

export default VendorPage;
