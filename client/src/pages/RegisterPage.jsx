import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register, clearAuthError } from '../store/slices/authSlice';
import { UserPlus, Lock, Mail, User, Briefcase, AlertCircle, Loader2 } from 'lucide-react';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user, status, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Buyer',
    department: 'Procurement',
  });

  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      const roleHome = {
        Admin: '/admin',
        Buyer: '/buyer',
        Vendor: '/vendor',
      }[user.role] || '/';
      navigate(roleHome, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (validationErrors[e.target.name]) {
      setValidationErrors({ ...validationErrors, [e.target.name]: null });
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(
      register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        department: formData.department,
      })
    );
  };

  const isLoading = status === 'loading';

  return (
    <div className="max-w-md mx-auto mt-6">
      <div className="p-8 bg-slate-800/80 rounded-2xl border border-slate-700/70 shadow-2xl backdrop-blur">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center mx-auto mb-3 border border-indigo-500/20">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Create VendorFlow Account</h2>
          <p className="text-xs text-slate-400 mt-1">Register as Admin, Buyer, or Vendor</p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center space-x-2 text-rose-400 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{typeof error === 'string' ? error : 'Registration failed'}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                className={`w-full pl-9 pr-3 py-2 bg-slate-900/80 border rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors ${
                  validationErrors.name ? 'border-rose-500' : 'border-slate-700'
                }`}
              />
            </div>
            {validationErrors.name && (
              <p className="text-rose-400 text-xs mt-1">{validationErrors.name}</p>
            )}
          </div>

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
                placeholder="jane@company.com"
                className={`w-full pl-9 pr-3 py-2 bg-slate-900/80 border rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors ${
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
              Portal Role
            </label>
            <div className="relative">
              <Briefcase className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 bg-slate-900/80 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="Buyer">Buyer (Procurement Operations)</option>
                <option value="Vendor">Vendor (Supplier Portal)</option>
                <option value="Admin">Admin (Governance & Approvals)</option>
              </select>
            </div>
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
                placeholder="At least 6 characters"
                className={`w-full pl-9 pr-3 py-2 bg-slate-900/80 border rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors ${
                  validationErrors.password ? 'border-rose-500' : 'border-slate-700'
                }`}
              />
            </div>
            {validationErrors.password && (
              <p className="text-rose-400 text-xs mt-1">{validationErrors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-type password"
                className={`w-full pl-9 pr-3 py-2 bg-slate-900/80 border rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors ${
                  validationErrors.confirmPassword ? 'border-rose-500' : 'border-slate-700'
                }`}
              />
            </div>
            {validationErrors.confirmPassword && (
              <p className="text-rose-400 text-xs mt-1">{validationErrors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
