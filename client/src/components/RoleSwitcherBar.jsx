import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, logout, logoutImmediate } from '../store/slices/authSlice';
import { 
  ShieldCheck, 
  ShoppingBag, 
  Truck, 
  Loader2, 
  Sparkles,
  ChevronDown
} from 'lucide-react';

export const RoleSwitcherBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [switchingTo, setSwitchingTo] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null); // 'Buyer' | 'Vendor' | null

  // Profiles available for 1-click switching
  const demoAccounts = {
    Admin: [
      { name: 'Sarah Chen (Admin)', email: 'admin@vendorflow.io', role: 'Admin', desc: 'Governance, KYC & Audit' }
    ],
    Buyer: [
      { name: 'Michael Scott (Buyer)', email: 'buyer@vendorflow.io', role: 'Buyer', desc: 'Direct Materials & Fasteners' },
      { name: 'Elena Rostova (Buyer)', email: 'elena.buyer@vendorflow.io', role: 'Buyer', desc: 'IT Hardware & Cloud' },
      { name: 'David Kim (Buyer)', email: 'david.buyer@vendorflow.io', role: 'Buyer', desc: 'Chemicals & Packaging' },
      { name: 'Priya Nambiar (Buyer)', email: 'priya.buyer@vendorflow.io', role: 'Buyer', desc: 'Industrial Automation' }
    ],
    Vendor: [
      { name: 'Rajesh Sharma (Apex)', email: 'vendor.apex@example.com', role: 'Vendor', desc: 'Raw Materials & Alloys' },
      { name: 'Anita Desai (CyberTech)', email: 'vendor.cyber@example.com', role: 'Vendor', desc: 'Networking & Hardware' },
      { name: 'Vikram Malhotra (TitanSteel)', email: 'vendor.titan@example.com', role: 'Vendor', desc: 'Forgings & Castings' },
      { name: 'Sunil Rao (Zenith Solar)', email: 'vendor.zenith@example.com', role: 'Vendor', desc: 'Solar & Renewable Tech' }
    ]
  };

  const handleSwitch = async (account) => {
    if (user?.email === account.email) return;

    setSwitchingTo(account.role);
    setDropdownOpen(null);

    try {
      await dispatch(logout()).unwrap().catch(() => {});
      dispatch(logoutImmediate());

      await dispatch(login({
        email: account.email,
        password: 'Password123!'
      })).unwrap();

      const routes = {
        Admin: '/admin',
        Buyer: '/buyer',
        Vendor: '/vendor'
      };

      navigate(routes[account.role] || '/', { replace: true });
    } catch (err) {
      console.error('Failed to switch demo role:', err);
    } finally {
      setSwitchingTo(null);
    }
  };

  const roles = [
    { key: 'Admin', label: 'Admin', icon: ShieldCheck, color: 'text-red-700 bg-red-100 border-red-300' },
    { key: 'Buyer', label: 'Buyer', icon: ShoppingBag, color: 'text-rose-700 bg-rose-100 border-rose-300' },
    { key: 'Vendor', label: 'Vendor', icon: Truck, color: 'text-amber-800 bg-amber-100 border-amber-300' },
  ];

  return (
    <div className="flex items-center space-x-1.5 bg-slate-100/80 p-1 rounded-2xl border border-slate-200 shadow-inner">
      <div className="hidden lg:flex items-center space-x-1 px-2 text-[10px] font-black uppercase tracking-wider text-slate-500">
        <Sparkles className="w-3 h-3 text-red-600 animate-pulse" />
        <span>Demo Switch:</span>
      </div>

      {roles.map((r) => {
        const Icon = r.icon;
        const isActive = user?.role === r.key;
        const isSwitching = switchingTo === r.key;
        const subAccounts = demoAccounts[r.key];

        return (
          <div key={r.key} className="relative">
            <div className="inline-flex rounded-xl shadow-xs">
              {/* Primary 1-Click Switch Button */}
              <button
                type="button"
                onClick={() => handleSwitch(subAccounts[0])}
                disabled={isSwitching || (isActive && !subAccounts.length)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-red-600 text-white shadow-sm ring-1 ring-red-400'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                }`}
                title={`Switch instantly to ${r.label} role`}
              >
                {isSwitching ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-red-600'}`} />
                )}
                <span>{r.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
                )}
              </button>

              {/* Optional sub-account picker for multi-buyer/vendor */}
              {subAccounts.length > 1 && (
                <button
                  type="button"
                  onClick={() => setDropdownOpen(dropdownOpen === r.key ? null : r.key)}
                  className={`px-1.5 py-1.5 text-xs font-bold rounded-r-xl border-l transition-all -ml-1 ${
                    isActive
                      ? 'bg-red-700 text-white border-red-500 hover:bg-red-800'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                  title={`Select specific ${r.label}`}
                >
                  <ChevronDown className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Dropdown Menu for choosing alternate persona */}
            {dropdownOpen === r.key && (
              <div 
                className="absolute left-0 mt-1 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-1 animate-in fade-in slide-in-from-top-1 duration-150"
                onMouseLeave={() => setDropdownOpen(null)}
              >
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  Select {r.label} Account
                </div>
                <div className="space-y-0.5 mt-1">
                  {subAccounts.map((acc, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSwitch(acc)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex flex-col ${
                        user?.email === acc.email
                          ? 'bg-red-50 text-red-700 font-bold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="font-bold">{acc.name}</span>
                      <span className="text-[10px] text-slate-400">{acc.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RoleSwitcherBar;
