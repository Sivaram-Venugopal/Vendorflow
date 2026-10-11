# VendorFlow — Phase 4: Vendor Evaluation & Scorecard Module

## 1. Phase Overview
Phase 4 implements the **Vendor Performance Evaluation & Scorecard Analytics Engine** for VendorFlow. It transitions the portal from purely managing vendor identities into an objective performance governance platform where Procurement Officers and Buyers score vendors across key dimensions, automatically calculating weighted ratings that determine statutory supplier tiers (`Preferred`, `Approved`, `On-Watch`, `Blacklisted`).

In this phase, we:
- Built a **pure, unit-testable scoring utility module** (`server/src/utils/scoring.js`) with functions for normalizing weights, computing composite weighted totals, and deterministically mapping scores to tier brackets.
- Built `POST /api/evaluations`: Endpoint accepting per-KPI scores (`qualityScore`, `deliveryScore`, `pricingScore`, `complianceScore`) and customizable weights, computing the weighted rating, updating the vendor's cumulative `overallRating` and `ratingTier`, and logging an immutable `AuditLog`.
- Built `GET /api/vendors/:id/evaluations`: Endpoint delivering chronological score history formatted for time-series analytics and radar visualizations.
- Built `GET /api/evaluations/comparison`: Admin-exclusive endpoint compiling side-by-side performance metrics across all suppliers.
- Developed interactive frontend analytics:
  1. **Evaluator Form** (`EvaluatorForm.jsx`): Interactive scoring sliders (1.0–5.0) with live projected score and tier feedback.
  2. **Vendor Scorecard View** (`VendorScorecardView.jsx`): Recharts time-series line chart tracking performance trends, radar balance chart, statutory `TierBadge`, and historical audit table.
  3. **Admin Tier Comparison View** (`VendorTierComparisonView.jsx`): Tier distribution cards, comparative bar chart, and filterable supplier rankings.
  4. **Vendor Read-Only Scorecard**: Built into `VendorPage.jsx`, allowing verified suppliers to inspect their performance audit history.

---

## 2. Request → Response Data Flow for Vendor Evaluation

```
[Buyer submits KPI ratings in EvaluatorForm]
(Quality=4.7, Delivery=4.2, Pricing=4.0, Compliance=4.5)
                 │
                 │ 1. POST /api/evaluations
                 │    Headers: Authorization: Bearer <token>
                 ▼
[Express Server: authMiddleware + roleMiddleware('Buyer', 'Admin')]
                 │
                 ▼
[Controller: createEvaluation]
                 │
                 │ 2. Invokes Pure Utility:
                 │    evaluateVendor(scores, weights)
                 ▼
[Pure Utility: scoring.js]
  ├─► normalizeWeights(weights) -> { quality: 0.35, delivery: 0.25, pricing: 0.20, compliance: 0.20 }
  ├─► computeWeightedScore(scores, weights)
  │    (4.7 * 0.35) + (4.2 * 0.25) + (4.0 * 0.20) + (4.5 * 0.20) = 4.39 -> 4.40
  ├─► mapScoreToTier(4.40) -> 'Preferred' (>= 4.2)
  └─► Returns { weightedScore: 4.40, tier: 'Preferred', weightsUsed }
                 │
                 ▼
[Mongoose Persistence]
  ├─► Evaluation.create({ vendor, evaluator, scores, weights, overallScore: 4.40, ratingTier: 'Preferred' })
  ├─► Recalculates vendor cumulative overallRating across all historical audits
  ├─► Updates vendor.ratingTier = 'Preferred'
  ├─► vendor.save()
  ├─► AuditLog.create({ action: 'EVALUATION_SUBMITTED', entityId: evaluation._id, ... })
                 ▼
[HTTP 201 Created Response]
{
  "status": "success",
  "data": {
    "evaluation": { ... },
    "updatedVendor": {
      "id": "6acbaf1f2ca0337407bbb149",
      "companyName": "Global Freight & Express Ltd",
      "overallRating": 4.4,
      "ratingTier": "Preferred"
    }
  }
}
                 │
                 ▼
[Client: evaluationSlice / BuyerPage UI]
  -> Immediately adds evaluation to Redux state
  -> Updates VendorScorecardView Recharts trend line
  -> Supplier tier badge switches to "Preferred Partner"
```

---

## 3. Key Files and Responsibilities

| File Path | Description |
|---|---|
| `server/src/utils/scoring.js` | Pure scoring utility module: `DEFAULT_KPI_WEIGHTS`, `normalizeWeights`, `computeWeightedScore`, `mapScoreToTier`, and `evaluateVendor`. Zero side effects, fully testable. |
| `server/src/controllers/evaluationController.js` | Express controller handling evaluation submissions, vendor historical audits, and admin multi-vendor comparisons. |
| `server/src/routes/evaluationRoutes.js` | Router exposing `POST /api/evaluations` and `GET /api/evaluations/comparison`. |
| `server/src/routes/vendorRoutes.js` | Mounted `GET /api/vendors/:id/evaluations` for vendor-specific audit lookups. |
| `server/src/models/Evaluation.js` | Schema storing per-KPI ratings, weights, computed overall score, rating tier, and evaluator user reference. |
| `server/src/models/Vendor.js` | Updated with `ratingTier` enum (`Preferred`, `Approved`, `On-Watch`, `Blacklisted`) and compound index `{ ratingTier: 1, overallRating: -1 }`. |
| `client/src/store/slices/evaluationSlice.js` | Redux slice managing `submitEvaluation`, `fetchVendorEvaluations`, and `fetchVendorsComparison`. |
| `client/src/components/TierBadge.jsx` | Visual component rendering tier badges with icons and color tokens (`Preferred`=emerald, `Approved`=sky, `On-Watch`=amber, `Blacklisted`=rose). |
| `client/src/components/EvaluatorForm.jsx` | Procurement evaluation form with real-time score projection and optional KPI weight adjustments. |
| `client/src/components/VendorScorecardView.jsx` | Scorecard display featuring a Recharts time-series performance trend line, KPI radar chart, and detailed audit history table. |
| `client/src/components/VendorTierComparisonView.jsx` | Admin comparative view featuring tier metric cards, side-by-side Recharts bar chart, and ranking filters. |
| `client/src/pages/BuyerPage.jsx` | Buyer workspace hosting the approved supplier directory, evaluation form launcher, and scorecard views. |
| `client/src/pages/AdminPage.jsx` | Admin governance portal hosting the side-by-side tier comparison matrix and vendor scorecard inspector. |
| `client/src/pages/VendorPage.jsx` | Vendor workspace with read-only **Performance Scorecard** tab displaying the supplier's own score history. |

---

## 4. Internals & Architectural Decisions

### How the Weighted-Average Calculation is Modeled in Code vs a Plain Average
- **Plain Arithmetic Mean**:
  $$\text{Score} = \frac{\text{Quality} + \text{Delivery} + \text{Pricing} + \text{Compliance}}{4}$$
  Treats every dimension as identical in business impact. In industrial procurement, a critical delivery delay or defect rate is significantly more hazardous than a minor pricing discrepancy.
- **Weighted-Average Calculation**:
  $$\text{Score} = \sum_{i=1}^{n} (\text{Score}_i \times W_i) = (\text{Quality} \times W_q) + (\text{Delivery} \times W_d) + (\text{Pricing} \times W_p) + (\text{Compliance} \times W_c)$$
  Where $\sum W_i = 1.0$.
  In VendorFlow:
  - **Quality (35%)**: Heavily penalized for manufacturing or component defects.
  - **Delivery (25%)**: Prioritizes fulfillment timelines.
  - **Pricing (20%)**: Market competitiveness.
  - **Compliance (20%)**: Statutory GSTIN, PAN, and insurance validity.
- **In Code**: `normalizeWeights` ensures that even if custom weights are submitted, their sum is normalized to 1.0 before multiplication, preventing mathematical overflow beyond the 5.0 maximum score boundary.

### Why the Scoring Logic is a Pure Function Separate from the Route Handler
A function is **pure** if:
1. It returns identical output for identical arguments.
2. It causes **zero side effects** (does not write to databases, does not alter global state, does not make network calls, does not mutate inputs).

**Engineering Advantages**:
1. **Unit Testability**: The scoring math can be tested in milliseconds using isolated scripts or Jest/Mocha without initializing MongoDB, mocking Express `req`/`res` objects, or connecting to external services.
2. **Deterministic Governance**: Statutory procurement decisions (e.g. blacklisting a supplier) carry legal and contractual implications. Decoupling the calculation guarantees that neither database lag nor network interruptions can alter the mathematical result.
3. **Reusability Across Client and Server**: The exact same pure function can be shared or replicated on the client (`EvaluatorForm.jsx`) to project real-time scores as the buyer adjusts sliders before making the POST request.

### What Data Shape a React Charting Library Expects for a Time Series
React charting libraries (such as **Recharts**) require data shaped as an **array of flat objects**:
```javascript
[
  { name: "Q4-2025", score: 4.20, quality: 4.5, delivery: 4.0 },
  { name: "Q1-2026", score: 4.40, quality: 4.7, delivery: 4.2 }
]
```
1. **The Independent Variable (X-Axis)**: Must be a shared string or numeric timestamp key present on every object (e.g. `dataKey="name"` or `dataKey="date"`).
2. **The Dependent Variable (Y-Axis / Lines)**: Must be a flat numeric property (e.g. `dataKey="score"`). Nested object paths (like `scores.dimensions.quality`) require extra accessor functions and can introduce re-render performance bottlenecks in React SVG rendering trees.
3. **Chronological Sorting**: Time-series charts draw SVG path segments in sequential array index order. Our endpoint explicitly sorts historical audits by `{ createdAt: 1 }` so line curves connect chronologically from past to present without visual stutter.

---

## 5. How to Manually Verify This Phase

1. **Submit an Evaluation as Buyer**:
   - Log in as Buyer (`buyer@vendorflow.io` / `Password123!`) and navigate to `/buyer`.
   - In the **Approved Supplier Directory**, locate a vendor and click **Evaluate Vendor**.
   - Adjust the KPI sliders (e.g. Quality: `4.7`, Delivery: `4.2`, Pricing: `4.0`, Compliance: `4.5`).
   - Notice the live projected score updates in real-time to **`4.4 / 5.0 (Preferred)`**.
   - Click **Submit Evaluation & Update Tier**.
   - **Verification**: The view automatically transitions to the **Vendor Scorecard View**, rendering the new data point on the Recharts trend line and displaying the green **"Preferred Partner"** badge.

2. **Admin Side-by-Side Comparison**:
   - Log in as Admin (`admin@vendorflow.io` / `Password123!`) and navigate to `/admin`.
   - Click the **Tier Comparisons** tab.
   - Verify the tier distribution cards (`Preferred`, `Approved`, `On-Watch`, `Blacklisted`).
   - Observe the comparative bar chart displaying all supplier ratings.
   - Click **View Scorecard** next to any vendor to inspect their detailed audit history and radar balance chart.

3. **Vendor Self-Service Read-Only View**:
   - Log in as the evaluated vendor (`vendor.apex@example.com` or newly onboarded vendor).
   - Navigate to `/vendor` and click the **Performance Scorecard** tab.
   - Verify that the vendor can view their own score history chart, tier badge, and KPI ratings, without having access to modify scores or view competing vendors.

---

## 6. What Next Phase (Phase 5) Will Build on Top of This
With vendor evaluations and scorecard ratings operational:
- **Phase 5: Item Catalog & Requisition Management**:
  - Item catalog schema (`Item`) with SKU, description, pricing, and preferred vendor linkage.
  - Requisition schema (`Requisition`) allowing buyers to draft purchase requests from the catalog.
  - Requisition approval workflows before conversion into formal Purchase Orders.
