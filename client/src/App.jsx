import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BaseLayout from './layouts/BaseLayout';
import OverviewPage from './pages/OverviewPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import BuyerPage from './pages/BuyerPage';
import VendorPage from './pages/VendorPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<BaseLayout />}>
        <Route index element={<OverviewPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="admin" element={<AdminPage />} />
        <Route path="buyer" element={<BuyerPage />} />
        <Route path="vendor" element={<VendorPage />} />
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
