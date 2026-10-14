import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import TierBadge from './TierBadge';
import { 
  Award, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  FileText, 
  Calendar 
} from 'lucide-react';

const VendorScorecardView = ({ vendor, evaluations = [] }) => {
  if (!vendor) return null;

  // Format historical scores for Recharts time-series line chart
  const timeSeriesData = evaluations.map((item, idx) => ({
    name: item.period || `Eval ${idx + 1}`,
    score: item.overallScore,
    quality: item.qualityScore,
    delivery: item.deliveryScore,
    pricing: item.pricingScore,
    compliance: item.complianceScore,
    date: new Date(item.createdAt).toLocaleDateString(),
  }));

  // Latest evaluation for per-KPI radar / breakdown
  const latestEval = evaluations.length > 0 ? evaluations[evaluations.length - 1] : null;

  const radarData = latestEval
    ? [
        { subject: 'Quality', score: latestEval.qualityScore, fullMark: 5 },
        { subject: 'Delivery', score: latestEval.deliveryScore, fullMark: 5 },
        { subject: 'Pricing', score: latestEval.pricingScore, fullMark: 5 },
        { subject: 'Compliance', score: latestEval.complianceScore, fullMark: 5 },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Top Summary Banner */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-slate-500 font-bold">Vendor Scorecard</div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-0.5">{vendor.companyName}</h2>
          <div className="text-xs text-slate-500 mt-1">
            Category: <span className="text-slate-800 font-semibold">{vendor.category}</span> • Evaluations Completed: <span className="text-slate-900 font-bold">{evaluations.length}</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-slate-500">Current Rating</div>
            <div className="text-2xl font-black text-indigo-600 font-mono">
              {vendor.overallRating ? vendor.overallRating.toFixed(1) : 'N/A'} <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
            </div>
          </div>
          <TierBadge tier={vendor.ratingTier || 'Approved'} />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Over Time Line Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span>Score History & Performance Trend</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">Scale: 1.0 to 5.0</span>
          </div>

          {timeSeriesData.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesData} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                  <YAxis domain={[1, 5]} stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#4f46e5' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    dot={{ fill: '#6366f1', r: 5 }}
                    activeDot={{ r: 8 }}
                    name="Weighted Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
              No historical evaluation milestones recorded yet.
            </div>
          )}
        </div>

        {/* Per-KPI Radar / Balance Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h3 className="text-sm font-extrabold text-slate-900 mb-2">KPI Dimension Balance</h3>
          {latestEval ? (
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={11} />
                  <PolarRadiusAxis domain={[0, 5]} stroke="#94a3b8" fontSize={9} />
                  <Radar name="KPI Score" dataKey="score" stroke="#4f46e5" fill="#6366f1" fillOpacity={0.4} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '11px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
              Awaiting initial audit.
            </div>
          )}
        </div>
      </div>

      {/* Historical Evaluations Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-sm">Detailed Evaluation History</h3>
          <span className="text-xs text-slate-500 font-bold">{evaluations.length} Audits Logged</span>
        </div>

        {evaluations.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No evaluations completed for this vendor yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase font-bold text-[11px] tracking-wider">
                  <th className="py-3 px-4">Period</th>
                  <th className="py-3 px-4">Weighted Score</th>
                  <th className="py-3 px-4">Tier Awarded</th>
                  <th className="py-3 px-4">Quality (35%)</th>
                  <th className="py-3 px-4">Delivery (25%)</th>
                  <th className="py-3 px-4">Pricing (20%)</th>
                  <th className="py-3 px-4">Compliance (20%)</th>
                  <th className="py-3 px-4">Evaluator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {evaluations.map((ev) => (
                  <tr key={ev._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{ev.period}</td>
                    <td className="py-3 px-4 font-mono font-bold text-indigo-600">{ev.overallScore.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <TierBadge tier={ev.ratingTier} />
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">{ev.qualityScore.toFixed(1)}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">{ev.deliveryScore.toFixed(1)}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">{ev.pricingScore.toFixed(1)}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">{ev.complianceScore.toFixed(1)}</td>
                    <td className="py-3 px-4 text-slate-500">{ev.evaluator?.name || 'Procurement Desk'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorScorecardView;
