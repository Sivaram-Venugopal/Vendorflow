import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShoppingBag, 
  Truck, 
  HelpCircle, 
  X, 
  CheckCircle2, 
  ArrowRight,
  FileSpreadsheet,
  Award,
  Layers,
  Scale
} from 'lucide-react';

export const RoleGuideModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('Overview');

  if (!isOpen) return null;

  const roleDefinitions = {
    Admin: {
      title: 'Administrator (Procurement Governance & Compliance Officer)',
      icon: ShieldCheck,
      color: 'red',
      badge: 'Governance & Auditing',
      summary: 'In real-world enterprises, the Admin is NOT the person buying items. Instead, the Admin sets procurement policies, verifies legal/KYC compliance of suppliers, enforces anti-fraud controls, and maintains tamper-evident audit logs.',
      responsibilities: [
        'Supplier KYC & Legal Vetting: Audits GSTIN, PAN cards, bank accounts, and corporate registrations before allowing suppliers to transact.',
        'Policy & Spend Governance: Enforces company spend ceilings, role-based approval limits, and anti-bribery / anti-fraud compliance.',
        'User & System Access Control: Manages procurement buyer accounts, supplier credentials, and permissions.',
        'Tamper-Evident Audit Logging: Reviews immutable transaction logs (timestamps, IP addresses, entity mutations) for statutory regulatory audits.'
      ],
      typicalPersona: 'Chief Procurement Officer (CPO), Internal Compliance Auditor, or Supply Chain IT Director.'
    },
    Buyer: {
      title: 'Procurement Buyer (Sourcing & Purchasing Specialist)',
      icon: ShoppingBag,
      color: 'rose',
      badge: 'Demand & Contracting',
      summary: 'The Buyer is an internal enterprise employee responsible for fulfilling departmental supply needs. They create Purchase Orders (POs), negotiate commercial terms with approved suppliers, and evaluate vendor performance.',
      responsibilities: [
        'Purchase Order (PO) Issuance: Generates legally binding Purchase Orders detailing item SKUs, quantities, contracted unit prices, delivery deadlines, and tax (GST) calculations.',
        'Supplier Selection: Browses the catalog of pre-approved suppliers to select optimal vendors based on tier ratings, cost, and historical lead times.',
        'Quarterly Vendor Evaluations: Grades vendors on Quality, On-Time Delivery, Pricing Stability, and Compliance to determine supplier tiering (Gold, Silver, Bronze).',
        'Order Lifecycle Tracking: Monitors order states from draft, acknowledgment, to delivery verification and three-way invoice matching.'
      ],
      typicalPersona: 'Strategic Sourcing Manager, Category Lead, or Materials Procurement Specialist.'
    },
    Vendor: {
      title: 'Vendor / Supplier (External Commercial Partner)',
      icon: Truck,
      color: 'slate',
      badge: 'Fulfillment & Invoicing',
      summary: 'The Vendor is the external commercial entity providing goods, raw materials, or services to the enterprise. They interact through the portal to submit regulatory credentials, acknowledge orders, update delivery milestones, and submit commercial invoices.',
      responsibilities: [
        'Self-Serve Onboarding: Submits business registration, GSTIN, MSME certificates, bank accounts, and tax credentials for compliance verification.',
        'PO Acknowledgment & Commitment: Reviews received Purchase Orders and accepts delivery schedules and quality terms.',
        'Fulfillment & Shipment Tracking: Updates production and shipping progress (e.g. In Fulfillment -> Dispatched -> Delivered).',
        'Invoice Submission & Scorecard Review: Registers commercial invoices against fulfilled POs and reviews their vendor scorecard rating.'
      ],
      typicalPersona: 'Key Account Executive, Commercial Sales Director, or Supply Chain Dispatch Manager.'
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/30 border border-red-500/40 flex items-center justify-center">
              <Scale className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight text-white flex items-center space-x-2">
                <span>Enterprise Roles & Procurement Workflow Guide</span>
              </h3>
              <p className="text-xs text-slate-300">
                Industry-standard responsibilities for Admin, Buyer, and Vendor in B2B supply chains
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2">
          {['Overview', 'Admin', 'Buyer', 'Vendor', 'PO vs Buy Order'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
                activeTab === tab
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 flex-1">
          {activeTab === 'Overview' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-red-50 border border-red-100">
                <h4 className="text-sm font-extrabold text-red-900 mb-1 flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-red-600" />
                  <span>The Real-World 3-Party Procurement Dynamic</span>
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  In enterprise procurement, strict separation of concerns prevents financial fraud and operational bottlenecks. 
                  No single actor has full unilateral authority.
                </p>
              </div>

              {/* 3 Columns Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Admin Card */}
                <div className="p-4 rounded-2xl border border-red-200 bg-white shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <ShieldCheck className="w-5 h-5 text-red-600" />
                      <span className="font-extrabold text-xs uppercase tracking-wider text-red-700">1. Admin (Governance)</span>
                    </div>
                    <p className="text-xs text-slate-600 mb-3">
                      Approves vendors after checking GSTIN & bank credentials. Monitors audit trails for compliance.
                    </p>
                  </div>
                  <div className="text-[10px] font-mono text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                    "Is this vendor legitimate, solvent, and certified?"
                  </div>
                </div>

                {/* Buyer Card */}
                <div className="p-4 rounded-2xl border border-rose-200 bg-white shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <ShoppingBag className="w-5 h-5 text-rose-600" />
                      <span className="font-extrabold text-xs uppercase tracking-wider text-rose-700">2. Buyer (Purchasing)</span>
                    </div>
                    <p className="text-xs text-slate-600 mb-3">
                      Creates Purchase Orders (PO), calculates GST, manages delivery deadlines, and evaluates vendor quality.
                    </p>
                  </div>
                  <div className="text-[10px] font-mono text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200">
                    "I need 50 units of raw materials delivered by Nov 15th."
                  </div>
                </div>

                {/* Vendor Card */}
                <div className="p-4 rounded-2xl border border-slate-300 bg-white shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Truck className="w-5 h-5 text-slate-700" />
                      <span className="font-extrabold text-xs uppercase tracking-wider text-slate-800">3. Vendor (Supplier)</span>
                    </div>
                    <p className="text-xs text-slate-600 mb-3">
                      Submits KYC docs, accepts POs, updates manufacturing & shipping status, and submits invoices.
                    </p>
                  </div>
                  <div className="text-[10px] font-mono text-slate-700 bg-slate-100 p-2 rounded-lg border border-slate-300">
                    "Order accepted. Dispatched with tracking #TRK-8821."
                  </div>
                </div>
              </div>

              {/* Complete Step by Step Workflow */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <h5 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-3">
                  End-to-End Enterprise Procurement Lifecycle:
                </h5>
                <ol className="space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-start space-x-2.5">
                    <span className="w-5 h-5 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">1</span>
                    <span><strong>Onboarding & KYC:</strong> Vendor registers company profile & uploads statutory tax documents (GST/PAN).</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <span className="w-5 h-5 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">2</span>
                    <span><strong>Admin Verification:</strong> Administrator verifies documents and sets vendor status to <span className="text-emerald-600 font-bold">Approved</span>.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <span className="w-5 h-5 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">3</span>
                    <span><strong>PO Creation:</strong> Enterprise Buyer builds a Purchase Order with line items, quantities, and GST.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <span className="w-5 h-5 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">4</span>
                    <span><strong>Order Fulfillment:</strong> Vendor receives the PO, acknowledges it, and updates delivery tracking.</span>
                  </li>
                  <li className="flex items-start space-x-2.5">
                    <span className="w-5 h-5 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">5</span>
                    <span><strong>Evaluation & Tiering:</strong> Buyer evaluates delivery quality and system updates Vendor Scorecard & Tier (Gold / Silver / Bronze).</span>
                  </li>
                </ol>
              </div>
            </div>
          )}

          {['Admin', 'Buyer', 'Vendor'].includes(activeTab) && (
            <div className="space-y-6">
              {(() => {
                const role = roleDefinitions[activeTab];
                const RoleIcon = role.icon;
                return (
                  <>
                    <div className="p-5 rounded-2xl bg-red-50/60 border border-red-100 flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                        <RoleIcon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-base font-black text-slate-900">{role.title}</h4>
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200">
                            {role.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{role.summary}</p>
                        <p className="text-[11px] text-slate-500 mt-2">
                          <strong>Industry Equivalent:</strong> {role.typicalPersona}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-3">
                        Key Real-World Responsibilities:
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {role.responsibilities.map((item, idx) => (
                          <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-start space-x-2.5 shadow-2xs">
                            <CheckCircle2 className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                            <span className="text-xs text-slate-700 leading-snug">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {activeTab === 'PO vs Buy Order' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <h4 className="text-sm font-black text-amber-900 mb-1">
                  Why "Purchase Order (PO)" is the Industry Standard for this Project
                </h4>
                <p className="text-xs text-amber-800 leading-relaxed">
                  In enterprise supply chains and procurement engineering (SAP Ariba, Oracle SCM, Coupa), the formal legally-binding document is exclusively termed a <strong>Purchase Order (PO)</strong>.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border-2 border-emerald-500/30 bg-emerald-50/20">
                  <div className="text-xs font-black text-emerald-800 uppercase tracking-wider mb-2">
                    ✅ Purchase Order (PO) - B2B Procurement
                  </div>
                  <ul className="text-xs text-slate-700 space-y-2 list-disc pl-4">
                    <li>Legally binding contract between enterprise Buyer and Vendor.</li>
                    <li>Specifies exact Item SKUs, quantities, delivery address, GSTIN, payment terms, and warranty.</li>
                    <li>Follows a 6-stage finite state machine: <code>Draft → Sent → Acknowledged → In Fulfillment → Delivered → Closed</code>.</li>
                    <li>Required by accounting for 3-way invoice reconciliation.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                  <div className="text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                    ℹ️ "Buy Order" - Financial Trading Term
                  </div>
                  <ul className="text-xs text-slate-600 space-y-2 list-disc pl-4">
                    <li>Typically used on stock exchanges (NSE/BSE, NASDAQ) or crypto trading desks to buy securities.</li>
                    <li>Lacks vendor onboarding, GST compliance, line-item shipping inspection, or milestone delivery tracking.</li>
                    <li>Not suitable for enterprise vendor management or ERP course projects.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm shadow-red-600/20"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleGuideModal;
