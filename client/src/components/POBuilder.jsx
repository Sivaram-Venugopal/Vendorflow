import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createPO } from '../store/slices/purchaseOrderSlice';
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
  Loader2 
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

  const [shippingAddress, setShippingAddress] = useState({
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560100',
  });

  // Dynamic Line Items
  const [items, setItems] = useState([
    { itemCode: 'ITEM-001', description: 'Raw Machined Components', quantity: 10, unitPrice: 1500 },
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
      setErrorMsg('Please select a supplier');
      return;
    }
    if (!title.trim()) {
      setErrorMsg('PO title is required');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      await dispatch(
        createPO({
          vendorId,
          title,
          deliveryDate,
          shippingAddress,
          notes,
          currency,
          items: items.map((i) => ({
            itemCode: i.itemCode,
            description: i.description || 'Standard procurement line item',
            quantity: Number(i.quantity),
            unitPrice: Number(i.unitPrice),
          })),
        })
      ).unwrap();

      if (onComplete) onComplete();
    } catch (err) {
      setErrorMsg(typeof err === 'string' ? err : 'PO creation failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-800/90 rounded-2xl border border-slate-700/80 p-6 md:p-8 shadow-2xl backdrop-blur space-y-6">
      <div className="border-b border-slate-700 pb-4">
        <h3 className="text-lg font-bold text-white flex items-center space-x-2">
          <ShoppingBag className="w-5 h-5 text-indigo-400" />
          <span>Purchase Order Draft Builder</span>
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Draft a new purchase order with automatic subtotal, 18% GST calculation, and delivery scheduling.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
              PO Title / Work Order Description *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Q1 Industrial Equipment & Precision Assemblies"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
              Select Supplier / Vendor *
            </label>
            <select
              value={vendorId}
              onChange={(e) => setVendorId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {vendors.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.companyName} ({v.category} - {v.ratingTier || 'Approved'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
              Expected Delivery Date *
            </label>
            <input
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
              Destination City
            </label>
            <input
              type="text"
              value={shippingAddress.city}
              onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
              Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200"
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
        </div>

        {/* Dynamic Line Items Table */}
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/60 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Procurement Line Items ({items.length})
            </h4>
            <button
              type="button"
              onClick={addItemRow}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs rounded border border-slate-700 flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Line Item</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400 uppercase">
                  <th className="py-2 px-2 w-28">Item SKU</th>
                  <th className="py-2 px-2">Description *</th>
                  <th className="py-2 px-2 w-20">Qty *</th>
                  <th className="py-2 px-2 w-28">Unit Price *</th>
                  <th className="py-2 px-2 w-28 text-right">Line Total</th>
                  <th className="py-2 px-2 w-10 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {items.map((item, idx) => {
                  const lineTotal = Number(item.quantity || 0) * Number(item.unitPrice || 0);
                  return (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      <td className="py-2 px-2">
                        <input
                          type="text"
                          value={item.itemCode}
                          onChange={(e) => handleItemChange(idx, 'itemCode', e.target.value)}
                          placeholder="SKU"
                          className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-xs text-slate-200 font-mono"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                          placeholder="Item specification & description"
                          className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-xs text-slate-200"
                          required
                        />
                      </td>
                      <td className="py-2 px-2">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                          className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-xs text-slate-200 font-mono"
                          required
                        />
                      </td>
                      <td className="py-2 px-2">
                        <input
                          type="number"
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                          className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-xs text-slate-200 font-mono"
                          required
                        />
                      </td>
                      <td className="py-2 px-2 text-right font-mono font-bold text-slate-200">
                        {lineTotal.toLocaleString()} {currency}
                      </td>
                      <td className="py-2 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => removeItemRow(idx)}
                          disabled={items.length <= 1}
                          className="text-slate-500 hover:text-rose-400 disabled:opacity-30"
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

        {/* Auto-Computed Financial Summary */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900/80 p-4 rounded-xl border border-slate-700/80 gap-4">
          <div className="w-full md:w-1/2">
            <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
              Procurement Terms & Instructions
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Include Certificate of Analysis and GST E-way bill"
              className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200"
            />
          </div>

          <div className="w-full md:w-64 space-y-1.5 text-xs text-right">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal:</span>
              <span className="font-mono text-slate-200">{subtotal.toLocaleString()} {currency}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>GST (18%):</span>
              <span className="font-mono text-slate-200">{taxAmount.toLocaleString()} {currency}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-white pt-1 border-t border-slate-700">
              <span>Grand Total:</span>
              <span className="font-mono text-emerald-400">{totalAmount.toLocaleString()} {currency}</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-sm font-semibold flex items-center justify-center space-x-2 transition-colors shadow-lg shadow-indigo-600/20"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating Purchase Order...</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Create Purchase Order (Draft)</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default POBuilder;
