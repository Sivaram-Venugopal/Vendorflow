import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, logoutImmediate, login } from '../store/slices/authSlice';
import ApiHealthIndicator from '../components/ApiHealthIndicator';
import NotificationCenter from '../components/NotificationCenter';
import {
  Building2,
  ShieldCheck,
  ShoppingBag,
  Truck,
  LogIn,
  LogOut,
  User,
  UserPlus,
  Search,
  ChevronDown,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  HelpCircle
} from 'lucide-react';

const BaseLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSwitchingRole, setIsSwitchingRole] = useState(false);
  const accountMenuRef = useRef(null);

  // Close account menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setAccountMenuOpen(false);
    dispatch(logoutImmediate());
    try {
      await dispatch(logout()).unwrap();
    } catch (e) {
      console.warn('Backend logout warning:', e);
    }
    navigate('/login', { replace: true });
  };

  const handleSwitchRole = async (targetRole) => {
    setAccountMenuOpen(false);
    setIsSwitchingRole(true);
    const credentialsMap = {
      Admin: { email: 'admin@vendorflow.io', password: 'Password123!' },
      Buyer: { email: 'buyer@vendorflow.io', password: 'Password123!' },
      Vendor: { email: 'vendor.apex@example.com', password: 'Password123!' },
    };

    const creds = credentialsMap[targetRole];
    if (creds) {
      try {
        await dispatch(logout()).unwrap().catch(() => {});
        dispatch(logoutImmediate());
        await dispatch(login(creds)).unwrap();
        const roleHome = {
          Admin: '/admin',
          Buyer: '/buyer',
          Vendor: '/vendor',
        }[targetRole];
        navigate(roleHome, { replace: true });
      } catch (err) {
        console.error('Failed to switch role:', err);
      } finally {
        setIsSwitchingRole(false);
      }
    }
  };

  const portals = [
    { 
      name: 'Admin & Governance', 
      path: '/admin', 
      icon: ShieldCheck, 
      role: 'Admin',
      description: 'Vendor Approvals, KYC, Audit Trail'
    },
    { 
      name: 'Buyer Workspace', 
      path: '/buyer', 
      icon: ShoppingBag, 
      role: 'Buyer',
      description: 'PO Generation, Supplier Evaluations'
    },
    { 
      name: 'Supplier Portal', 
      path: '/vendor', 
      icon: Truck, 
      role: 'Vendor',
      description: 'Order Fulfillment, KYC Docs, Scorecard'
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-red-600 selection:text-white">
      {/* Top Crimson Red Accent Strip */}
      <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-rose-500 to-red-700 sticky top-0 z-50 shadow-sm" />

      {/* Top Header - White & Red Corporate Theme */}
      <header className="h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md px-6 flex items-center justify-between sticky top-1.5 z-40 shadow-sm">
        {/* Brand Logo & Name: VendorFlow */}
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-rose-600 to-red-700 flex items-center justify-center shadow-md shadow-red-600/25 border border-red-500/20 text-white">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900">
                Vendor<span className="text-red-600">Flow</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                Enterprise Procurement
              </span>
            </div>
            <span className="text-[11px] text-slate-500 hidden sm:block font-medium">
              Enterprise Supplier Network & Procurement Lifecycle
            </span>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="w-full relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              placeholder="Search suppliers, purchase orders, compliance items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-12 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:bg-white focus:ring-1 focus:ring-red-500 transition-all shadow-inner"
            />
            <span className="absolute right-3.5 top-2.5 text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-xs">
              Ctrl+K
            </span>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center space-x-3">
          <ApiHealthIndicator />
          <NotificationCenter />

          {/* User Account / Profile Button */}
          {isAuthenticated && user ? (
            <div className="relative" ref={accountMenuRef}>
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="flex items-center space-x-2.5 p-1 pl-2.5 pr-2 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all text-left shadow-xs"
              >
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-slate-800 leading-tight">{user.name}</div>
                  <div className="text-[10px] font-bold text-red-600 leading-tight">
                    {user.role}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center ring-2 ring-red-200 shadow-sm">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {/* Account Dropdown Popover */}
              {accountMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-red-200 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="h-1 bg-red-600" />
                  
                  {/* Account Header */}
                  <div className="p-4 bg-red-50/40 border-b border-slate-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-11 h-11 rounded-full bg-red-600 text-white font-bold text-base flex items-center justify-center ring-2 ring-red-200 shadow-sm">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-slate-900 truncate">{user.name}</div>
                        <div className="text-xs text-slate-500 truncate">{user.email}</div>
                        <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">
                          {user.department || 'Procurement Operations'} • {user.role}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Role Switcher Inside Profile Menu */}
                  <div className="p-3 bg-white">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2 mb-2">
                      Switch Active Session Role
                    </div>
                    <div className="space-y-1">
                      <button
                        onClick={() => handleSwitchRole('Admin')}
                        disabled={user.role === 'Admin' || isSwitchingRole}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                          user.role === 'Admin'
                            ? 'bg-red-50 text-red-700 font-bold border border-red-200'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <ShieldCheck className="w-4 h-4 text-red-600" />
                          <span>Administrator</span>
                        </div>
                        {user.role === 'Admin' && (
                          <span className="text-[10px] font-bold text-red-600">Current</span>
                        )}
                      </button>

                      <button
                        onClick={() => handleSwitchRole('Buyer')}
                        disabled={user.role === 'Buyer' || isSwitchingRole}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                          user.role === 'Buyer'
                            ? 'bg-red-50 text-red-700 font-bold border border-red-200'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <ShoppingBag className="w-4 h-4 text-red-600" />
                          <span>Procurement Buyer</span>
                        </div>
                        {user.role === 'Buyer' && (
                          <span className="text-[10px] font-bold text-red-600">Current</span>
                        )}
                      </button>

                      <button
                        onClick={() => handleSwitchRole('Vendor')}
                        disabled={user.role === 'Vendor' || isSwitchingRole}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                          user.role === 'Vendor'
                            ? 'bg-red-50 text-red-700 font-bold border border-red-200'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Truck className="w-4 h-4 text-red-600" />
                          <span>Apex Supplies (Vendor)</span>
                        </div>
                        {user.role === 'Vendor' && (
                          <span className="text-[10px] font-bold text-red-600">Current</span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Sign Out Button */}
                  <div className="p-3 border-t border-slate-100 bg-slate-50/50">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors shadow-sm"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out of VendorFlow</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <NavLink
                to="/login"
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-red-600 bg-white hover:bg-slate-50 border border-slate-200 transition-colors flex items-center space-x-1.5 shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </NavLink>
              <NavLink
                to="/register"
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center space-x-1.5 shadow-sm shadow-red-600/20"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register</span>
              </NavLink>
            </div>
          )}
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex flex-1">
        {/* Navigation Sidebar - Clean White & Red Style */}
        <aside className="w-64 border-r border-slate-200 bg-white p-4 flex flex-col justify-between shadow-xs">
          <div className="space-y-6">
            {/* Enterprise Workspaces */}
            <div>
              <div className="px-3 mb-2.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Enterprise Portals</span>
                <span className="text-[10px] font-mono text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                  RBAC
                </span>
              </div>
              <nav className="space-y-1">
                {portals.map((item) => {
                  const Icon = item.icon;
                  const isUserRole = user?.role === item.role;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-start space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-red-50 text-red-700 border-l-4 border-red-600 font-bold shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="truncate">{item.name}</span>
                          {isUserRole && (
                            <span className="w-2 h-2 rounded-full bg-red-600 ml-1.5" title="Active Role Workspace" />
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            {/* Quick Demo Role Switcher */}
            <div className="p-3 bg-red-50/40 rounded-2xl border border-red-100">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-red-800 uppercase tracking-wider flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-red-600" />
                  <span>Instant Role Switch</span>
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mb-2.5">
                Switch between enterprise roles without re-typing passwords:
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSwitchRole('Admin')}
                  disabled={user?.role === 'Admin' || isSwitchingRole}
                  className={`px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                    user?.role === 'Admin'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchRole('Buyer')}
                  disabled={user?.role === 'Buyer' || isSwitchingRole}
                  className={`px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                    user?.role === 'Buyer'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  Buyer
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchRole('Vendor')}
                  disabled={user?.role === 'Vendor' || isSwitchingRole}
                  className={`px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                    user?.role === 'Vendor'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  Vendor
                </button>
              </div>
            </div>

            {/* Procurement Standards */}
            <div className="px-3 text-[11px] text-slate-500 space-y-1.5">
              <div className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                Procurement Standards
              </div>
              <div className="flex items-center space-x-1.5 text-slate-600">
                <CheckCircle2 className="w-3 h-3 text-red-600" />
                <span>Supplier Code of Conduct</span>
              </div>
              <div className="flex items-center space-x-1.5 text-slate-600">
                <Shield className="w-3 h-3 text-red-600" />
                <span>Zero-Trust RBAC Enforced</span>
              </div>
            </div>
          </div>

          {/* Sidebar Footer User & Sign Out */}
          <div className="pt-4 border-t border-slate-100">
            {isAuthenticated && user ? (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="min-w-0 pr-2">
                  <div className="text-xs font-bold text-slate-800 truncate">{user.name}</div>
                  <div className="text-[10px] font-mono text-red-600 truncate font-semibold">{user.role} Session</div>
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign out of current role"
                  className="p-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 border border-red-200 transition-colors flex-shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="text-center py-2 text-xs text-slate-400">
                <span>Guest Session</span>
              </div>
            )}
          </div>
        </aside>

        {/* Content Viewport */}
        <main className="flex-1 p-6 md:p-8 bg-slate-50/70 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default BaseLayout;
