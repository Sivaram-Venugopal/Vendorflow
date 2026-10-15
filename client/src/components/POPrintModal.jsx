import React from 'react';
import { Printer, X, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { VendorFlowLogoIcon } from './VendorFlowLogo';
import CompanyLogo from './CompanyLogo';

export const POPrintModal = ({ isOpen, onClose, po }) => {
  if (!isOpen || !po) return null;

  const handlePrint = () => {
    window.print();
  };

  const vendorName = po.vendor?.companyName || 'Apex Industrial Supplies Pvt Ltd';
  const buyerName = po.buyer?.name || 'Enterprise Procurement Buyer';
  const buyerDept = po.buyer?.department || 'Direct Materials Sourcing';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col print:shadow-none print:border-none print:max-w-none print:max-h-none print:w-full print:rounded-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Controls (Hidden in Print) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between sticky top-0 z-10 print:hidden">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-300">Official Purchase Order Document View</span>
            <span className="text-[10px] font-mono bg-red-600 px-2 py-0.5 rounded text-white font-bold">
              {po.poNumber}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Formal Printable Purchase Order Sheet */}
        <div className="p-8 md:p-12 space-y-8 bg-white text-slate-900 print:p-6" id="printable-po-sheet">
          {/* Document Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-red-600 pb-6 gap-4">
            <div className="flex items-center space-x-3.5">
              <VendorFlowLogoIcon className="w-12 h-12" />
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900">
                  Vendor<span className="text-red-600">Flow</span>
                </h1>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                  Enterprise Global Procurement Division
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Corporate HQ: Tech Boulevard, Electronic City, Bengaluru - 560100
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block text-xs font-black uppercase px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
                Official Purchase Order
              </span>
              <div className="text-xl font-black text-slate-900 font-mono mt-1">
                {po.poNumber}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Issued Date: <strong className="text-slate-800">{new Date(po.createdAt || Date.now()).toLocaleDateString()}</strong>
              </div>
              <div className="text-xs text-slate-500">
                Delivery Deadline: <strong className="text-slate-800">{new Date(po.deliveryDate || Date.now()).toLocaleDateString()}</strong>
              </div>
              <div className="text-xs text-slate-500">
                Status: <strong className="text-red-600 uppercase">{po.status}</strong>
              </div>
            </div>
          </div>

          {/* Supplier & Billing Addresses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                Vendor / Supplier Details
              </div>
              <div className="flex items-center space-x-2 mb-1">
                <CompanyLogo name={vendorName} size="sm" />
                <span className="font-extrabold text-sm text-slate-900">{vendorName}</span>
              </div>
              <div className="text-xs text-slate-600 space-y-0.5">
                <p>Tax / GSTIN ID: <span className="font-mono font-bold text-slate-800">{po.vendor?.taxId || '29ABCDE1234F1Z5'}</span></p>
                <p>PAN: <span className="font-mono text-slate-800">{po.vendor?.panNumber || 'ABCDE1234F'}</span></p>
                <p>Email: {po.vendor?.contactEmail || 'commercials@vendorflow.org'}</p>
                <p>Address: {po.vendor?.address?.city || 'Bengaluru'}, {po.vendor?.address?.state || 'Karnataka'}</p>
              </div>
            </div>

            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                Ship-To & Procurement Buyer
              </div>
              <div className="font-extrabold text-sm text-slate-900 mb-1">
                VendorFlow Enterprise Operations
              </div>
              <div className="text-xs text-slate-600 space-y-0.5">
                <p>Purchasing Agent: <strong className="text-slate-800">{buyerName}</strong></p>
                <p>Department: <span className="text-slate-700">{buyerDept}</span></p>
                <p>Shipping Destination: Warehouse 4, Gate B</p>
                <p>
                  {po.shippingAddress?.street || 'Plot 14, Phase 3'}, {po.shippingAddress?.city || 'Bengaluru'} - {po.shippingAddress?.postalCode || '560100'}
                </p>
              </div>
            </div>
          </div>

          {/* Subject / Title */}
          <div className="border-l-4 border-red-600 pl-4 py-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Purchase Order Title / Scope</div>
            <div className="text-sm font-black text-slate-900">{po.title}</div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-y-2 border-slate-900 bg-slate-100/80 font-black uppercase tracking-wider text-[11px] text-slate-700">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">SKU / Item Code</th>
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3 text-right">Quantity</th>
                  <th className="py-2.5 px-3 text-right">Unit Price ({po.currency})</th>
                  <th className="py-2.5 px-3 text-right">Line Total ({po.currency})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {po.items?.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3 px-3 font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-700">{item.itemCode || `SKU-${idx + 1}`}</td>
                    <td className="py-3 px-3 font-medium text-slate-800">{item.description}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold">{item.quantity}</td>
                    <td className="py-3 px-3 text-right font-mono">{Number(item.unitPrice || 0).toLocaleString()}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                      {(Number(item.quantity || 0) * Number(item.unitPrice || 0)).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Calculation Summary */}
          <div className="flex justify-end">
            <div className="w-full sm:w-80 space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal (Net Amount):</span>
                <span className="font-mono font-bold">{po.subtotal?.toLocaleString()} {po.currency}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Integrated GST (18.00%):</span>
                <span className="font-mono font-bold">{po.taxAmount?.toLocaleString()} {po.currency}</span>
              </div>
              <div className="border-t border-slate-300 pt-2 flex justify-between text-sm font-black text-slate-900">
                <span>Total PO Obligation:</span>
                <span className="font-mono text-red-600">{po.totalAmount?.toLocaleString()} {po.currency}</span>
              </div>
            </div>
          </div>

          {/* Terms & Authorized Acceptance */}
          <div className="border-t border-slate-200 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-500">
            <div>
              <h5 className="font-black text-slate-800 uppercase tracking-wider text-[11px] mb-1">
                Standard Procurement Terms & Conditions:
              </h5>
              <ul className="list-disc pl-4 space-y-1 text-[11px]">
                <li>All deliveries must match the attached quality specifications and mill test certs.</li>
                <li>Invoice submission requires 3-way matching with this Purchase Order and Gate Delivery Receipt.</li>
                <li>Payment terms: Net 30 days post delivery verification.</li>
              </ul>
            </div>

            <div className="flex flex-col justify-end items-start sm:items-end">
              <div className="border-t-2 border-slate-400 pt-2 w-52 text-center">
                <div className="font-mono text-[10px] text-slate-400">Digitally Verified via RBAC</div>
                <div className="font-extrabold text-slate-800 text-xs mt-0.5">Authorized Enterprise Signatory</div>
                <div className="text-[10px] text-slate-500">VendorFlow Procurement Operations</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POPrintModal;
