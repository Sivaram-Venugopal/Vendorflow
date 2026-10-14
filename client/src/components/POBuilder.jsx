import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createPO } from '../store/slices/purchaseOrderSlice';
import AddCompanyModal from './AddCompanyModal';
import { 
  ShoppingBag, 
  Plus, 
  Trash2, 
  Calculator, 
  Calendar, 
  Building2, 
  MapPin, 
  Send, 
  AlertCircle, 
  Loader2,
  CheckCircle2,
  UserPlus
} from 'lucide-react';

const POBuilder = ({ vendors = [], onComplete }) => {
  const dispatch = useDispatch();

  const [vendorId, setVendorId] = useState(vendors[0]?._id || '');
  const [title, setTitle] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560100',
  });

  // Dynamic Line Items
  const [items, setItems] = useState([
    { itemCode: 'ITEM-001', description: 'Raw Machined Components & Castings', quantity: 10, unitPrice: 1500 },
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [touched, setTouched] = useState({});

  // Sync vendorId whenever vendors list updates
  useEffect(() => {
    if (!vendorId && vendors.length > 0) {
      setVendorId(vendors[0]._id);
    }
  }, [vendors, vendorId]);

  // Auto-computed totals
  const subtotal = items.reduce(
    (sum, i) => sum + (Number(i.quantity || 0) * Number(i.unitPrice || 0)),
    0
  );
  const taxAmount = Math.round(subtotal * 0.18 * 100) / 100;
  const totalAmount = subtotal + taxAmount;

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const addItemRow = () => {
    setItems([
      ...items,
      { itemCode: `ITEM-${String(items.length + 1).padStart(3, '0')}`, description: '', quantity: 1, unitPrice: 0 },
    ]);
  };

  const removeItemRow = (index) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vendorId) {
      setErrorMsg('Please select an authorized supplier company from the list');
      return;
    }
    if (!title.trim()) {
      setErrorMsg('Purchase order title is required');
      return;
    }

    const hasInvalidLine = items.some(
      (item) => !item.description.trim() || Number(item.quantity) <= 0 || Number(item.unitPrice) < 0
    );
    if (hasInvalidLine) {
      setErrorMsg('Please ensure all line items have a valid description, quantity > 0, and non-negative price.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const result = await dispatch(
        createPO({
          vendor: vendorId,
          vendorId: vendorId,
          title: title.trim(),
          deliveryDate,
          expectedDeliveryDate: deliveryDate,
          shippingAddress,
          notes: notes.trim(),
          currency,
          items: items.map((i) => ({
            itemCode: i.itemCode || 'ITEM',
            description: i.description.trim() || 'Standard procurement line item',
            quantity: Number(i.quantity),
            unitPrice: Number(i.unitPrice),
          })),
        })
      ).unwrap();

      if (onComplete) onComplete(result);
    } catch (err) {
      setErrorMsg(typeof err === 'string' ? err : 'Purchase order creation failed. Please check your inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-red-200 p-6 md:p-8 shadow-xl space-y-6">
      {/* Red Accent Header */}
      <div className="border-b border-slate-100 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 text-red-600 mb-1">
            <ShoppingBag className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Purchase Order Builder</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Draft New Purchase Requisition</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Create an itemized purchase order with automated subtotal, 18% GST calculation, and workflow routing.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddCompanyOpen(true)}
          className="px-3.5 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4 text-red-600" />
          <span>+ Onboard Company</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center space-x-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {vendors.length === 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>No approved suppliers found yet. Please onboard an approved supplier first.</span>
          </div>
          <button
            type="button"
            onClick={() => setIsAddCompanyOpen(true)}
            className="ml-3 px-3 py-1 bg-amber-600 text-white rounded-lg font-bold text-[11px] hover:bg-amber-700 transition-colors"
          >
            Add Supplier Now
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              PO Title / Work Order Description *
            </label>
            <input
              type="text"
              value={title}
              onFocus={() => setErrorMsg('')}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="e.g. Q1 Industrial Equipment & Precision Assemblies"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white transition-all shadow-sm"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Target Supplier *
              </label>
              <button
                type="button"
                onClick={() => setIsAddCompanyOpen(true)}
                className="text-[11px] text-red-600 font-semibold hover:underline"
              >
                + New
              </button>
            </div>
            <select
              value={vendorId}
              onChange={(e) => setVendorId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white"
            >
              {vendors.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.companyName} ({v.category} - {v.ratingTier || 'Approved'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Expected Delivery Date *
            </label>
            <input
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Destination City
            </label>
            <input
              type="text"
              value={shippingAddress.city}
              onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white"
            >
              <option value="INR">INR (₹) - Indian Rupee</option>
              <option value="USD">USD ($) - US Dollar</option>
              <option value="EUR">EUR (€) - Euro</option>
              <option value="GBP">GBP (£) - British Pound</option>
            </select>
          </div>
        </div>

        {/* Dynamic Line Items Section */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Procurement Line Items ({items.length})
            </span>
            <button
              type="button"
              onClick={addItemRow}
              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-semibold flex items-center space-x-1 border border-red-200 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Item</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-red-50/50 border-b border-slate-200 text-slate-700 uppercase font-bold text-[11px]">
                  <th className="py-2.5 px-3">SKU / Code</th>
                  <th className="py-2.5 px-3">Item Description *</th>
                  <th className="py-2.5 px-3 w-28">Quantity</th>
                  <th className="py-2.5 px-3 w-32">Unit Price ({currency})</th>
                  <th className="py-2.5 px-3 w-32 text-right">Line Total</th>
                  <th className="py-2.5 px-3 w-12 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {items.map((item, idx) => {
                  const lineTotal = Number(item.quantity || 0) * Number(item.unitPrice || 0);
                  return (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={item.itemCode}
                          onChange={(e) => handleItemChange(idx, 'itemCode', e.target.value)}
                          placeholder="ITEM-001"
                          className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-800"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                          placeholder="Specification or component name"
                          className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                          className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-800 text-right"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                          className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-800 text-right"
                        />
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-slate-800">
                        {lineTotal.toLocaleString()} {currency}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => removeItemRow(idx)}
                          disabled={items.length <= 1}
                          className="p-1 rounded text-slate-400 hover:text-red-600 disabled:opacity-30 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notes & Summary Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Special Instructions / Delivery Terms
            </label>
            <textarea
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Standard dispatch via surface logistics. Inspection report required on delivery."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white"
            />
          </div>

          <div className="p-4 bg-red-50/50 rounded-xl border border-red-100 flex flex-col justify-between">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({items.length} items):</span>
                <span className="font-mono font-semibold">{subtotal.toLocaleString()} {currency}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>GST Tax (18% Statutory):</span>
                <span className="font-mono font-semibold">{taxAmount.toLocaleString()} {currency}</span>
              </div>
              <div className="border-t border-red-200/80 pt-2 flex justify-between text-sm font-bold text-slate-900">
                <span>Total Requisition Value:</span>
                <span className="font-mono text-red-600 text-base">{totalAmount.toLocaleString()} {currency}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
          <button
            type="submit"
            disabled={submitting || vendors.length === 0}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-lg shadow-red-600/20 transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Purchase Order...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Save & Submit Purchase Order</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Add Company Modal */}
      <AddCompanyModal
        isOpen={isAddCompanyOpen}
        onClose={() => setIsAddCompanyOpen(false)}
        onCompanyAdded={(newVendor) => {
          if (newVendor && newVendor._id) {
            setVendorId(newVendor._id);
          }
        }}
      />
    </div>
  );
};

export default POBuilder;
