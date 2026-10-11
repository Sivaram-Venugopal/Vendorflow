import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Loader2, ShieldAlert } from 'lucide-react';

/**
 * ProtectedRoute Component:
 * 1. Checks if session initialization is complete.
 * 2. Redirects unauthenticated users to /login.
 * 3. Enforces RBAC: verifies if user.role is in allowedRoles.
 * 4. If role is unauthorized, redirects to the user's appropriate default dashboard.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const { user, isAuthenticated, isInitialized } = useSelector((state) => state.auth);

  // While checking httpOnly cookie session on initial mount
  if (!isInitialized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-sky-500 mb-3" />
        <span className="text-sm font-medium">Verifying authorization & session...</span>
      </div>
    );
  }

  // Not authenticated -> redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role authorization
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Map role to their authorized home
    const roleRedirectMap = {
      Admin: '/admin',
      Buyer: '/buyer',
      Vendor: '/vendor',
    };

    const target = roleRedirectMap[user.role] || '/';

    return (
      <div className="max-w-md mx-auto mt-12 p-6 bg-slate-800/80 border border-rose-500/30 rounded-xl text-center">
        <ShieldAlert className="w-12 h-12 text-rose-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white">Access Forbidden (403)</h3>
        <p className="text-xs text-slate-300 mt-2">
          Your role (<span className="text-rose-400 font-semibold">{user.role}</span>) is not permitted to view this workspace.
        </p>
        <div className="mt-4">
          <Navigate to={target} replace />
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
