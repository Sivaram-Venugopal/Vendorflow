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

function App() {
  const dispatch = useDispatch();

  // Check existing session on boot (via httpOnly cookie /api/auth/me)
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return (
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
        <Route
          path="*"
          element={
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-white">404 - Page Not Found</h2>
              <p className="text-slate-400 mt-2">The page you requested does not exist.</p>
            </div>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
