import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendors } from '../store/slices/vendorSlice';
import PendingVendorsQueue from '../components/PendingVendorsQueue';
import { 
  ShieldCheck, 
  Users, 
  Filter, 
  Search, 
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  FileCheck
} from 'lucide-react';

const AdminPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { vendors, loading } = useSelector((state) => state.vendor);

  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const loadVendors = () => {
    dispatch(fetchVendors({ status: statusFilter, search: searchQuery }));
  };

  useEffect(() => {
    loadVendors();
  }, [dispatch, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadVendors();
  };

  const pendingCount = vendors.filter((v) => v.status === 'Pending').length;
  const approvedCount = vendors.filter((v) => v.status === 'Approved').length;
  const rejectedCount = vendors.filter((v) => v.status === 'Rejected').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-sky-400 mb-1">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Governance Desk</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Vendor Approval Portal</h1>
          <p className="text-sm text-slate-400 mt-1">
            Review onboarding submissions, examine compliance KYC documents, and issue authorization.
          </p>
        </div>

        <button
          onClick={loadVendors}
          disabled={loading}
          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center space-x-2 border border-slate-700 self-start md:self-auto transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-sky-400' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Overview Stat Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase">Pending Verification</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">{pendingCount}</div>
          </div>
          <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase">Approved Vendors</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{approvedCount}</div>
          </div>
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase">Rejected Submissions</div>
            <div className="text-2xl font-bold text-rose-400 mt-1">{rejectedCount}</div>
          </div>
          <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-300">Status:</span>
          {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === status
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-900/70 text-slate-400 hover:text-white border border-slate-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vendor, GST, email..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold"
          >
            Search
          </button>
        </form>
      </div>

      {/* Pending Vendors Review Queue */}
      <PendingVendorsQueue vendors={vendors} onStatusChange={loadVendors} />
    </div>
  );
};

export default AdminPage;
