import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendors } from '../store/slices/vendorSlice';
import { fetchVendorEvaluations } from '../store/slices/evaluationSlice';
import EvaluatorForm from '../components/EvaluatorForm';
import VendorScorecardView from '../components/VendorScorecardView';
import TierBadge from '../components/TierBadge';
import { 
  ShoppingBag, 
  Award, 
  FileText, 
  PlusCircle, 
  UserCheck, 
  Star, 
  Search, 
  ArrowLeft 
} from 'lucide-react';

const BuyerPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { vendors } = useSelector((state) => state.vendor);
  const { history, selectedVendor } = useSelector((state) => state.evaluation);

  const [activeTab, setActiveTab] = useState('evaluations'); // 'evaluations' | 'new-evaluation' | 'view-scorecard'
  const [evaluatingVendor, setEvaluatingVendor] = useState(null);
  const [viewingVendor, setViewingVendor] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchVendors());
  }, [dispatch]);

  const handleStartEvaluate = (vendor) => {
    setEvaluatingVendor(vendor);
    setActiveTab('new-evaluation');
  };

  const handleViewScorecard = async (vendor) => {
    setViewingVendor(vendor);
    await dispatch(fetchVendorEvaluations(vendor._id || vendor.id));
    setActiveTab('view-scorecard');
  };

  const filteredVendors = vendors.filter((v) =>
    v.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 mb-1">
            <ShoppingBag className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Procurement Operations</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Buyer Procurement & Evaluations</h1>
          <p className="text-sm text-slate-400 mt-1">
            Audit supplier deliverables, compute weighted scorecards, and review performance history.
          </p>
        </div>

        {activeTab !== 'evaluations' && (
          <button
            onClick={() => setActiveTab('evaluations')}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1.5 self-start md:self-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Supplier Directory</span>
          </button>
        )}
      </div>

      {/* Main Workspace Navigation */}
      {activeTab === 'evaluations' && (
        <div className="space-y-6">
          {/* Supplier Directory for Evaluation */}
          <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 overflow-hidden shadow-xl backdrop-blur">
            <div className="p-4 border-b border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-white text-base">Approved Supplier Directory</h3>
                <p className="text-xs text-slate-400">Select a vendor to evaluate or inspect scorecards</p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter suppliers by name or category..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900/60 border-b border-slate-700/60 text-slate-400 uppercase font-semibold">
                    <th className="py-3 px-4">Supplier Company</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Current Rating Tier</th>
                    <th className="py-3 px-4">Composite Score</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50 text-slate-200">
                  {filteredVendors.map((vendor) => (
                    <tr key={vendor._id} className="hover:bg-slate-700/30">
                      <td className="py-3.5 px-4 font-bold text-white">{vendor.companyName}</td>
                      <td className="py-3.5 px-4 text-slate-300">{vendor.category}</td>
                      <td className="py-3.5 px-4">
                        <TierBadge tier={vendor.ratingTier || 'Approved'} />
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">
                        {vendor.overallRating ? vendor.overallRating.toFixed(1) : 'Unrated'} / 5.0
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleViewScorecard(vendor)}
                            className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded font-semibold text-xs"
                          >
                            Scorecard
                          </button>
                          <button
                            onClick={() => handleStartEvaluate(vendor)}
                            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-semibold text-xs flex items-center space-x-1"
                          >
                            <Star className="w-3 h-3" />
                            <span>Evaluate Vendor</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Submitting Evaluation Form View */}
      {activeTab === 'new-evaluation' && evaluatingVendor && (
        <div className="max-w-2xl mx-auto">
          <EvaluatorForm
            vendor={evaluatingVendor}
            onComplete={() => {
              dispatch(fetchVendors());
              handleViewScorecard(evaluatingVendor);
            }}
          />
        </div>
      )}

      {/* Viewing Vendor Scorecard History View */}
      {activeTab === 'view-scorecard' && viewingVendor && (
        <div>
          <VendorScorecardView
            vendor={selectedVendor || viewingVendor}
            evaluations={history}
          />
        </div>
      )}
    </div>
  );
};

export default BuyerPage;
