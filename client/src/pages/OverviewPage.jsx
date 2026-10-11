import React from 'react';
import { useSelector } from 'react-redux';
import { Server, Database, CheckCircle2, ArrowRight, ShieldCheck, ShoppingCart, Truck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const OverviewPage = () => {
  const { data, status } = useSelector((state) => state.health);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">System Overview & Portals</h1>
          <p className="text-sm text-slate-400 mt-1">
            VendorFlow — End-to-End Enterprise Procurement Portal
          </p>
        </div>
        {isAuthenticated && user && (
          <div className="flex items-center space-x-3 bg-slate-800/80 border border-slate-700/80 px-4 py-2 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center justify-center font-bold text-sm">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-xs text-slate-400">Signed in as</div>
              <div className="text-sm font-semibold text-white">{user.name} ({user.role})</div>
            </div>
            <Link
              to={user.role === 'Admin' ? '/admin' : user.role === 'Procurement' ? '/buyer' : '/vendor'}
              className="ml-2 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold transition-colors inline-flex items-center space-x-1"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* Connection & Stack Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 bg-slate-800/60 rounded-xl border border-slate-700/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Backend API</span>
              <Server className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-xl font-bold text-white">Express 4.x + Node.js</div>
            <p className="text-xs text-slate-400 mt-1">Port 5000 | JWT RBAC & Aggregations</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center text-xs">
            <span
              className={`inline-block w-2 h-2 rounded-full mr-2 ${
                status === 'succeeded' ? 'bg-emerald-400' : 'bg-rose-400'
              }`}
            ></span>
            <span className="text-slate-300">
              {status === 'succeeded' ? 'Service Healthy' : 'Awaiting Connection'}
            </span>
          </div>
        </div>

        <div className="p-5 bg-slate-800/60 rounded-xl border border-slate-700/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Database</span>
              <Database className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-white">MongoDB</div>
            <p className="text-xs text-slate-400 mt-1">
              DB Name: {data?.database?.name || 'vendorflow'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center text-xs">
            <span
              className={`inline-block w-2 h-2 rounded-full mr-2 ${
                data?.database?.status === 'connected' ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            ></span>
            <span className="text-slate-300">
              State: {data?.database?.status || 'connecting...'}
            </span>
          </div>
        </div>

        <div className="p-5 bg-slate-800/60 rounded-xl border border-slate-700/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Frontend App</span>
              <CheckCircle2 className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-xl font-bold text-white">Vite + React + Tailwind</div>
            <p className="text-xs text-slate-400 mt-1">Redux Toolkit + Recharts Analytics</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center text-xs text-emerald-400">
            <span>Client Shell Mounted</span>
          </div>
        </div>
      </div>

      {/* Navigation Quick Links */}
      <div className="mt-8 bg-slate-800/40 rounded-xl border border-slate-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Operational Procurement Workspaces</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/login"
            className="p-4 bg-slate-800/70 hover:bg-slate-700/70 transition-colors rounded-lg border border-slate-700/50 flex items-center justify-between group"
          >
            <div>
              <div className="font-semibold text-slate-200">Authentication</div>
              <div className="text-xs text-slate-400">Login & switch roles</div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
          </Link>

          <Link
            to="/admin"
            className="p-4 bg-slate-800/70 hover:bg-slate-700/70 transition-colors rounded-lg border border-slate-700/50 flex items-center justify-between group"
          >
            <div>
              <div className="font-semibold text-slate-200 flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                <span>Admin Portal</span>
              </div>
              <div className="text-xs text-slate-400">KPIs, Approvals, Spend Analytics</div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
          </Link>

          <Link
            to="/buyer"
            className="p-4 bg-slate-800/70 hover:bg-slate-700/70 transition-colors rounded-lg border border-slate-700/50 flex items-center justify-between group"
          >
            <div>
              <div className="font-semibold text-slate-200 flex items-center space-x-1.5">
                <ShoppingCart className="w-3.5 h-3.5 text-sky-400" />
                <span>Buyer Workspace</span>
              </div>
              <div className="text-xs text-slate-400">Quick PO Creator, Evaluations</div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
          </Link>

          <Link
            to="/vendor"
            className="p-4 bg-slate-800/70 hover:bg-slate-700/70 transition-colors rounded-lg border border-slate-700/50 flex items-center justify-between group"
          >
            <div>
              <div className="font-semibold text-slate-200 flex items-center space-x-1.5">
                <Truck className="w-3.5 h-3.5 text-teal-400" />
                <span>Vendor Workspace</span>
              </div>
              <div className="text-xs text-slate-400">Scorecard & Incoming PO Action</div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
