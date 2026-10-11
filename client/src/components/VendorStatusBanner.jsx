import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle, 
  ShieldCheck, 
  FileText, 
  ArrowRight 
} from 'lucide-react';

const VendorStatusBanner = ({ status, reason, updatedAt, complianceScore }) => {
  const statusConfig = {
    Approved: {
      bg: 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200',
      icon: CheckCircle2,
      iconColor: 'text-emerald-400',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      title: 'Vendor Approved & Active',
      desc: 'Your profile has completed compliance checks and is verified for procurement awards.',
    },
    Pending: {
      bg: 'bg-amber-950/50 border-amber-500/40 text-amber-200',
      icon: Clock,
      iconColor: 'text-amber-400',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      title: 'Onboarding Review in Progress',
      desc: 'Your application is in the admin verification queue. Documents are undergoing compliance review.',
    },
    'Under Review': {
      bg: 'bg-sky-950/50 border-sky-500/40 text-sky-200',
      icon: Clock,
      iconColor: 'text-sky-400',
      badge: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
      title: 'Under Active Audit Review',
      desc: 'The procurement committee is actively verifying your GSTIN, banking and compliance certificates.',
    },
    Rejected: {
      bg: 'bg-rose-950/60 border-rose-500/40 text-rose-200',
      icon: XCircle,
      iconColor: 'text-rose-400',
      badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      title: 'Registration Rejected',
      desc: 'Your vendor onboarding submission could not be approved due to compliance or tax discrepancies.',
    },
  };

  const current = statusConfig[status] || statusConfig.Pending;
  const Icon = current.icon;

  return (
    <div className={`p-5 rounded-2xl border ${current.bg} shadow-lg backdrop-blur mb-6`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className={`p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50 ${current.iconColor} flex-shrink-0 mt-0.5`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-base text-white">{current.title}</h3>
              <span className={`px-2 py-0.5 text-xs font-semibold rounded-md border ${current.badge} uppercase tracking-wider`}>
                {status}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">{current.desc}</p>
            {reason && (
              <div className="mt-2 text-xs bg-slate-900/70 p-2.5 rounded-lg border border-slate-700/60">
                <span className="font-semibold text-slate-200">Admin Remarks:</span>{' '}
                <span className="text-slate-300">{reason}</span>
              </div>
            )}
          </div>
        </div>

        {complianceScore !== undefined && (
          <div className="flex items-center space-x-3 bg-slate-900/70 p-3 rounded-xl border border-slate-700/60 self-start md:self-auto">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Compliance Rating</div>
              <div className="text-xl font-extrabold text-white">{complianceScore}%</div>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-sky-500/40 flex items-center justify-center text-sky-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorStatusBanner;
