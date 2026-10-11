/**
 * Pure, Unit-Testable Scoring & Tier Mapping Utilities
 *
 * Computes the weighted evaluation score and maps the result to a vendor tier:
 * - Preferred: >= 4.2
 * - Approved:  >= 3.5 and < 4.2
 * - On-Watch:  >= 2.5 and < 3.5
 * - Blacklisted: < 2.5
 */

export const DEFAULT_KPI_WEIGHTS = {
  quality: 0.35,     // 35%
  delivery: 0.25,    // 25%
  pricing: 0.20,     // 20%
  compliance: 0.20,  // 20%
};

/**
 * Validates and normalizes weights so they sum to 1.0 (100%).
 *
 * @param {Object} weights - { quality, delivery, pricing, compliance }
 * @returns {Object} normalizedWeights
 */
export const normalizeWeights = (weights = {}) => {
  const merged = {
    quality: Number(weights.quality ?? DEFAULT_KPI_WEIGHTS.quality),
    delivery: Number(weights.delivery ?? DEFAULT_KPI_WEIGHTS.delivery),
    pricing: Number(weights.pricing ?? DEFAULT_KPI_WEIGHTS.pricing),
    compliance: Number(weights.compliance ?? DEFAULT_KPI_WEIGHTS.compliance),
  };

  const sum = merged.quality + merged.delivery + merged.pricing + merged.compliance;

  if (sum <= 0) {
    return { ...DEFAULT_KPI_WEIGHTS };
  }

  return {
    quality: merged.quality / sum,
    delivery: merged.delivery / sum,
    pricing: merged.pricing / sum,
    compliance: merged.compliance / sum,
  };
};

/**
 * Computes the weighted composite score from per-KPI ratings (scale 1.0 - 5.0).
 *
 * Formula:
 * Weighted Score = (Quality * W_q) + (Delivery * W_d) + (Pricing * W_p) + (Compliance * W_c)
 *
 * @param {Object} scores - { qualityScore, deliveryScore, pricingScore, complianceScore }
 * @param {Object} weights - optional { quality, delivery, pricing, compliance }
 * @returns {Number} Rounded to 2 decimal places
 */
export const computeWeightedScore = (scores, customWeights = null) => {
  if (!scores) {
    throw new Error('Scores object is required for evaluation calculation');
  }

  const { qualityScore, deliveryScore, pricingScore, complianceScore } = scores;

  // Validate each score is numeric between 1 and 5
  const values = [qualityScore, deliveryScore, pricingScore, complianceScore];
  for (const val of values) {
    if (val === undefined || val === null || isNaN(val) || val < 1 || val > 5) {
      throw new Error(`Invalid score value '${val}'. Scores must be between 1 and 5.`);
    }
  }

  const weights = normalizeWeights(customWeights || DEFAULT_KPI_WEIGHTS);

  const weightedSum =
    qualityScore * weights.quality +
    deliveryScore * weights.delivery +
    pricingScore * weights.pricing +
    complianceScore * weights.compliance;

  return Math.round(weightedSum * 100) / 100;
};

/**
 * Maps a numerical score (scale 1.0 - 5.0) to its statutory rating tier.
 *
 * Tier Thresholds:
 * - Preferred:   >= 4.2
 * - Approved:    >= 3.5
 * - On-Watch:    >= 2.5
 * - Blacklisted: < 2.5
 *
 * @param {Number} score - Numerical score (1 - 5)
 * @returns {String} 'Preferred' | 'Approved' | 'On-Watch' | 'Blacklisted'
 */
export const mapScoreToTier = (score) => {
  if (score === undefined || score === null || isNaN(score)) {
    return 'On-Watch';
  }

  const num = Number(score);
  if (num >= 4.2) return 'Preferred';
  if (num >= 3.5) return 'Approved';
  if (num >= 2.5) return 'On-Watch';
  return 'Blacklisted';
};

/**
 * Complete evaluation evaluator function.
 * Pure function returning score, tier, and breakdown.
 */
export const evaluateVendor = (scores, customWeights = null) => {
  const normalizedWeights = normalizeWeights(customWeights || DEFAULT_KPI_WEIGHTS);
  const weightedScore = computeWeightedScore(scores, normalizedWeights);
  const tier = mapScoreToTier(weightedScore);

  return {
    weightedScore,
    tier,
    weightsUsed: normalizedWeights,
  };
};

export default {
  DEFAULT_KPI_WEIGHTS,
  normalizeWeights,
  computeWeightedScore,
  mapScoreToTier,
  evaluateVendor,
};
