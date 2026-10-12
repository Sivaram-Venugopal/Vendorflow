import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { checkAuthStatus } from './store/slices/authSlice';
import BaseLayout from './layouts/BaseLayout';
import ProtectedRoute from './components/ProtectedRoute';
import OverviewPage from './pages/OverviewPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import BuyerPage from './pages/BuyerPage';
import VendorPage from './pages/VendorPage';

import ErrorBoundary from './components/ErrorBoundary';
import NotFoundPage from './pages/NotFoundPage';

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
          <Route index element={<OverviewPage />} />
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
