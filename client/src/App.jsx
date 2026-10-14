import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthStatus } from './store/slices/authSlice';
import BaseLayout from './layouts/BaseLayout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import BuyerPage from './pages/BuyerPage';
import VendorPage from './pages/VendorPage';

import ErrorBoundary from './components/ErrorBoundary';
import NotFoundPage from './pages/NotFoundPage';
import { Loader2 } from 'lucide-react';

/**
 * Root Index: Dynamically routes the user to their respective role portal.
 * If not authenticated, redirects directly to /login.
 */
const RootIndex = () => {
  const { user, isAuthenticated, isInitialized } = useSelector((state) => state.auth);

  if (!isInitialized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <Loader2 className="w-9 h-9 animate-spin text-blue-500 mb-3" />
        <span className="text-sm font-medium text-slate-300">Initializing Procurement Portal...</span>
      </div>
    );
  }

  if (isAuthenticated && user) {
    if (user.role === 'Admin') return <Navigate to="/admin" replace />;
    if (user.role === 'Buyer') return <Navigate to="/buyer" replace />;
    if (user.role === 'Vendor') return <Navigate to="/vendor" replace />;
  }

  return <Navigate to="/login" replace />;
};

function App() {
  const dispatch = useDispatch();

  // Check existing session on boot (via httpOnly cookie /api/auth/me)
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<BaseLayout />}>
          {/* Public Routes */}
          <Route index element={<RootIndex />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />

          {/* Protected RBAC Routes */}
          <Route
            path="admin"
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="buyer"
            element={
              <ProtectedRoute allowedRoles={['Buyer', 'Admin']}>
                <BuyerPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="vendor"
            element={
              <ProtectedRoute allowedRoles={['Vendor']}>
                <VendorPage />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
