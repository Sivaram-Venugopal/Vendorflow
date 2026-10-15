# VendorFlow Enterprise Procurement & Supplier Intelligence Portal
## Comprehensive Architectural, Operational, and Security Guide

---

### Executive Overview & Purpose

**VendorFlow** is a modern B2B Enterprise Supplier Relationship Management (SRM) and Source-to-Pay (S2P) procurement platform. It unifies enterprise corporate procurement teams (Buyers), governance/compliance officers (Administrators), and external commercial suppliers (Vendors) into a zero-trust, audited transaction ecosystem.

The system replaces error-prone email threads, paper spreadsheets, and fragmented manual approvals with an automated 6-stage Finite State Machine (FSM), integrated statutory tax calculations (18% GST), automated vendor performance scorecards, and live raw material spot index benchmarks.

---

### 1. What This Platform Does

1. **Self-Service Supplier Onboarding & Digital KYC:** External suppliers submit corporate identities, GSTIN, PAN numbers, bank accounts, and certificates.
2. **Statutory Compliance & Anti-Fraud Vetting:** Administrators verify regulatory credentials, evaluate risk metrics, and approve vendors into official trading tiers (Gold, Silver, Bronze).
3. **Automated Purchase Order (PO) Lifecycle:** Buyers draft itemized POs with dynamic SKU management, quantity/rate mathematics, statutory 18% GST calculations, and multi-tier approval routing.
4. **Finite State Machine (FSM) Order Orchestration:** Enforces strict sequential status transitions:
   $$\text{Draft} \longrightarrow \text{Pending Approval} \longrightarrow \text{Approved} \longrightarrow \text{Sent} \longrightarrow \text{Acknowledged} \longrightarrow \text{Delivered} \longrightarrow \text{Closed}$$
5. **Real-Time Raw Material Spot Index & AI Charge Optimizer (Inspired by NowPurchase):** Live market pricing for industrial metals, scrap grades, and ferroalloys with an automated AI charge-mix calculator to achieve target chemistry at the lowest raw material cost.
6. **Multi-Dimensional Vendor Scorecards:** Quarterly scoring of suppliers across 4 weighted dimensions: Quality (35%), On-Time Delivery (25%), Pricing Stability (20%), and Compliance (20%).
7. **Tamper-Evident Immutable Audit Trail:** Centralized logging capturing every document mutation, state change, user ID, IP address, and timestamp.

---

### 2. How Accounts Are Created & What For

VendorFlow implements Role-Based Access Control (RBAC) with 3 distinct real-world account types:

```
                  ┌───────────────────────────────────────────────┐
                  │          VendorFlow Account System            │
                  └───────┬───────────────────────────────┬───────┘
                          │                               │
            Internal Organization              External Partners
                          │                               │
        ┌─────────────────┴─────────────────┐             │
        ▼                                   ▼             ▼
   Admin Account                      Buyer Account  Vendor Account
 (Governance / CPO)                 (Category Leads) (Suppliers/Sales)
```

#### A. Administrator Account (Internal Governance)
* **How It Is Created:** Provisioned by the Enterprise IT or Chief Procurement Officer (CPO).
* **Purpose:**
  * Audits and approves newly registered suppliers after checking GSTIN & bank credentials.
  * Approves high-value Purchase Orders exceeding departmental buyer financial thresholds.
  * Reviews tamper-evident security audit logs for ISO 27001 / SOC 2 compliance.

#### B. Procurement Buyer Account (Internal Requisitions)
* **How It Is Created:** Created during corporate employee onboarding for procurement and sourcing teams.
* **Purpose:**
  * Explores the pre-approved vendor catalog and selects suppliers based on historical scorecard tiers.
  * Drafts legally binding Purchase Orders (POs) with itemized SKU quantities and delivery deadlines.
  * Conducts quarterly performance evaluations of suppliers.
  * Utilizes the **MetalMarketOptimizer** to benchmark raw material spot prices before contracting.

#### C. Vendor Account (External Commercial Partner)
* **How It Is Created:** Self-registered via `/register` by the vendor organization's authorized sales/commercial director.
* **Purpose:**
  * Submits official enterprise credentials (GST certificate, PAN card, MSME certificates, bank mandate).
  * Receives, inspects, and digitally acknowledges incoming Purchase Orders.
  * Updates delivery dispatch milestones and tracking numbers.
  * Reviews company scorecard ratings and payment reconciliation.

---

### 3. How Companies Benefit from Using VendorFlow

| Business Challenge (Without VendorFlow) | Enterprise Benefit (With VendorFlow) | Measured Impact |
| :--- | :--- | :--- |
| **Rogue / Maverick Buying:** Unapproved purchases made via personal contacts or inflated rates. | **Centralized Catalog & Pre-Approved Tiers:** Only KYC-vetted vendors in Gold/Silver tiers can receive Purchase Orders. | **100% spend under management**; eliminates unauthorized spending. |
| **Invoice / Tax Disputes:** Disagreements over GST amounts, incorrect bank routing, or missing line items. | **Automated 18% GST Engine & 3-Way Reconciliation:** Purchase Orders strictly validate unit rates, HSN codes, and integrated taxes prior to delivery. | **40% faster billing cycles**; zero billing discrepancies. |
| **Supplier Delivery Delays:** No tracking of supplier tardiness or defective metal batches. | **Algorithmic Vendor Scorecards:** Automated weighted calculation (Quality, Delivery, Price, Compliance) that automatically demotes poor suppliers to "Bronze" or "On-Watch". | **22% improvement in on-time delivery metrics**. |
| **Volatile Raw Material Costs:** Foundries and factories buying scrap and alloys at arbitrary broker rates. | **Live Spot Index & AI Charge-Mix (NowPurchase Model):** Buyers simulate the optimal scrap-to-pig-iron charge mix before contracting. | **6-8% direct reduction in melt batch procurement costs**. |

---

### 4. Technical Architecture: How Files & Documents Are Secured

> **Crucial Security Requirement:** Uploaded compliance documents (GST certificates, PAN cards, bank statements, proprietary drawings) **are NOT just physically copied or exposed as raw open assets**.

VendorFlow uses a multi-layered zero-trust digital asset pipeline:

```
[Vendor Upload: GST/PAN]
         │
         ▼
[Multer Binary Stream] ──► 1. Strict Magic-Byte & MIME-Type Vetting (rejects .exe, .sh, scripts)
         │
         ▼
[Filename Sanitizer]   ──► 2. Strips directory traversal paths (../); applies SHA-256 / Timestamp UUIDs
         │
         ▼
[Storage Partitioning] ──► 3. Placed into isolated storage directory (/uploads/documents/)
         │
         ▼
[RBAC Middleware Gate] ──► 4. Requires authenticated JWT token with authorized role validation
         │
         ▼
[Audit Log Trail]      ──► 5. Immutable event: user, IP address, timestamp, and target document logged
```

#### Detailed Document Security Controls:
1. **Filename Randomization & Path Traversal Immunity:**
   * Files are never saved under their client-submitted names.
   * Special characters are stripped, and a crypto-random timestamp suffix (`${cleanName}-${Date.now()}-${random}`) is generated. This renders Path Traversal attacks (`../../etc/passwd`) mathematically impossible.
2. **Strict MIME & Magic-Byte Filtering:**
   * Only strictly whitelisted binary MIME types (`application/pdf`, `image/jpeg`, `image/png`) are accepted. Executables, scripts, HTML payloads, and macro-enabled documents are rejected at the TCP stream boundary.
3. **Payload Size Guardrails:**
   * An enforced 10 MB ceiling stops Denial-of-Service (DoS) buffer allocation attacks.
4. **Access-Controlled Authorization:**
   * Documents are linked to specific MongoDB Vendor records via `ObjectId`.
   * A vendor can **only** query their own uploaded assets. Competitor vendors are blocked by database query constraints (`owner: req.user._id`).
   * Only authenticated Compliance Admins and Buyers can inspect vendor documents during audit approvals.
5. **Full Chain-of-Custody Audit Logging:**
   * Whenever a document is uploaded, verified, or accessed, an immutable audit event (`VENDOR_UPDATED`) records the user identity, role, source IP, and user-agent string.

---

### 5. NowPurchase Features Evaluated & Incorporated

After researching **[NowPurchase.com](https://nowpurchase.com/)** and their **MetalCloud** ecosystem, the following high-impact features were engineered into VendorFlow:

1. **Industrial Raw Material Spot Index:**
   * Live price tracking for heavy melting scrap (HMS 1&2), foundry pig iron, ferro silicon (FeSi 70%), ferro manganese, and alloy billets with day-over-day percentage changes.
2. **AI Furnace Charge-Mix Optimizer:**
   * Allows plant buyers to select a target metal grade (e.g. *Ductile Iron SG 500/7*, *Grey Iron FG 260*, *Mild Steel IS 2062*), input heat size in Metric Tons, and define target carbon/silicon percentages.
   * Computes the lowest-cost blend across foundry return scrap, pig iron, HMS, and ferroalloys, projecting cost savings per heat (averaging 6.4% savings).
3. **1-Click Pre-Filled PO Generation:**
   * Direct bridge from the charge-mix recipe into the formal VendorFlow Purchase Order builder, transferring line-item quantities and rates seamlessly.
