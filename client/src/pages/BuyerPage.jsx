import React from 'react';
import { useSelector } from 'react-redux';
import { ShoppingBag, FileText, PlusCircle, UserCheck } from 'lucide-react';

const BuyerPage = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center space-x-2 text-indigo-400 mb-1">
          <ShoppingBag className="w-5 h-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">Procurement Operations</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Buyer Procurement Workspace</h1>
        <p className="text-sm text-slate-400 mt-1">
          Purchase order drafting, item requisitions, and vendor evaluations.
        </p>
      </div>

      {/* Role Verification Banner */}
      <div className="p-4 bg-indigo-950/40 border border-indigo-800/60 rounded-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">
              Authenticated Buyer: {user?.name}
            </div>
            <div className="text-xs text-indigo-300">
              Role: <span className="font-mono uppercase font-bold">{user?.role}</span> | Department: {user?.department || 'Procurement'}
            </div>
          </div>
        </div>
        <span className="text-xs font-mono uppercase bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-1 rounded-full">
          RBAC: Buyer Authorized
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 bg-slate-800/60 rounded-xl border border-slate-700/60">
          <h3 className="font-semibold text-white mb-1">Create Purchase Order</h3>
          <p className="text-xs text-slate-400">Draft POs, add line items & calculate taxes.</p>
        </div>
        <div className="p-5 bg-slate-800/60 rounded-xl border border-slate-700/60">
          <h3 className="font-semibold text-white mb-1">Vendor Scorecards</h3>
          <p className="text-xs text-slate-400">Score suppliers on quality, delivery & pricing.</p>
        </div>
        <div className="p-5 bg-slate-800/60 rounded-xl border border-slate-700/60">
          <h3 className="font-semibold text-white mb-1">Requisition Catalog</h3>
          <p className="text-xs text-slate-400">Browse item masters and contracted rates.</p>
        </div>
      </div>
    </div>
  );
};

export default BuyerPage;
