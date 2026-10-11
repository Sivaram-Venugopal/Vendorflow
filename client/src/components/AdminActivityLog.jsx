import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAuditLogs, setSelectedLog, clearSelectedLog } from '../store/slices/auditLogSlice';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Calendar, 
  RefreshCw, 
  Mail, 
  ExternalLink, 
  Eye, 
  X, 
  User, 
  ArrowRight, 
  Clock, 
  Database,
  CheckCircle,
  XCircle,
  FileText
} from 'lucide-react';

const ACTION_COLORS = {
  VENDOR_APPROVED: 'bg-emerald-950 text-emerald-400 border-emerald-800',
  VENDOR_REJECTED: 'bg-rose-950 text-rose-400 border-rose-800',
  VENDOR_CREATED: 'bg-sky-950 text-sky-400 border-sky-800',
  VENDOR_UPDATED: 'bg-blue-950 text-blue-400 border-blue-800',
  EVALUATION_SUBMITTED: 'bg-indigo-950 text-indigo-400 border-indigo-800',
  PO_CREATED: 'bg-amber-950 text-amber-400 border-amber-800',
  PO_STATUS_UPDATED: 'bg-cyan-950 text-cyan-400 border-cyan-800',
  PO_ACKNOWLEDGED: 'bg-teal-950 text-teal-400 border-teal-800',
};

const AdminActivityLog = () => {
  const dispatch = useDispatch();
  const { logs, total, page, pages, loading, error, selectedLog } = useSelector((state) => state.auditLog);

  const [entityType, setEntityType] = useState('All');
  const [action, setAction] = useState('All');
  const [actorQuery, setActorQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const loadLogs = (pageNum = currentPage) => {
    dispatch(
      fetchAuditLogs({
        entityType,
        action,
        actor: actorQuery,
        startDate,
        endDate,
        search: searchQuery,
        page: pageNum,
        limit: 25,
      })
    );
  };

  useEffect(() => {
    loadLogs(currentPage);
  }, [dispatch, entityType, action, currentPage]);

  const handleApplyFilters = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadLogs(1);
  };

  const handleResetFilters = () => {
    setEntityType('All');
    setAction('All');
    setActorQuery('');
    setStartDate('');
    setEndDate('');
    setSearchQuery('');
    setCurrentPage(1);
    dispatch(
      fetchAuditLogs({
        entityType: 'All',
        action: 'All',
        page: 1,
        limit: 25,
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Filter Toolbar */}
      <form
        onSubmit={handleApplyFilters}
        className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 shadow-xl backdrop-blur space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sky-400">
            <Filter className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Audit Log Query Filters</span>
          </div>
          <div className="text-xs text-slate-400">
            Total Logged Events: <span className="font-bold text-white">{total}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {/* Entity Filter */}
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Entity Domain</label>
            <select
              value={entityType}
              onChange={(e) => setEntityType(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg p-2 focus:outline-none focus:border-sky-500"
            >
              <option value="All">All Entities</option>
              <option value="Vendor">Vendor</option>
              <option value="PurchaseOrder">PurchaseOrder</option>
              <option value="Evaluation">Evaluation</option>
              <option value="User">User</option>
            </select>
          </div>

          {/* Action Filter */}
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Action Type</label>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg p-2 focus:outline-none focus:border-sky-500"
            >
              <option value="All">All Actions</option>
              <option value="VENDOR_APPROVED">VENDOR_APPROVED</option>
              <option value="VENDOR_REJECTED">VENDOR_REJECTED</option>
              <option value="VENDOR_CREATED">VENDOR_CREATED</option>
              <option value="VENDOR_UPDATED">VENDOR_UPDATED</option>
              <option value="EVALUATION_SUBMITTED">EVALUATION_SUBMITTED</option>
              <option value="PO_CREATED">PO_CREATED</option>
              <option value="PO_STATUS_UPDATED">PO_STATUS_UPDATED</option>
              <option value="PO_ACKNOWLEDGED">PO_ACKNOWLEDGED</option>
            </select>
          </div>

          {/* Actor Search */}
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Actor (Name / Email)</label>
            <input
              type="text"
              value={actorQuery}
              onChange={(e) => setActorQuery(e.target.value)}
              placeholder="e.g. Sarah, Buyer..."
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg p-2 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Free Search */}
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Search Keywords</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="PO#, remarks, vendor name..."
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg p-2 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Date Start */}
          <div>
            <label className="text-slate-400 font-semibold block mb-1">From Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg p-2 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Date End */}
          <div>
            <label className="text-slate-400 font-semibold block mb-1">To Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg p-2 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Buttons */}
          <div className="sm:col-span-2 flex items-end space-x-2 pt-1">
            <button
              type="submit"
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-semibold flex items-center space-x-1 transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Apply Filters</span>
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg font-medium transition-colors"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => loadLogs(currentPage)}
              disabled={loading}
              className="p-2 bg-slate-900 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg transition-colors ml-auto"
              title="Refresh logs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-sky-400' : ''}`} />
            </button>
          </div>
        </div>
      </form>

      {/* Activity Log Table */}
      <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 overflow-hidden shadow-xl backdrop-blur">
        <div className="p-4 border-b border-slate-700/80 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-base">Immutable System Activity Log</h3>
            <p className="text-xs text-slate-400">
              Write-once audit records capturing who, what, when, before/after states, and test emails
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900/60 border-b border-slate-700/60 text-slate-400 uppercase font-semibold">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">State Transition (Before &rarr; After)</th>
                <th className="py-3 px-4">Audit Details & Email</th>
                <th className="py-3 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50 text-slate-200">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No audit records match the applied criteria.
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const actionStyle =
                    ACTION_COLORS[log.action] ||
                    'bg-slate-900 text-slate-300 border-slate-700';

                  const previewUrl = log.details?.emailPreviewUrl;

                  return (
                    <tr key={log._id} className="hover:bg-slate-700/30 transition-colors">
                      {/* Timestamp */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-400">
                        <div className="text-slate-200 font-mono">
                          {new Date(log.createdAt).toLocaleTimeString()}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {new Date(log.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      {/* Actor */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">
                          {log.user?.name || 'System User'}
                        </div>
                        <div className="flex items-center space-x-1.5 mt-0.5">
                          <span className="text-[10px] font-mono uppercase bg-slate-900 px-1.5 py-0.2 rounded text-sky-400 border border-slate-700">
                            {log.user?.role || 'System'}
                          </span>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase inline-block ${actionStyle}`}
                        >
                          {log.action}
                        </span>
                      </td>

                      {/* Entity */}
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <div className="font-semibold text-slate-200">{log.entityType}</div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[120px]">
                          {log.entityId}
                        </div>
                      </td>

                      {/* State Transition */}
                      <td className="py-3.5 px-4 max-w-xs">
                        {log.beforeState || log.afterState ? (
                          <div className="flex items-center space-x-1.5 text-[11px]">
                            {log.beforeState?.status ? (
                              <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-400">
                                {log.beforeState.status}
                              </span>
                            ) : log.beforeState?.overallRating ? (
                              <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-400">
                                {log.beforeState.overallRating}★ ({log.beforeState.ratingTier})
                              </span>
                            ) : (
                              <span className="text-slate-500">None</span>
                            )}

                            <ArrowRight className="w-3 h-3 text-slate-500 flex-shrink-0" />

                            {log.afterState?.status ? (
                              <span className="px-1.5 py-0.5 rounded bg-sky-950 border border-sky-800 text-sky-300 font-semibold">
                                {log.afterState.status}
                              </span>
                            ) : log.afterState?.overallRating ? (
                              <span className="px-1.5 py-0.5 rounded bg-indigo-950 border border-indigo-800 text-indigo-300 font-semibold">
                                {log.afterState.overallRating}★ ({log.afterState.ratingTier})
                              </span>
                            ) : (
                              <span className="text-slate-300">Updated</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500">Initial Creation</span>
                        )}
                      </td>

                      {/* Details & Email Link */}
                      <td className="py-3.5 px-4">
                        <div className="text-[11px] text-slate-300 truncate max-w-xs">
                          {log.details?.companyName ||
                            log.details?.poNumber ||
                            log.details?.remarks ||
                            log.details?.reason ||
                            'State change recorded'}
                        </div>

                        {previewUrl && (
                          <a
                            href={previewUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center space-x-1 text-[10px] text-sky-400 hover:text-sky-300 font-semibold mt-1 bg-sky-950/60 border border-sky-800 px-2 py-0.5 rounded transition-colors"
                          >
                            <Mail className="w-3 h-3" />
                            <span>Ethereal Test Email ↗</span>
                          </a>
                        )}
                      </td>

                      {/* Inspect Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => dispatch(setSelectedLog(log))}
                          className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded font-semibold text-[11px] inline-flex items-center space-x-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Diff</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {pages > 1 && (
          <div className="p-4 border-t border-slate-700/80 flex items-center justify-between text-xs text-slate-400">
            <div>
              Showing page <span className="font-bold text-white">{page}</span> of{' '}
              <span className="font-bold text-white">{pages}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                disabled={page <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={page >= pages}
                onClick={() => setCurrentPage((p) => Math.min(pages, p + 1))}
                className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Side / Modal Inspector for Before & After State Diff */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl space-y-4">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-sky-400" />
                <h3 className="font-bold text-white text-base">
                  Audit Snapshot & State Diff: {selectedLog.action}
                </h3>
              </div>
              <button
                onClick={() => dispatch(clearSelectedLog())}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              {/* Metadata strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-slate-300">
                <div>
                  <span className="text-slate-500 uppercase block text-[10px]">Actor:</span>
                  <span className="font-bold text-white">{selectedLog.user?.name}</span> ({selectedLog.user?.role})
                </div>
                <div>
                  <span className="text-slate-500 uppercase block text-[10px]">Entity Type:</span>
                  <span className="font-bold text-white">{selectedLog.entityType}</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase block text-[10px]">IP Address:</span>
                  <span className="font-mono text-white">{selectedLog.ipAddress || 'Internal'}</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase block text-[10px]">Logged At:</span>
                  <span className="text-slate-300">{new Date(selectedLog.createdAt).toLocaleString()}</span>
                </div>
              </div>

              {/* Side-by-Side Diff */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px] mb-2">
                    Before State Snapshot
                  </h4>
                  <pre className="font-mono text-[11px] text-slate-300 bg-slate-900/90 p-3 rounded-lg overflow-x-auto">
                    {JSON.stringify(selectedLog.beforeState || { status: 'None' }, null, 2)}
                  </pre>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <h4 className="font-bold text-emerald-400 uppercase tracking-wider text-[11px] mb-2">
                    After State Snapshot
                  </h4>
                  <pre className="font-mono text-[11px] text-slate-300 bg-slate-900/90 p-3 rounded-lg overflow-x-auto">
                    {JSON.stringify(selectedLog.afterState || { status: 'Recorded' }, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Details & Email link */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                  Execution Metadata & Parameters
                </h4>
                <pre className="font-mono text-[11px] text-slate-300 bg-slate-900/90 p-3 rounded-lg overflow-x-auto">
                  {JSON.stringify(selectedLog.details || {}, null, 2)}
                </pre>

                {selectedLog.details?.emailPreviewUrl && (
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-slate-400">Dispatched Ethereal Notification:</span>
                    <a
                      href={selectedLog.details.emailPreviewUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-semibold flex items-center space-x-1"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>View Test Email in Browser ↗</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminActivityLog;
