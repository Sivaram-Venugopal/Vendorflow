import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Loader2, ShieldAlert } from 'lucide-react';

/**
 * ProtectedRoute Component:
 * 1. Checks if session initialization is complete.
 * 2. Redirects unauthenticated users to /login.
 * 3. Enforces RBAC: verifies if user.role is in allowedRoles.
 * 4. If role is unauthorized, renders clean role-guidance screen.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const { user, isAuthenticated, isInitialized } = useSelector((state) => state.auth);

  // While checking httpOnly cookie session on initial mount
  if (!isInitialized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-3" />
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
    const roleRedirectMap = {
      Admin: '/admin',
      Buyer: '/buyer',
      Vendor: '/vendor',
    };

    const target = roleRedirectMap[user.role] || '/login';

    return (
      <div className="max-w-md mx-auto mt-16 p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl text-center">
        <div className="w-14 h-14 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-white tracking-tight">Access Restricted</h3>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
          This workspace requires <span className="text-blue-400 font-semibold">{allowedRoles.join(' or ')}</span> privileges. 
          You are currently signed in as <span className="text-white font-medium">{user.name}</span> with role <span className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 font-mono text-[11px]">{user.role}</span>.
        </p>
        <div className="mt-6 flex flex-col gap-2.5">
          <Link
            to={target}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Go to My {user.role} Workspace
          </Link>
          <Link
            to="/login"
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
          >
            Switch Account / Sign In
          </Link>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
