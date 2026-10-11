import React from 'react';
import { useSelector } from 'react-redux';
import { ShieldCheck, Users, Settings, UserCheck, AlertTriangle } from 'lucide-react';

const AdminPage = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center space-x-2 text-sky-400 mb-1">
          <ShieldCheck className="w-5 h-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">Administration</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Admin Governance Portal</h1>
        <p className="text-sm text-slate-400 mt-1">
          System administration, vendor verification approvals, and security audit logs.
        </p>
      </div>

      {/* Role Verification Banner */}
      <div className="p-4 bg-sky-950/40 border border-sky-800/60 rounded-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-sky-500/20 rounded-lg text-sky-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">
              Authenticated Session: {user?.name}
            </div>
            <div className="text-xs text-sky-300">
              Role: <span className="font-mono uppercase font-bold">{user?.role}</span> | Department: {user?.department || 'Procurement Governance'}
            </div>
          </div>
        </div>
        <span className="text-xs font-mono uppercase bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-1 rounded-full">
          RBAC: Admin Authorized
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 bg-slate-800/60 rounded-xl border border-slate-700/60">
          <h3 className="font-semibold text-white mb-1">Vendor Approvals</h3>
          <p className="text-xs text-slate-400">Review onboarding applications & tax ID compliance.</p>
        </div>
        <div className="p-5 bg-slate-800/60 rounded-xl border border-slate-700/60">
          <h3 className="font-semibold text-white mb-1">System Auditing</h3>
          <p className="text-xs text-slate-400">Immutable ledger tracking security and PO events.</p>
        </div>
        <div className="p-5 bg-slate-800/60 rounded-xl border border-slate-700/60">
          <h3 className="font-semibold text-white mb-1">Role Management</h3>
          <p className="text-xs text-slate-400">Configure buyer permissions & supplier access.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
