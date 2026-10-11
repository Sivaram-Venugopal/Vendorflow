import React from 'react';
import { ShoppingBag, FileText, PlusCircle } from 'lucide-react';

const BuyerPage = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center space-x-2 text-indigo-400 mb-1">
          <ShoppingBag className="w-5 h-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">Procurement Operations</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Buyer Workspace</h1>
        <p className="text-sm text-slate-400 mt-1">
          Purchase order drafting, catalog lookups, and vendor assessment metrics.
        </p>
      </div>

      <div className="p-8 bg-slate-800/40 rounded-xl border border-dashed border-slate-700 text-center">
        <FileText className="w-10 h-10 text-slate-500 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-200">Purchase Order Management</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
          PO lifecycle workflows, RFQs, and automated fulfillment tracking ready for implementation.
        </p>
      </div>
    </div>
  );
};

export default BuyerPage;
