import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import ApiHealthIndicator from '../components/ApiHealthIndicator';
import { 
  Building2, 
  LayoutDashboard, 
  ShieldCheck, 
  ShoppingBag, 
  Truck, 
  LogIn 
} from 'lucide-react';

const BaseLayout = () => {
  const navItems = [
    { name: 'Admin Portal', path: '/admin', icon: ShieldCheck },
    { name: 'Buyer Workspace', path: '/buyer', icon: ShoppingBag },
    { name: 'Vendor Workspace', path: '/vendor', icon: Truck },
    { name: 'Login', path: '/login', icon: LogIn },
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
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-400">
            <p className="font-semibold text-slate-300">Phase 0: Bootstrap</p>
            <p className="mt-1">MERN Setup & Environment Verification</p>
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
