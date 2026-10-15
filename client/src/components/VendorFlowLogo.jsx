import React from 'react';

/**
 * Enterprise Brand Logo for VendorFlow Procurement Portal
 * Stylized geometric flow node combined with a corporate shield emblem.
 */
export const VendorFlowLogoIcon = ({ className = "w-8 h-8" }) => (
  <svg 
    viewBox="0 0 48 48" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
  >
    <defs>
      <linearGradient id="vf-grad-primary" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#DC2626" />
        <stop offset="50%" stopColor="#E11D48" />
        <stop offset="100%" stopColor="#991B1B" />
      </linearGradient>
      <linearGradient id="vf-grad-accent" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#F87171" />
        <stop offset="100%" stopColor="#FECDD3" />
      </linearGradient>
      <filter id="vf-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#DC2626" floodOpacity="0.35" />
      </filter>
    </defs>
    
    {/* Outer Rounded Shield Plate */}
    <rect 
      x="4" 
      y="4" 
      width="40" 
      height="40" 
      rx="12" 
      fill="url(#vf-grad-primary)" 
      filter="url(#vf-glow)"
    />
    
    {/* Dynamic Flow Streams (Procurement Lifecycle Node) */}
    {/* Flow Arrow Left-to-Center */}
    <path 
      d="M14 18L21 24L14 30" 
      stroke="white" 
      strokeWidth="3.2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeOpacity="0.95"
    />
    {/* Forward Progress Arrow */}
    <path 
      d="M22 18L29 24L22 30" 
      stroke="url(#vf-grad-accent)" 
      strokeWidth="3.2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    {/* Enterprise Vault Pillar */}
    <circle cx="34" cy="24" r="3.2" fill="white" />
  </svg>
);

export const VendorFlowBrand = ({ showTagline = true, size = "default" }) => {
  const isLarge = size === "large";
  return (
    <div className="flex items-center space-x-3 select-none">
      <VendorFlowLogoIcon className={isLarge ? "w-11 h-11" : "w-9 h-9"} />
      <div className="flex flex-col">
        <div className="flex items-center space-x-2">
          <span className={`font-black tracking-tight text-slate-900 ${isLarge ? 'text-2xl' : 'text-lg'}`}>
            Vendor<span className="text-red-600">Flow</span>
          </span>
          <span className="hidden sm:inline-block text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
            Enterprise B2B
          </span>
        </div>
        {showTagline && (
          <span className="text-[11px] text-slate-500 hidden sm:block font-medium leading-none mt-0.5">
            Procurement Lifecycle & Vendor Intelligence
          </span>
        )}
      </div>
    </div>
  );
};

export default VendorFlowBrand;
