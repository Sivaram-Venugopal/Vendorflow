import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { submitEvaluation } from '../store/slices/evaluationSlice';
import { 
  Star, 
  Send, 
  Sliders, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  ShieldCheck 
} from 'lucide-react';

const EvaluatorForm = ({ vendor, onComplete }) => {
  const dispatch = useDispatch();

  const [period, setPeriod] = useState(`Q${Math.floor(new Date().getMonth() / 3) + 1}-${new Date().getFullYear()} Audit`);
  const [scores, setScores] = useState({
    qualityScore: 4.5,
    deliveryScore: 4.0,
    pricingScore: 4.0,
    complianceScore: 4.5,
  });

  const [weights, setWeights] = useState({
    quality: 0.35,
    delivery: 0.25,
    pricing: 0.20,
    compliance: 0.20,
  });

  const [comments, setComments] = useState('');
  const [showWeightSliders, setShowWeightSliders] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Live client-side preview of weighted score
  const computedPreview = (
    scores.qualityScore * weights.quality +
    scores.deliveryScore * weights.delivery +
    scores.pricingScore * weights.pricing +
    scores.complianceScore * weights.compliance
  ).toFixed(2);

  const getPreviewTier = (score) => {
    if (score >= 4.2) return 'Preferred';
    if (score >= 3.5) return 'Approved';
    if (score >= 2.5) return 'On-Watch';
    return 'Blacklisted';
  };

  const previewTier = getPreviewTier(Number(computedPreview));

  const handleScoreChange = (kpi, val) => {
    setScores((prev) => ({ ...prev, [kpi]: parseFloat(val) }));
  };

  const handleWeightChange = (kpi, val) => {
    setWeights((prev) => ({ ...prev, [kpi]: parseFloat(val) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      await dispatch(
        submitEvaluation({
          vendorId: vendor._id || vendor.id,
          period,
          qualityScore: scores.qualityScore,
          deliveryScore: scores.deliveryScore,
          pricingScore: scores.pricingScore,
          complianceScore: scores.complianceScore,
          weights,
          feedbackComments: comments,
        })
      ).unwrap();

      if (onComplete) onComplete();
    } catch (err) {
      setErrorMsg(typeof err === 'string' ? err : 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-800/90 rounded-2xl border border-slate-700/80 p-6 md:p-8 shadow-2xl backdrop-blur space-y-6">
      <div className="border-b border-slate-700 pb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <span>Procurement Evaluation Form</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluating Supplier: <span className="text-white font-semibold">{vendor?.companyName}</span>
          </p>
        </div>

        {/* Live Computed Score Pill */}
        <div className="text-right">
          <div className="text-[10px] uppercase font-semibold text-slate-400">Projected Score</div>
          <div className="text-xl font-black text-indigo-400 font-mono">
            {computedPreview} / 5.0
          </div>
          <div className="text-[11px] font-semibold text-emerald-400">{previewTier}</div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Audit Period *</label>
          <input
            type="text"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            placeholder="e.g. Q1-2026 Audit"
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200"
            required
          />
        </div>

        {/* Per-KPI Sliders */}
        <div className="space-y-4 bg-slate-900/60 p-4 rounded-xl border border-slate-700/60">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Per-KPI Scoring Dimensions (1.0 - 5.0)
          </h4>

          {/* Quality */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Quality & Defects Rate (Weight: {(weights.quality * 100).toFixed(0)}%)</span>
              <span className="font-bold text-sky-400 font-mono">{scores.qualityScore.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="5.0"
              step="0.1"
              value={scores.qualityScore}
              onChange={(e) => handleScoreChange('qualityScore', e.target.value)}
              className="w-full accent-sky-500 cursor-pointer"
            />
          </div>

          {/* Delivery */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Delivery Lead-Time & Fulfillment (Weight: {(weights.delivery * 100).toFixed(0)}%)</span>
              <span className="font-bold text-indigo-400 font-mono">{scores.deliveryScore.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="5.0"
              step="0.1"
              value={scores.deliveryScore}
              onChange={(e) => handleScoreChange('deliveryScore', e.target.value)}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          {/* Pricing */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Pricing Competitiveness (Weight: {(weights.pricing * 100).toFixed(0)}%)</span>
              <span className="font-bold text-purple-400 font-mono">{scores.pricingScore.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="5.0"
              step="0.1"
              value={scores.pricingScore}
              onChange={(e) => handleScoreChange('pricingScore', e.target.value)}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>

          {/* Compliance */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 font-medium">Statutory & Contract Compliance (Weight: {(weights.compliance * 100).toFixed(0)}%)</span>
              <span className="font-bold text-emerald-400 font-mono">{scores.complianceScore.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="5.0"
              step="0.1"
              value={scores.complianceScore}
              onChange={(e) => handleScoreChange('complianceScore', e.target.value)}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Optional Custom Weights Toggle */}
        <div>
          <button
            type="button"
            onClick={() => setShowWeightSliders(!showWeightSliders)}
            className="text-xs text-sky-400 hover:text-sky-300 flex items-center space-x-1 font-semibold"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{showWeightSliders ? 'Hide Custom KPI Weights' : 'Adjust KPI Weights'}</span>
          </button>

          {showWeightSliders && (
            <div className="mt-3 p-4 bg-slate-900/80 rounded-xl border border-slate-700/60 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Quality Wt</label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  max="1"
                  value={weights.quality}
                  onChange={(e) => handleWeightChange('quality', e.target.value)}
                  className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-slate-200 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Delivery Wt</label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  max="1"
                  value={weights.delivery}
                  onChange={(e) => handleWeightChange('delivery', e.target.value)}
                  className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-slate-200 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Pricing Wt</label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  max="1"
                  value={weights.pricing}
                  onChange={(e) => handleWeightChange('pricing', e.target.value)}
                  className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-slate-200 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Compliance Wt</label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  max="1"
                  value={weights.compliance}
                  onChange={(e) => handleWeightChange('compliance', e.target.value)}
                  className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-slate-200 font-mono"
                />
              </div>
            </div>
          )}
        </div>

        {/* Feedback Comments */}
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
            Qualitative Observations & Action Items
          </label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Document supplier reliability, defect rates, response times..."
            rows={3}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-sm font-semibold flex items-center justify-center space-x-2 transition-colors shadow-lg shadow-indigo-600/20"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Calculating & Submitting Evaluation...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit Evaluation & Update Tier</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default EvaluatorForm;
