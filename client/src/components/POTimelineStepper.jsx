import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  XCircle, 
  AlertTriangle, 
  User, 
  Calendar 
} from 'lucide-react';

const STANDARD_STEPS = [
  'Draft',
  'Pending Approval',
  'Approved',
  'Sent',
  'Acknowledged',
  'Delivered',
  'Invoiced',
  'Closed',
];

export const POTimelineStepper = ({ currentStatus, history = [] }) => {
  const isCancelled = currentStatus === 'Cancelled';
  const isRejected = currentStatus === 'Rejected';
  const isDeclined = currentStatus === 'Declined';

  const currentStepIndex = STANDARD_STEPS.indexOf(currentStatus);

  return (
    <div className="space-y-6">
      {/* Visual Stepper Bar */}
      <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-700/80 overflow-x-auto">
        <div className="flex items-center min-w-[700px] justify-between relative">
          {STANDARD_STEPS.map((step, idx) => {
            const isCompleted = currentStepIndex > idx || currentStatus === 'Closed';
            const isCurrent = currentStatus === step;

            return (
              <div key={step} className="flex-1 flex flex-col items-center relative z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                    isCurrent
                      ? 'bg-sky-600 border-sky-400 text-white ring-4 ring-sky-500/20'
                      : isCompleted
                      ? 'bg-emerald-600 border-emerald-400 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-500'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>

                <span
                  className={`text-[11px] font-semibold mt-2 text-center uppercase tracking-wider ${
                    isCurrent
                      ? 'text-sky-400 font-bold'
                      : isCompleted
                      ? 'text-emerald-400'
                      : 'text-slate-500'
                  }`}
                >
                  {step}
                </span>
              </div>
            );
          })}

          {/* Exception Branch Badges if Rejected / Declined / Cancelled */}
          {(isCancelled || isRejected || isDeclined) && (
            <div className="absolute right-0 top-0 -mt-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-rose-950 text-rose-300 border border-rose-800">
                Branched: {currentStatus}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Append-Only Transition History Audit Feed */}
      <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-6 shadow-xl backdrop-blur">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center space-x-2">
          <Clock className="w-4 h-4 text-sky-400" />
          <span>FSM Transition Audit History ({history.length} Events)</span>
        </h4>

        {history.length === 0 ? (
          <div className="text-xs text-slate-500 text-center py-4">
            No status transitions recorded yet.
          </div>
        ) : (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-700">
            {history.map((event, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-sky-500 ring-4 ring-slate-900"></div>
                <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/60 space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                    <div className="font-bold text-white flex items-center space-x-2">
                      <span className="text-slate-400">{event.fromStatus}</span>
                      <span className="text-sky-400">→</span>
                      <span className="text-emerald-400">{event.toStatus}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(event.timestamp).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 flex items-center space-x-1.5 pt-1">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>
                      Actor: <span className="text-white font-medium">{event.actorName || event.actor?.name || 'System'}</span> ({event.actorRole || event.actor?.role || 'Admin'})
                    </span>
                  </div>

                  {event.remarks && (
                    <p className="text-xs text-slate-400 italic pt-1 border-t border-slate-800">
                      "{event.remarks}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default POTimelineStepper;
