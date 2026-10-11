import React from 'react';
import { ShieldCheck, Users, Settings } from 'lucide-react';

const AdminPage = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center space-x-2 text-sky-400 mb-1">
          <ShieldCheck className="w-5 h-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">Administration</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Admin Portal</h1>
        <p className="text-sm text-slate-400 mt-1">
          Vendor governance, approvals, and system-wide configurations.
        </p>
      </div>

      <div className="p-8 bg-slate-800/40 rounded-xl border border-dashed border-slate-700 text-center">
        <Users className="w-10 h-10 text-slate-500 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-200">Admin Modules Ready for Setup</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
          Vendor approvals, scorecards, and audit logs will be wired here in upcoming phases.
        </p>
      </div>
    </div>
  );
};

export default AdminPage;
