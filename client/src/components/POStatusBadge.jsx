import React from 'react';
import { 
  FileEdit, 
  Clock, 
  CheckCircle, 
  Send, 
  CheckCheck, 
  Truck, 
  Receipt, 
  Archive, 
  XCircle, 
  AlertTriangle 
} from 'lucide-react';

export const POStatusBadge = ({ status }) => {
  const statusConfig = {
    Draft: {
      bg: 'bg-slate-700/50 text-slate-300 border-slate-600',
      icon: FileEdit,
    },
    'Pending Approval': {
      bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      icon: Clock,
    },
    Approved: {
      bg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
      icon: CheckCircle,
    },
    Rejected: {
      bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      icon: XCircle,
    },
    Sent: {
      bg: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
      icon: Send,
    },
    Acknowledged: {
      bg: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
      icon: CheckCheck,
    },
    Declined: {
      bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      icon: XCircle,
    },
    Delivered: {
      bg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      icon: Truck,
    },
    Invoiced: {
      bg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      icon: Receipt,
    },
    Closed: {
      bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      icon: Archive,
    },
    Cancelled: {
      bg: 'bg-slate-800 text-slate-400 border-slate-700',
      icon: AlertTriangle,
    },
  };

  const current = statusConfig[status] || statusConfig.Draft;
  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${current.bg} uppercase tracking-wider`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{status}</span>
    </span>
  );
};

export default POStatusBadge;
