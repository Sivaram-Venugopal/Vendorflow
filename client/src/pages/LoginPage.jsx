import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login, clearAuthError } from '../store/slices/authSlice';
import { LogIn, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, user, status, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  // Once logged in, redirect user to their role-specific dashboard or previous page
  useEffect(() => {
    if (isAuthenticated && user) {
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else {
        const roleHome = {
          Admin: '/admin',
          Buyer: '/buyer',
          Vendor: '/vendor',
        }[user.role] || '/';
        navigate(roleHome, { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (validationErrors[e.target.name]) {
      setValidationErrors({ ...validationErrors, [e.target.name]: null });
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.email) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      errs.password = 'Password is required';
    }
    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(login(formData));
  };

  const fillQuickLogin = (email, pass) => {
    setFormData({ email, password: pass });
    setValidationErrors({});
  };

  const isLoading = status === 'loading';

  return (
    <div className="max-w-md mx-auto mt-6">
      <div className="p-8 bg-slate-800/80 rounded-2xl border border-slate-700/70 shadow-2xl backdrop-blur">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-sky-500/10 text-sky-400 rounded-xl flex items-center justify-center mx-auto mb-3 border border-sky-500/20">
            <LogIn className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Sign In to VendorFlow</h2>
          <p className="text-xs text-slate-400 mt-1">Enter your credentials to access your procurement portal</p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center space-x-2 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{typeof error === 'string' ? error : 'Authentication failed'}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@domain.com"
                className={`w-full pl-9 pr-3 py-2 bg-slate-900/80 border rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors ${
                  validationErrors.email ? 'border-rose-500' : 'border-slate-700'
                }`}
              />
            </div>
            {validationErrors.email && (
              <p className="text-rose-400 text-xs mt-1">{validationErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••••"
                className={`w-full pl-9 pr-3 py-2 bg-slate-900/80 border rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors ${
                  validationErrors.password ? 'border-rose-500' : 'border-slate-700'
                }`}
              />
            </div>
            {validationErrors.password && (
              <p className="text-rose-400 text-xs mt-1">{validationErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-sm font-semibold flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-sky-400 hover:text-sky-300 font-semibold underline">
            Register here
          </Link>
        </div>

        {/* Quick Demo Credentials */}
        <div className="mt-6 pt-5 border-t border-slate-700/60">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Quick Fill Demo Accounts:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillQuickLogin('admin@vendorflow.io', 'Password123!')}
              className="px-2 py-1 bg-slate-900/70 hover:bg-slate-700 border border-slate-700 rounded text-[11px] text-slate-300 transition-colors"
            >
              Admin Demo
            </button>
            <button
              type="button"
              onClick={() => fillQuickLogin('buyer@vendorflow.io', 'Password123!')}
              className="px-2 py-1 bg-slate-900/70 hover:bg-slate-700 border border-slate-700 rounded text-[11px] text-slate-300 transition-colors"
            >
              Buyer Demo
            </button>
            <button
              type="button"
              onClick={() => fillQuickLogin('vendor.apex@example.com', 'Password123!')}
              className="px-2 py-1 bg-slate-900/70 hover:bg-slate-700 border border-slate-700 rounded text-[11px] text-slate-300 transition-colors"
            >
              Vendor Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
