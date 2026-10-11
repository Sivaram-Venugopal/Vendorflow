import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import ApiHealthIndicator from '../components/ApiHealthIndicator';
import NotificationCenter from '../components/NotificationCenter';
import {
  Building2,
  LayoutDashboard,
  ShieldCheck,
  ShoppingBag,
  Truck,
  LogIn,
  LogOut,
  User,
  UserPlus,
} from 'lucide-react';

const BaseLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navItems = [
    { name: 'Admin Portal', path: '/admin', icon: ShieldCheck, role: 'Admin' },
    { name: 'Buyer Workspace', path: '/buyer', icon: ShoppingBag, role: 'Buyer' },
    { name: 'Vendor Workspace', path: '/vendor', icon: Truck, role: 'Vendor' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
      {/* Top Navigation */}
      <header className="h-16 border-b border-slate-800 bg-slate-950/70 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              VendorFlow
            </span>
            <span className="ml-2 text-xs font-mono uppercase px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">
              Procurement Portal
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <ApiHealthIndicator />
          <NotificationCenter />

          {/* User Auth Status / Action in Header */}
          {isAuthenticated && user ? (
            <div className="flex items-center space-x-3 pl-2 border-l border-slate-800">
              <div className="text-right">
                <div className="text-xs font-semibold text-white">{user.name}</div>
                <div className="text-[10px] font-mono uppercase text-sky-400 bg-sky-950/60 px-1.5 py-0.5 rounded border border-sky-800/60 inline-block">
                  {user.role}
                </div>
              </div>
              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
              <NavLink
                to="/login"
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center space-x-1"
              >
                <LogIn className="w-3.5 h-3.5 mr-1" />
                <span>Login</span>
              </NavLink>
              <NavLink
                to="/register"
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-sky-600 hover:bg-sky-500 transition-colors flex items-center space-x-1"
              >
                <UserPlus className="w-3.5 h-3.5 mr-1" />
                <span>Register</span>
              </NavLink>
            </div>
          )}
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-800 bg-slate-950/50 p-4 flex flex-col justify-between">
          <div>
            <div className="px-3 mb-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Navigation
            </div>
            <nav className="space-y-1">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Overview</span>
              </NavLink>

              {navItems.map((item) => {
                const Icon = item.icon;
                const isCurrentRole = user?.role === item.role;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-sky-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span className="flex-1">{item.name}</span>
                    {isCurrentRole && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    )}
                  </NavLink>
                );
              })}

              {!isAuthenticated && (
                <>
                  <div className="pt-4 px-3 mb-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Authentication
                  </div>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-sky-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`
                    }
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </NavLink>
                  <NavLink
                    to="/register"
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-sky-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`
                    }
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Register</span>
                  </NavLink>
                </>
              )}
            </nav>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-400">
            <p className="font-semibold text-slate-300">Phase 2: Auth & RBAC</p>
            <p className="mt-1">
              Active User: {user ? `${user.name} (${user.role})` : 'Guest / Logged Out'}
            </p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-8 bg-slate-900/60 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default BaseLayout;
