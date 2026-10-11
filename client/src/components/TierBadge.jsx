import React from 'react';
import { Award, ShieldAlert, CheckCircle, Clock } from 'lucide-react';

export const TierBadge = ({ tier }) => {
  const tierConfig = {
    Preferred: {
      bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      icon: Award,
      label: 'Preferred Partner',
    },
    Approved: {
      bg: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
      icon: CheckCircle,
      label: 'Approved Supplier',
    },
    'On-Watch': {
      bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      icon: Clock,
      label: 'On-Watch (Conditional)',
    },
    Blacklisted: {
      bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      icon: ShieldAlert,
      label: 'Blacklisted (Restricted)',
    },
  };

  const current = tierConfig[tier] || tierConfig.Approved;
  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${current.bg} uppercase tracking-wider`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{current.label}</span>
    </span>
  );
};

export default TierBadge;
