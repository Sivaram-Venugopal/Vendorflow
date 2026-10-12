import {
  DEFAULT_KPI_WEIGHTS,
  normalizeWeights,
  computeWeightedScore,
  mapScoreToTier,
  evaluateVendor,
} from '../src/utils/scoring.js';

describe('Vendor Evaluation Scoring Utility (Unit Tests)', () => {
  describe('normalizeWeights', () => {
    it('should return default weights when none provided', () => {
      const weights = normalizeWeights();
      expect(weights.quality).toBeCloseTo(0.35);
      expect(weights.delivery).toBeCloseTo(0.25);
      expect(weights.pricing).toBeCloseTo(0.20);
      expect(weights.compliance).toBeCloseTo(0.20);
      const total = weights.quality + weights.delivery + weights.pricing + weights.compliance;
      expect(total).toBeCloseTo(1.0);
    });

    it('should normalize arbitrary weights so they sum to 1.0', () => {
      const custom = { quality: 50, delivery: 25, pricing: 15, compliance: 10 };
      const weights = normalizeWeights(custom);
      expect(weights.quality).toBeCloseTo(0.50);
      expect(weights.delivery).toBeCloseTo(0.25);
      expect(weights.pricing).toBeCloseTo(0.15);
      expect(weights.compliance).toBeCloseTo(0.10);
      const sum = weights.quality + weights.delivery + weights.pricing + weights.compliance;
      expect(sum).toBeCloseTo(1.0);
    });

    it('should fallback to defaults if weights sum to zero', () => {
      const weights = normalizeWeights({ quality: 0, delivery: 0, pricing: 0, compliance: 0 });
      expect(weights).toEqual(DEFAULT_KPI_WEIGHTS);
    });
  });

  describe('computeWeightedScore', () => {
    it('should accurately calculate score with default weights', () => {
      // (5 * 0.35) + (4 * 0.25) + (3 * 0.20) + (4 * 0.20)
      // = 1.75 + 1.00 + 0.60 + 0.80 = 4.15
      const scores = {
        qualityScore: 5,
        deliveryScore: 4,
        pricingScore: 3,
        complianceScore: 4,
      };
      const score = computeWeightedScore(scores);
      expect(score).toBe(4.15);
    });

    it('should return 5.0 for all maximum scores', () => {
      const scores = {
        qualityScore: 5,
        deliveryScore: 5,
        pricingScore: 5,
        complianceScore: 5,
      };
      expect(computeWeightedScore(scores)).toBe(5.0);
    });

    it('should return 1.0 for all minimum scores', () => {
      const scores = {
        qualityScore: 1,
        deliveryScore: 1,
        pricingScore: 1,
        complianceScore: 1,
      };
      expect(computeWeightedScore(scores)).toBe(1.0);
    });

    it('should throw error for missing scores object', () => {
      expect(() => computeWeightedScore(null)).toThrow('Scores object is required');
    });

    it('should throw error for scores out of 1-5 range', () => {
      expect(() =>
        computeWeightedScore({
          qualityScore: 6,
          deliveryScore: 4,
          pricingScore: 4,
          complianceScore: 4,
        })
      ).toThrow("Invalid score value '6'");

      expect(() =>
        computeWeightedScore({
          qualityScore: 0,
          deliveryScore: 4,
          pricingScore: 4,
          complianceScore: 4,
        })
      ).toThrow("Invalid score value '0'");
    });

    it('should throw error for non-numeric scores', () => {
      expect(() =>
        computeWeightedScore({
          qualityScore: 'high',
          deliveryScore: 4,
          pricingScore: 4,
          complianceScore: 4,
        })
      ).toThrow();
    });
  });

  describe('mapScoreToTier', () => {
    it("should map scores >= 4.2 to 'Preferred'", () => {
      expect(mapScoreToTier(5.0)).toBe('Preferred');
      expect(mapScoreToTier(4.5)).toBe('Preferred');
      expect(mapScoreToTier(4.2)).toBe('Preferred');
    });

    it("should map scores >= 3.5 and < 4.2 to 'Approved'", () => {
      expect(mapScoreToTier(4.19)).toBe('Approved');
      expect(mapScoreToTier(3.8)).toBe('Approved');
      expect(mapScoreToTier(3.5)).toBe('Approved');
    });

    it("should map scores >= 2.5 and < 3.5 to 'On-Watch'", () => {
      expect(mapScoreToTier(3.49)).toBe('On-Watch');
      expect(mapScoreToTier(3.0)).toBe('On-Watch');
      expect(mapScoreToTier(2.5)).toBe('On-Watch');
    });

    it("should map scores < 2.5 to 'Blacklisted'", () => {
      expect(mapScoreToTier(2.49)).toBe('Blacklisted');
      expect(mapScoreToTier(1.8)).toBe('Blacklisted');
      expect(mapScoreToTier(1.0)).toBe('Blacklisted');
    });

    it("should fallback to 'On-Watch' for invalid score values", () => {
      expect(mapScoreToTier(null)).toBe('On-Watch');
      expect(mapScoreToTier(NaN)).toBe('On-Watch');
    });
  });

  describe('evaluateVendor', () => {
    it('should return complete composite evaluation result', () => {
      const scores = {
        qualityScore: 4.8,
        deliveryScore: 4.5,
        pricingScore: 4.2,
        complianceScore: 4.9,
      };
      const result = evaluateVendor(scores);
      expect(result).toHaveProperty('weightedScore');
      expect(result).toHaveProperty('tier');
      expect(result).toHaveProperty('weightsUsed');
      expect(result.tier).toBe('Preferred');
      expect(result.weightedScore).toBeGreaterThanOrEqual(4.2);
    });
  });
});
