import React from 'react';
import { useSelector } from 'react-redux';
import { Truck, UploadCloud, CheckCircle, UserCheck } from 'lucide-react';

const VendorPage = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center space-x-2 text-emerald-400 mb-1">
          <Truck className="w-5 h-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">Vendor Portal</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Vendor Fulfillment Workspace</h1>
        <p className="text-sm text-slate-400 mt-1">
          Supplier onboarding details, PO acknowledgments, and shipping milestones.
        </p>
      </div>

      {/* Role Verification Banner */}
      <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">
              Authenticated Supplier: {user?.name}
            </div>
            <div className="text-xs text-emerald-300">
              Role: <span className="font-mono uppercase font-bold">{user?.role}</span> | Department: {user?.department || 'Commercials'}
            </div>
          </div>
        </div>
        <span className="text-xs font-mono uppercase bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-1 rounded-full">
          RBAC: Vendor Authorized
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 bg-slate-800/60 rounded-xl border border-slate-700/60">
          <h3 className="font-semibold text-white mb-1">Company Onboarding</h3>
          <p className="text-xs text-slate-400">Manage tax IDs, business profile & banking details.</p>
        </div>
        <div className="p-5 bg-slate-800/60 rounded-xl border border-slate-700/60">
          <h3 className="font-semibold text-white mb-1">Fulfillment Orders</h3>
          <p className="text-xs text-slate-400">Acknowledge incoming POs and update delivery status.</p>
        </div>
        <div className="p-5 bg-slate-800/60 rounded-xl border border-slate-700/60">
          <h3 className="font-semibold text-white mb-1">Compliance Vault</h3>
          <p className="text-xs text-slate-400">Upload GST certificates, PAN cards and NDAs.</p>
        </div>
      </div>
    </div>
  );
};

export default VendorPage;
