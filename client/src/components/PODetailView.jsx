import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePOStatus, setPOStatusOptimistic } from '../store/slices/purchaseOrderSlice';
import POStatusBadge from './POStatusBadge';
import POTimelineStepper from './POTimelineStepper';
import { 
  Building2, 
  ShoppingBag, 
  Calendar, 
  MapPin, 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Send, 
  CheckCheck, 
  Truck, 
  Receipt, 
  Archive, 
  FileText,
  Loader2,
  AlertCircle
} from 'lucide-react';

const PODetailView = ({ po: initialPO, onBack, onStatusUpdated }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { currentPO } = useSelector((state) => state.po);

  const po = (currentPO && currentPO._id === initialPO?._id) ? currentPO : initialPO;

  const [remarks, setRemarks] = useState('');
  const [updating, setUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!po) return null;

  const handleTransition = async (targetStatus) => {
    setUpdating(true);
    setErrorMsg('');

    // 1. Optimistic UI update
    dispatch(
      setPOStatusOptimistic({
        poId: po._id,
        status: targetStatus,
        remarks,
        actorName: user?.name,
        actorRole: user?.role,
      })
    );

    try {
      await dispatch(
        updatePOStatus({
          poId: po._id,
          status: targetStatus,
          remarks,
        })
      ).unwrap();

      setRemarks('');
      if (onStatusUpdated) onStatusUpdated();
    } catch (err) {
      setErrorMsg(typeof err === 'string' ? err : 'State transition failed');
    } finally {
      setUpdating(false);
    }
  };

  const isBuyerOrAdmin = user?.role === 'Buyer' || user?.role === 'Admin';
  const isAdmin = user?.role === 'Admin';
  const isVendor = user?.role === 'Vendor';

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-6 bg-slate-800/80 rounded-2xl border border-slate-700/80 shadow-xl backdrop-blur flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button
            onClick={onBack}
            className="text-xs text-slate-400 hover:text-white flex items-center space-x-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Orders List</span>
          </button>
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-bold text-white font-mono">{po.poNumber}</h2>
            <POStatusBadge status={po.status} />
          </div>
          <p className="text-sm text-slate-300 mt-1 font-medium">{po.title}</p>
        </div>

        {/* Total Cost Card */}
        <div className="text-right bg-slate-900/60 p-4 rounded-xl border border-slate-700/60">
          <div className="text-[10px] uppercase font-semibold text-slate-400">Total Purchase Value</div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {po.totalAmount?.toLocaleString()} {po.currency}
          </div>
          <div className="text-[11px] text-slate-400">
            Subtotal: {po.subtotal?.toLocaleString()} + GST: {po.taxAmount?.toLocaleString()}
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Role-Based Action Bar */}
      <div className="p-5 bg-indigo-950/40 border border-indigo-800/60 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
            Lifecycle Workflow Actions ({user?.role})
          </h4>
          <p className="text-xs text-slate-300 mt-0.5">
            Current Stage: <span className="text-white font-semibold">{po.status}</span>. Perform authorized role transitions below.
          </p>
        </div>

        {/* Action Buttons based on FSM and Role */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Buyer Action: Submit Draft for Approval */}
          {po.status === 'Draft' && isBuyerOrAdmin && (
            <button
              onClick={() => handleTransition('Pending Approval')}
              disabled={updating}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit for Approval</span>
            </button>
          )}

          {/* Admin Action: Approve PO */}
          {po.status === 'Pending Approval' && isAdmin && (
            <>
              <button
                onClick={() => handleTransition('Approved')}
                disabled={updating}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Approve Purchase Order</span>
              </button>
              <button
                onClick={() => handleTransition('Rejected')}
                disabled={updating}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject</span>
              </button>
            </>
          )}

          {/* Buyer/Admin Action: Transmit to Vendor */}
          {po.status === 'Approved' && isBuyerOrAdmin && (
            <button
              onClick={() => handleTransition('Sent')}
              disabled={updating}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Order to Vendor</span>
            </button>
          )}

          {/* Vendor Actions: Acknowledge or Decline */}
          {po.status === 'Sent' && isVendor && (
            <>
              <button
                onClick={() => handleTransition('Acknowledged')}
                disabled={updating}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Acknowledge Order</span>
              </button>
              <button
                onClick={() => handleTransition('Declined')}
                disabled={updating}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Decline Order</span>
              </button>
            </>
          )}

          {/* Delivery Confirmation */}
          {po.status === 'Acknowledged' && (
            <button
              onClick={() => handleTransition('Delivered')}
              disabled={updating}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Mark as Delivered</span>
            </button>
          )}

          {/* Invoicing */}
          {po.status === 'Delivered' && (
            <button
              onClick={() => handleTransition('Invoiced')}
              disabled={updating}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Register Invoice</span>
            </button>
          )}

          {/* Final Closure */}
          {po.status === 'Invoiced' && isBuyerOrAdmin && (
            <button
              onClick={() => handleTransition('Closed')}
              disabled={updating}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Close Purchase Order</span>
            </button>
          )}
        </div>
      </div>

      {/* Visual Timeline Stepper & Append-Only History */}
      <POTimelineStepper currentStatus={po.status} history={po.history} />

      {/* Line Items Table */}
      <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 overflow-hidden shadow-xl backdrop-blur">
        <div className="p-4 border-b border-slate-700/80">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">
            Procurement Line Items ({po.items?.length || 0})
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900/60 border-b border-slate-700/60 text-slate-400 uppercase font-semibold">
                <th className="py-3 px-4">Item SKU</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Unit Price</th>
                <th className="py-3 px-4 text-right">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50 text-slate-200">
              {po.items?.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-700/30">
                  <td className="py-3 px-4 font-mono text-slate-400">{item.itemCode || `SKU-${idx + 1}`}</td>
                  <td className="py-3 px-4 font-semibold text-white">{item.description}</td>
                  <td className="py-3 px-4 font-mono">{item.quantity}</td>
                  <td className="py-3 px-4 font-mono">{item.unitPrice?.toLocaleString()} {po.currency}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-sky-400">
                    {item.totalAmount?.toLocaleString()} {po.currency}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PODetailView;
