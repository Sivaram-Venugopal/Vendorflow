import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateVendorStatus, setVendorStatusOptimistic } from '../store/slices/vendorSlice';
import { 
  Building2, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  FileText, 
  ShieldCheck, 
  AlertTriangle,
  Clock,
  Eye,
  Loader2
} from 'lucide-react';
import { getAssetUrl } from '../api/axiosClient';

const PendingVendorsQueue = ({ vendors, onStatusChange }) => {
  const dispatch = useDispatch();

  const [selectedVendor, setSelectedVendor] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [actionReason, setActionReason] = useState('');
  const [processingId, setProcessingId] = useState(null);

  const handleAction = async (vendorId, status) => {
    setProcessingId(vendorId);

    // 1. Optimistic UI update: Immediate responsive UI reflection
    dispatch(
      setVendorStatusOptimistic({
        vendorId,
        status,
        reason: actionReason,
      })
    );

    try {
      // 2. Transmit to server
      await dispatch(
        updateVendorStatus({
          vendorId,
          status,
          reason: actionReason || (status === 'Approved' ? 'Compliant profile approved' : 'Rejected by admin review'),
        })
      ).unwrap();

      setActionReason('');
      setSelectedVendor(null);
      if (onStatusChange) onStatusChange();
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Table / Cards of Vendors */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">Vendor Onboarding Queue</h3>
            <p className="text-xs text-slate-500">Review KYC compliance documents and approve or reject applications</p>
          </div>
          <span className="text-xs font-mono font-bold uppercase bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-full">
            {vendors.length} Total Registered
          </span>
        </div>

        {vendors.length === 0 ? (
          <div className="p-10 text-center text-slate-400 text-xs">
            No vendors found matching current filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase font-bold text-[11px] tracking-wider">
                  <th className="py-3 px-4">Vendor / Company</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Tax ID (GSTIN) / PAN</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Compliance</th>
                  <th className="py-3 px-4">Documents</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {vendors.map((vendor) => {
                  const isProcessing = processingId === vendor._id;
                  const statusColors = {
                    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
                    'Under Review': 'bg-sky-50 text-sky-700 border-sky-200',
                    Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    Rejected: 'bg-rose-50 text-rose-700 border-rose-200',
                  };

                  return (
                    <tr key={vendor._id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm">{vendor.companyName}</div>
                        <div className="text-[11px] text-slate-500">{vendor.contactEmail}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-medium">
                          {vendor.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <div className="font-bold text-slate-800">GST: {vendor.taxId}</div>
                        <div className="text-slate-500">PAN: {vendor.panNumber}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusColors[vendor.status] || ''}`}>
                          {vendor.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-1.5">
                          <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-indigo-600 h-1.5 rounded-full"
                              style={{ width: `${vendor.complianceScore || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-[11px] font-mono font-bold text-slate-700">{vendor.complianceScore || 0}%</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {vendor.documents && vendor.documents.length > 0 ? (
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => setSelectedVendor(vendor)}
                              className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg border border-indigo-200 font-bold flex items-center space-x-1 transition-colors"
                            >
                              <FileText className="w-3 h-3" />
                              <span>{vendor.documents.length} Files</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400">None</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => setSelectedVendor(vendor)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"
                            title="Inspect & Review"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {vendor.status !== 'Approved' && (
                            <button
                              onClick={() => handleAction(vendor._id, 'Approved')}
                              disabled={isProcessing}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs transition-colors shadow-xs disabled:opacity-50 flex items-center space-x-1"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Approve</span>
                            </button>
                          )}
                          {vendor.status !== 'Rejected' && (
                            <button
                              onClick={() => handleAction(vendor._id, 'Rejected')}
                              disabled={isProcessing}
                              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs transition-colors shadow-xs disabled:opacity-50 flex items-center space-x-1"
                            >
                              <XCircle className="w-3 h-3" />
                              <span>Reject</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Vendor Review & Document Preview Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">{selectedVendor.companyName}</h3>
                <p className="text-xs text-slate-500">KYC Verification & Approval Desk</p>
              </div>
              <button
                onClick={() => setSelectedVendor(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 font-bold uppercase text-[10px]">GSTIN:</span>
                <div className="font-mono font-bold text-slate-900">{selectedVendor.taxId}</div>
              </div>
              <div>
                <span className="text-slate-500 font-bold uppercase text-[10px]">PAN Number:</span>
                <div className="font-mono font-bold text-slate-900">{selectedVendor.panNumber}</div>
              </div>
              <div>
                <span className="text-slate-500 font-bold uppercase text-[10px]">Business Type:</span>
                <div className="text-slate-800 font-medium">{selectedVendor.businessType}</div>
              </div>
              <div>
                <span className="text-slate-500 font-bold uppercase text-[10px]">Category:</span>
                <div className="text-slate-800 font-medium">{selectedVendor.category}</div>
              </div>
            </div>

            {/* Documents Preview Section */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                KYC Compliance Documents
              </h4>
              {selectedVendor.documents && selectedVendor.documents.length > 0 ? (
                <div className="space-y-2">
                  {selectedVendor.documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-indigo-600" />
                        <div>
                          <div className="text-xs font-bold text-slate-900">{doc.documentType}</div>
                          <div className="text-[11px] text-slate-500">{doc.fileName}</div>
                        </div>
                      </div>
                      <a
                        href={getAssetUrl(doc.documentUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold flex items-center space-x-1 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Preview Document</span>
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-400">
                  No documents attached to this vendor application.
                </div>
              )}
            </div>

            {/* Approval / Rejection Reason Input */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Decision Remarks / Audit Reason
              </label>
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="State remarks for approval compliance or reasons for rejection..."
                rows={2}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedVendor(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => handleAction(selectedVendor._id, 'Rejected')}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1 shadow-xs transition-colors"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject Application</span>
              </button>
              <button
                onClick={() => handleAction(selectedVendor._id, 'Approved')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1 shadow-xs transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve & Onboard</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingVendorsQueue;
