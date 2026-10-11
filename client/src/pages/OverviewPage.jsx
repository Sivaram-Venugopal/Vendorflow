import React from 'react';
import { useSelector } from 'react-redux';
import { Server, Database, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const OverviewPage = () => {
  const { data, status } = useSelector((state) => state.health);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-white tracking-tight">System Overview & Status</h1>
        <p className="text-sm text-slate-400 mt-1">
          VendorFlow Phase 0: MERN Procurement Portal Environment Bootstrap
        </p>
      </div>

      {/* Connection & Stack Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 bg-slate-800/60 rounded-xl border border-slate-700/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Backend API</span>
              <Server className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-xl font-bold text-white">Express 4.x</div>
            <p className="text-xs text-slate-400 mt-1">Port 5000 | CORS Enabled</p>
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
            <div className="text-xl font-bold text-white">Vite + React 19</div>
            <p className="text-xs text-slate-400 mt-1">Redux Toolkit + Tailwind CSS</p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center text-xs text-emerald-400">
            <span>Client Shell Mounted</span>
          </div>
        </div>
      </div>

      {/* Navigation Quick Links */}
      <div className="mt-8 bg-slate-800/40 rounded-xl border border-slate-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Routed Portals (Phase 0 Skeleton)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/login"
            className="p-4 bg-slate-800/70 hover:bg-slate-700/70 transition-colors rounded-lg border border-slate-700/50 flex items-center justify-between group"
          >
            <div>
              <div className="font-semibold text-slate-200">Login</div>
              <div className="text-xs text-slate-400">Auth entry point</div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
          </Link>

          <Link
            to="/admin"
            className="p-4 bg-slate-800/70 hover:bg-slate-700/70 transition-colors rounded-lg border border-slate-700/50 flex items-center justify-between group"
          >
            <div>
              <div className="font-semibold text-slate-200">Admin Portal</div>
              <div className="text-xs text-slate-400">Vendor approval & config</div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
          </Link>

          <Link
            to="/buyer"
            className="p-4 bg-slate-800/70 hover:bg-slate-700/70 transition-colors rounded-lg border border-slate-700/50 flex items-center justify-between group"
          >
            <div>
              <div className="font-semibold text-slate-200">Buyer Workspace</div>
              <div className="text-xs text-slate-400">PO lifecycle management</div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
          </Link>

          <Link
            to="/vendor"
            className="p-4 bg-slate-800/70 hover:bg-slate-700/70 transition-colors rounded-lg border border-slate-700/50 flex items-center justify-between group"
          >
            <div>
              <div className="font-semibold text-slate-200">Vendor Workspace</div>
              <div className="text-xs text-slate-400">Onboarding & fulfillment</div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
