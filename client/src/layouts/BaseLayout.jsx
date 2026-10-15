import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, logoutImmediate } from '../store/slices/authSlice';
import NotificationCenter from '../components/NotificationCenter';
import VendorFlowBrand from '../components/VendorFlowLogo';
import {
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
  Shield
} from 'lucide-react';

const BaseLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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
        <NavLink to="/" className="hover:opacity-95 transition-opacity">
          <VendorFlowBrand />
        </NavLink>

        {/* Global Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-xs xl:max-w-md mx-4 lg:mx-8">
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
