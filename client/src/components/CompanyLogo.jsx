import React from 'react';
import { 
  Building2, 
  Cpu, 
  Flame, 
  SunMedium, 
  Stethoscope, 
  Truck, 
  Boxes 
} from 'lucide-react';

/**
 * Renders tailored visual brand badges for each company/vendor.
 */
export const CompanyLogo = ({ name = '', category = '', size = 'md', className = '' }) => {
  const normalized = name.toLowerCase();

  // Size variations
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs rounded-lg',
    md: 'w-10 h-10 text-sm rounded-xl',
    lg: 'w-14 h-14 text-base rounded-2xl',
  }[size] || 'w-10 h-10 text-sm rounded-xl';

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  }[size] || 'w-5 h-5';

  if (normalized.includes('apex')) {
    return (
      <div className={`${sizeClasses} bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-black shadow-sm ring-1 ring-amber-400/40 ${className}`} title={name}>
        <Flame className={iconSizes} />
      </div>
    );
  }

  if (normalized.includes('cybertech')) {
    return (
      <div className={`${sizeClasses} bg-gradient-to-br from-blue-600 to-cyan-600 text-white flex items-center justify-center font-black shadow-sm ring-1 ring-blue-400/40 ${className}`} title={name}>
        <Cpu className={iconSizes} />
      </div>
    );
  }

  if (normalized.includes('titan') || normalized.includes('steel')) {
    return (
      <div className={`${sizeClasses} bg-gradient-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center font-black shadow-sm ring-1 ring-slate-600/40 ${className}`} title={name}>
        <Boxes className={iconSizes} />
      </div>
    );
  }

  if (normalized.includes('zenith') || normalized.includes('solar') || normalized.includes('energy')) {
    return (
      <div className={`${sizeClasses} bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black shadow-sm ring-1 ring-emerald-400/40 ${className}`} title={name}>
        <SunMedium className={iconSizes} />
      </div>
    );
  }

  if (normalized.includes('nova') || normalized.includes('bio') || normalized.includes('med')) {
    return (
      <div className={`${sizeClasses} bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center font-black shadow-sm ring-1 ring-rose-400/40 ${className}`} title={name}>
        <Stethoscope className={iconSizes} />
      </div>
    );
  }

  if (normalized.includes('freight') || normalized.includes('logistics') || normalized.includes('express')) {
    return (
      <div className={`${sizeClasses} bg-gradient-to-br from-indigo-600 to-violet-700 text-white flex items-center justify-center font-black shadow-sm ring-1 ring-indigo-400/40 ${className}`} title={name}>
        <Truck className={iconSizes} />
      </div>
    );
  }

  // Default fallback corporate monogram
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0])
    .join('')
    .toUpperCase() || 'VF';

  return (
    <div className={`${sizeClasses} bg-gradient-to-br from-red-600 to-red-800 text-white flex items-center justify-center font-black shadow-sm ring-1 ring-red-400/40 ${className}`} title={name}>
      <span>{initials}</span>
    </div>
  );
};

export default CompanyLogo;
