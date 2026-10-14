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
        <div className="p-4 bg-white rounded-2xl border border-emerald-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-emerald-700 uppercase">Preferred</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{tierCounts.Preferred}</div>
          </div>
          <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100"></div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-sky-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-sky-700 uppercase">Approved</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{tierCounts.Approved}</div>
          </div>
          <div className="w-3.5 h-3.5 rounded-full bg-sky-500 ring-4 ring-sky-100"></div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-amber-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-amber-700 uppercase">On-Watch</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{tierCounts['On-Watch']}</div>
          </div>
          <div className="w-3.5 h-3.5 rounded-full bg-amber-500 ring-4 ring-amber-100"></div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-rose-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-rose-700 uppercase">Blacklisted</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{tierCounts.Blacklisted}</div>
          </div>
          <div className="w-3.5 h-3.5 rounded-full bg-rose-500 ring-4 ring-rose-100"></div>
        </div>
      </div>

      {/* Bar Chart Comparing Ratings */}
      <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center space-x-2">
            <Award className="w-4 h-4 text-indigo-600" />
            <span>Supplier Performance Comparison Matrix</span>
          </h3>
          <button
            onClick={loadData}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {chartData.length > 0 ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} angle={-15} textAnchor="end" />
                <YAxis domain={[0, 5]} stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(val, name, item) => [`${val} / 5.0 (${item.payload.tier})`, 'Overall Score']}
                />
                <Bar dataKey="rating" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-xs text-slate-400">
            No supplier rating metrics available.
          </div>
        )}
      </div>

      {/* Full Comparison Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="font-extrabold text-slate-900 text-sm">Vendor Rankings & Tiers ({filtered.length})</div>
          
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-500 font-bold">Tier:</span>
            {['All', 'Preferred', 'Approved', 'On-Watch', 'Blacklisted'].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTier(t)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                  selectedTier === t ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
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
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase font-bold text-[11px] tracking-wider">
                <th className="py-3 px-4">Vendor Company</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Rating Tier</th>
                <th className="py-3 px-4">Composite Rating</th>
                <th className="py-3 px-4">KYC Compliance</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filtered.map((v) => (
                <tr key={v._id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{v.companyName}</td>
                  <td className="py-3 px-4 text-slate-500">{v.category}</td>
                  <td className="py-3 px-4">
                    <TierBadge tier={v.ratingTier || 'Approved'} />
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-indigo-600">
                    {v.overallRating ? v.overallRating.toFixed(1) : 'Unrated'}★
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-700">{v.complianceScore || 0}%</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onSelectVendor && onSelectVendor(v)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-bold text-xs transition-colors"
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
