import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendorsComparison } from '../store/slices/evaluationSlice';
import TierBadge from './TierBadge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { 
  Award, 
  Filter, 
  TrendingUp, 
  Users, 
  RefreshCw,
  Search
} from 'lucide-react';

const VendorTierComparisonView = ({ onSelectVendor }) => {
  const dispatch = useDispatch();
  const { comparisonList, loading } = useSelector((state) => state.evaluation);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTier, setSelectedTier] = useState('All');

  const loadData = () => {
    dispatch(fetchVendorsComparison());
  };

  useEffect(() => {
    loadData();
  }, [dispatch]);

  const filtered = comparisonList.filter((v) => {
    const matchCat = selectedCategory === 'All' || v.category === selectedCategory;
    const matchTier = selectedTier === 'All' || v.ratingTier === selectedTier;
    return matchCat && matchTier;
  });

  // Data formatted for comparison bar chart
  const chartData = filtered.map((v) => ({
    name: v.companyName.length > 15 ? v.companyName.substring(0, 15) + '...' : v.companyName,
    fullName: v.companyName,
    rating: v.overallRating || 0,
    tier: v.ratingTier || 'Approved',
  }));

  // Counts by tier
  const tierCounts = {
    Preferred: comparisonList.filter((v) => v.ratingTier === 'Preferred').length,
    Approved: comparisonList.filter((v) => v.ratingTier === 'Approved').length,
    'On-Watch': comparisonList.filter((v) => v.ratingTier === 'On-Watch').length,
    Blacklisted: comparisonList.filter((v) => v.ratingTier === 'Blacklisted').length,
  };

  return (
    <div className="space-y-6">
      {/* Tier Distribution Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-800/80 rounded-xl border border-emerald-500/30 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-emerald-400 uppercase">Preferred</div>
            <div className="text-2xl font-bold text-white mt-1">{tierCounts.Preferred}</div>
          </div>
          <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
        </div>

        <div className="p-4 bg-slate-800/80 rounded-xl border border-sky-500/30 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-sky-400 uppercase">Approved</div>
            <div className="text-2xl font-bold text-white mt-1">{tierCounts.Approved}</div>
          </div>
          <div className="w-3 h-3 rounded-full bg-sky-400"></div>
        </div>

        <div className="p-4 bg-slate-800/80 rounded-xl border border-amber-500/30 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-amber-400 uppercase">On-Watch</div>
            <div className="text-2xl font-bold text-white mt-1">{tierCounts['On-Watch']}</div>
          </div>
          <div className="w-3 h-3 rounded-full bg-amber-400"></div>
        </div>

        <div className="p-4 bg-slate-800/80 rounded-xl border border-rose-500/30 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-rose-400 uppercase">Blacklisted</div>
            <div className="text-2xl font-bold text-white mt-1">{tierCounts.Blacklisted}</div>
          </div>
          <div className="w-3 h-3 rounded-full bg-rose-400"></div>
        </div>
      </div>

      {/* Bar Chart Comparing Ratings */}
      <div className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700/80 shadow-xl backdrop-blur">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Supplier Performance Comparison Matrix</span>
          </h3>
          <button
            onClick={loadData}
            className="p-1 text-slate-400 hover:text-white"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {chartData.length > 0 ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} angle={-15} textAnchor="end" />
                <YAxis domain={[0, 5]} stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                  formatter={(val, name, item) => [`${val} / 5.0 (${item.payload.tier})`, 'Overall Score']}
                />
                <Bar dataKey="rating" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-xs text-slate-500">
            No supplier rating metrics available.
          </div>
        )}
      </div>

      {/* Full Comparison Table */}
      <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 overflow-hidden shadow-xl backdrop-blur">
        <div className="p-4 border-b border-slate-700/80 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="font-bold text-white text-sm">Vendor Rankings & Tiers ({filtered.length})</div>
          
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400">Tier:</span>
            {['All', 'Preferred', 'Approved', 'On-Watch', 'Blacklisted'].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTier(t)}
                className={`px-2.5 py-0.5 rounded-md font-semibold ${
                  selectedTier === t ? 'bg-sky-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900/60 border-b border-slate-700/60 text-slate-400 uppercase font-semibold">
                <th className="py-3 px-4">Vendor Company</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Rating Tier</th>
                <th className="py-3 px-4">Composite Rating</th>
                <th className="py-3 px-4">KYC Compliance</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50 text-slate-200">
              {filtered.map((v) => (
                <tr key={v._id} className="hover:bg-slate-700/30">
                  <td className="py-3 px-4 font-bold text-white">{v.companyName}</td>
                  <td className="py-3 px-4 text-slate-400">{v.category}</td>
                  <td className="py-3 px-4">
                    <TierBadge tier={v.ratingTier || 'Approved'} />
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-sky-400">
                    {v.overallRating ? v.overallRating.toFixed(1) : 'Unrated'}
                  </td>
                  <td className="py-3 px-4 font-mono">{v.complianceScore || 0}%</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onSelectVendor && onSelectVendor(v)}
                      className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 rounded text-slate-200 font-semibold text-xs"
                    >
                      View Scorecard
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VendorTierComparisonView;
