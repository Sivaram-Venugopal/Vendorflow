import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Compass, ArrowLeft, Home } from 'lucide-react';

const NotFoundPage = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const homeRoute = !isAuthenticated
    ? '/'
    : user?.role === 'Admin'
    ? '/admin'
    : user?.role === 'Procurement'
    ? '/buyer'
    : '/vendor';

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-6">
      <div className="w-20 h-20 bg-amber-500/10 text-amber-400 rounded-3xl flex items-center justify-center border border-amber-500/20 shadow-2xl">
        <Compass className="w-10 h-10 animate-pulse" />
      </div>

      <div className="space-y-2 max-w-md">
        <div className="text-4xl font-black text-white tracking-tight">404</div>
        <h1 className="text-xl font-bold text-slate-200">Page Not Found</h1>
        <p className="text-xs text-slate-400">
          The requested URL path was not found in the VendorFlow procurement portal. Please verify the link or navigate back to your workspace.
        </p>
      </div>

      <div className="flex items-center space-x-3 pt-2">
        <Link
          to="/"
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          <span>System Overview</span>
        </Link>

        <Link
          to={homeRoute}
          className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-lg shadow-teal-600/20"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Workspace</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
