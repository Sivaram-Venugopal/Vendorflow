import React from 'react';
import { LogIn, Lock } from 'lucide-react';

const LoginPage = () => {
  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-slate-800/60 rounded-2xl border border-slate-700/60 shadow-xl backdrop-blur">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-sky-500/10 text-sky-400 rounded-xl flex items-center justify-center mx-auto mb-3 border border-sky-500/20">
          <LogIn className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">Sign In to VendorFlow</h2>
        <p className="text-xs text-slate-400 mt-1">Authentication placeholder for Phase 1</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Email Address
          </label>
          <input
            type="email"
            disabled
            placeholder="user@vendorflow.io"
            className="w-full px-3 py-2 bg-slate-900/60 border border-slate-700 rounded-lg text-sm text-slate-400 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Password
          </label>
          <input
            type="password"
            disabled
            placeholder="••••••••••••"
            className="w-full px-3 py-2 bg-slate-900/60 border border-slate-700 rounded-lg text-sm text-slate-400 cursor-not-allowed"
          />
        </div>

        <button
          disabled
          className="w-full py-2.5 bg-sky-600/50 text-slate-300 rounded-lg text-sm font-semibold flex items-center justify-center space-x-2 cursor-not-allowed"
        >
          <Lock className="w-4 h-4" />
          <span>Login (Phase 1 Auth Module)</span>
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
