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
      <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 overflow-hidden shadow-xl backdrop-blur">
        <div className="p-4 border-b border-slate-700/80 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-base">Vendor Onboarding Queue</h3>
            <p className="text-xs text-slate-400">Review KYC compliance documents and approve or reject applications</p>
          </div>
          <span className="text-xs font-mono uppercase bg-sky-950 text-sky-400 border border-sky-800 px-2.5 py-1 rounded-full">
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
                <tr className="bg-slate-900/60 border-b border-slate-700/60 text-slate-400 uppercase font-semibold">
                  <th className="py-3 px-4">Vendor / Company</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Tax ID (GSTIN) / PAN</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Compliance</th>
                  <th className="py-3 px-4">Documents</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50 text-slate-200">
                {vendors.map((vendor) => {
                  const isProcessing = processingId === vendor._id;
                  const statusColors = {
                    Pending: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
                    'Under Review': 'bg-sky-500/20 text-sky-300 border-sky-500/30',
                    Approved: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
                    Rejected: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
                  };

                  return (
                    <tr key={vendor._id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-sm">{vendor.companyName}</div>
                        <div className="text-[11px] text-slate-400">{vendor.contactEmail}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                          {vendor.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <div>GST: {vendor.taxId}</div>
                        <div className="text-slate-400">PAN: {vendor.panNumber}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${statusColors[vendor.status] || ''}`}>
                          {vendor.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-1.5">
                          <div className="w-12 bg-slate-700 rounded-full h-1.5">
                            <div
                              className="bg-sky-500 h-1.5 rounded-full"
                              style={{ width: `${vendor.complianceScore || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-[11px] font-mono text-slate-300">{vendor.complianceScore || 0}%</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {vendor.documents && vendor.documents.length > 0 ? (
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => setSelectedVendor(vendor)}
                              className="px-2 py-1 bg-slate-900 hover:bg-slate-700 text-sky-400 rounded border border-slate-700 flex items-center space-x-1"
                            >
                              <FileText className="w-3 h-3" />
                              <span>{vendor.documents.length} Files</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-500">None</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => setSelectedVendor(vendor)}
                            className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded text-slate-200"
                            title="Inspect & Review"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {vendor.status !== 'Approved' && (
                            <button
                              onClick={() => handleAction(vendor._id, 'Approved')}
                              disabled={isProcessing}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-semibold text-xs transition-colors disabled:opacity-50 flex items-center space-x-1"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Approve</span>
                            </button>
                          )}
                          {vendor.status !== 'Rejected' && (
                            <button
                              onClick={() => handleAction(vendor._id, 'Rejected')}
                              disabled={isProcessing}
                              className="px-2.5 py-1 bg-rose-600/80 hover:bg-rose-600 text-white rounded font-semibold text-xs transition-colors disabled:opacity-50 flex items-center space-x-1"
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
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-white text-lg">{selectedVendor.companyName}</h3>
                <p className="text-xs text-slate-400">KYC Verification & Approval Desk</p>
              </div>
              <button
                onClick={() => setSelectedVendor(null)}
                className="text-slate-400 hover:text-white text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500 font-semibold uppercase">GSTIN:</span>
                <div className="font-mono text-slate-200">{selectedVendor.taxId}</div>
              </div>
              <div>
                <span className="text-slate-500 font-semibold uppercase">PAN Number:</span>
                <div className="font-mono text-slate-200">{selectedVendor.panNumber}</div>
              </div>
              <div>
                <span className="text-slate-500 font-semibold uppercase">Business Type:</span>
                <div className="text-slate-200">{selectedVendor.businessType}</div>
              </div>
              <div>
                <span className="text-slate-500 font-semibold uppercase">Category:</span>
                <div className="text-slate-200">{selectedVendor.category}</div>
              </div>
            </div>

            {/* Documents Preview Section */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                KYC Compliance Documents
              </h4>
              {selectedVendor.documents && selectedVendor.documents.length > 0 ? (
                <div className="space-y-2">
                  {selectedVendor.documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-sky-400" />
                        <div>
                          <div className="text-xs font-semibold text-white">{doc.documentType}</div>
                          <div className="text-[11px] text-slate-400">{doc.fileName}</div>
                        </div>
                      </div>
                      <a
                        href={`http://localhost:5000${doc.documentUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1 bg-sky-600/30 hover:bg-sky-600 text-sky-300 hover:text-white rounded text-xs flex items-center space-x-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Preview Document</span>
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-slate-950 rounded-xl text-center text-xs text-slate-500">
                  No documents attached to this vendor application.
                </div>
              )}
            </div>

            {/* Approval / Rejection Reason Input */}
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                Decision Remarks / Audit Reason
              </label>
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="State remarks for approval compliance or reasons for rejection..."
                rows={2}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedVendor(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => handleAction(selectedVendor._id, 'Rejected')}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject Application</span>
              </button>
              <button
                onClick={() => handleAction(selectedVendor._id, 'Approved')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1"
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
