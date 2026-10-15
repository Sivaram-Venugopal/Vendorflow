import sys
import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN

sys.stdout.reconfigure(encoding='utf-8')

# Open the 0th review template
src_path = 'C:/Users/LAKSHMI/FSD/0th review - 310624205263.pptx'
dst_path = 'C:/Users/LAKSHMI/FSD/1st review - 310624205263.pptx'
prs = pptx.Presentation(src_path)

print(f"Loaded template with {len(prs.slides)} slides.")

# ==============================================================================
# SLIDE 1: TITLE SLIDE
# ==============================================================================
slide1 = prs.slides[0]
# Shape 0: College Name
# Shape 2: (Autonomous)
# Shape 3: Bharathi Salai...
# Shape 4: Department / Title
# Shape 5: PRESENTED BY
# Shape 6: GUIDE NAME
# Shape 7: Student Name & Reg
# Shape 8: Guide Name

# Update Department and Project Title on Slide 1
s1_shape4 = slide1.shapes[4]
s1_shape4.text_frame.clear()
p1 = s1_shape4.text_frame.paragraphs[0]
p1.text = "DEPARTMENT OF INFORMATION TECHNOLOGY"
p1.font.name = "Segoe UI"
p1.font.size = Pt(18)
p1.font.bold = True
p1.alignment = PP_ALIGN.CENTER

p2 = s1_shape4.text_frame.add_paragraph()
p2.text = "PROJECT WORK (PHASE-I) - 1st REVIEW"
p2.font.name = "Segoe UI"
p2.font.size = Pt(14)
p2.font.bold = True
p2.font.color.rgb = RGBColor(160, 150, 140)
p2.alignment = PP_ALIGN.CENTER

p3 = s1_shape4.text_frame.add_paragraph()
p3.text = "VENDORFLOW: AN ENTERPRISE MERN-STACK PROCUREMENT AND SUPPLIER LIFECYCLE MANAGEMENT SYSTEM"
p3.font.name = "Segoe UI"
p3.font.size = Pt(17)
p3.font.bold = True
p3.font.color.rgb = RGBColor(190, 40, 40)
p3.alignment = PP_ALIGN.CENTER

# Student details
slide1.shapes[7].text_frame.paragraphs[0].text = "SIVARAM VENUGOPAL  (310624205263)"
slide1.shapes[7].text_frame.paragraphs[0].font.name = "Segoe UI"
slide1.shapes[7].text_frame.paragraphs[0].font.size = Pt(14)
slide1.shapes[7].text_frame.paragraphs[0].font.bold = True

# Guide details
slide1.shapes[8].text_frame.paragraphs[0].text = "Dr. S. BERLIN SHAMEEMA"
slide1.shapes[8].text_frame.paragraphs[0].font.name = "Segoe UI"
slide1.shapes[8].text_frame.paragraphs[0].font.size = Pt(14)
slide1.shapes[8].text_frame.paragraphs[0].font.bold = True

# Helper to format standard slides
def setup_standard_slide(slide, title_text, items, font_size=Pt(16)):
    # Shape 0 is title
    slide.shapes[0].text_frame.clear()
    p_title = slide.shapes[0].text_frame.paragraphs[0]
    p_title.text = title_text
    p_title.font.name = "Segoe UI"
    p_title.font.size = Pt(28)
    p_title.font.bold = True

    # Shape 2 is body text box
    tb = slide.shapes[2]
    tb.text_frame.clear()
    for idx, item in enumerate(items):
        if idx == 0:
            p = tb.text_frame.paragraphs[0]
        else:
            p = tb.text_frame.add_paragraph()
        p.text = item
        p.font.name = "Segoe UI"
        p.font.size = font_size
        p.space_after = Pt(8)
        if item.startswith("•") or item.startswith("▪") or item.startswith("o"):
            p.level = 0

# ==============================================================================
# SLIDE 2: CONTENTS (1ST REVIEW)
# ==============================================================================
slide2_items = [
    "o  Project Overview & Review-1 Objectives Recap",
    "o  System Architecture & Multi-Tier Data Flow",
    "o  Database Schema Design & Mongoose Modeling",
    "o  Role-Based Access Control (RBAC) & Security Pipeline",
    "o  Core Engine 1: Deterministic PO Finite State Machine (FSM)",
    "o  Core Engine 2: 4-Pillar Supplier Evaluation Scorecard",
    "o  Technology Stack & Implementation Environment",
    "o  Prototype Implementation: Purchase Order Lifecycle Engine",
    "o  Prototype Implementation: Supplier Onboarding & Scorecard",
    "o  Verification, Testing & Immutable Audit Trail",
    "o  Work Completed vs Next Milestones (Future Scope)",
    "o  References"
]
setup_standard_slide(prs.slides[1], "CONTENTS (1ST REVIEW) :", slide2_items, font_size=Pt(15))

# ==============================================================================
# SLIDE 3: PROJECT OVERVIEW & REVIEW-1 OBJECTIVES
# ==============================================================================
slide3_items = [
    "▪  The Problem: Conventional procurement in growing enterprises relies heavily on disconnected spreadsheets, unmonitored email approvals, and manual invoice reconciliation. This introduces data silos, maverick spending, delayed deliveries, and severe tax compliance risks.",
    "▪  The Solution (VendorFlow): A centralized, role-gated web platform built on the MERN stack (MongoDB, Express.js, React.js, Node.js) that automates the complete Procure-to-Pay (P2P) lifecycle with absolute transparency.",
    "▪  Key Milestones Targeted for 1st Review:",
    "    • Full transition from conceptual design to a working, full-stack functional prototype.",
    "    • Implementation of an 8-stage deterministic Finite State Machine (FSM) governing PO workflows.",
    "    • Real-time financial calculation engine computing line subtotals and statutory 18% GST.",
    "    • Multi-criteria supplier performance evaluation scoring across 4 weighted operational pillars.",
    "    • Role-Based Access Control (RBAC) isolating Admin, Buyer, and Vendor capabilities via JWT."
]
setup_standard_slide(prs.slides[2], "PROJECT OVERVIEW & REVIEW-1 OBJECTIVES :", slide3_items, font_size=Pt(14))

# ==============================================================================
# SLIDE 4: SYSTEM ARCHITECTURE & MULTI-TIER DATA FLOW (UPDATE SLIDE 11 OR SLIDE 4)
# Let's see: Slide 4 was INTRODUCTION in 0th review. We will use it for SYSTEM ARCHITECTURE.
# ==============================================================================
slide4_items = [
    "▪  Presentation Layer (Client Tier): Developed using React 18, Vite, and Tailwind CSS. Features dedicated responsive SPAs with role-based routing for Admins, Procurement Buyers, and Suppliers.",
    "▪  Application & Business Logic Tier: Powered by Node.js and Express.js REST API. Enforces a 3-stage pipeline: JWT Authentication Middleware, Validation Controllers, and FSM State Transition Guards.",
    "▪  Data Persistence Tier: Driven by MongoDB Atlas Cloud NoSQL database with Mongoose ODM. Compound indexes ensure sub-100ms query retrieval for vendors, purchase orders, and audit ledgers.",
    "▪  External Integration Layer: Configured with Nodemailer SMTP transport for automated email notifications upon PO creation, manager approval, and dispatch milestones.",
    "▪  End-to-End Execution Flow:",
    "    [Buyer Crafts PO] ➔ [18% GST Auto-Calculated] ➔ [Admin Approval Guard] ➔ [FSM Status: Sent] ➔ [Nodemailer Alert to Vendor] ➔ [Vendor Acknowledges in Portal] ➔ [Audit Log Persisted]"
]
setup_standard_slide(prs.slides[3], "SYSTEM ARCHITECTURE & DATA FLOW :", slide4_items, font_size=Pt(14))

# ==============================================================================
# SLIDE 5: DATABASE SCHEMA & MONGOOSE DATA MODELING
# (In 0th review, Slide 5 had a table for literature survey. We will replace it with a text box for Database Design!)
# ==============================================================================
slide5 = prs.slides[4]
slide5.shapes[0].text_frame.clear()
slide5.shapes[0].text_frame.paragraphs[0].text = "DATABASE SCHEMA & DATA MODELING :"
slide5.shapes[0].text_frame.paragraphs[0].font.name = "Segoe UI"
slide5.shapes[0].text_frame.paragraphs[0].font.size = Pt(28)
slide5.shapes[0].text_frame.paragraphs[0].font.bold = True

# Remove table shape (shape 2) and add a text box
slide5_sp = slide5.shapes[2]
slide5_left, slide5_top, slide5_w, slide5_h = slide5_sp.left, slide5_sp.top, slide5_sp.width, slide5_sp.height
sp_elem = slide5_sp._element
sp_elem.getparent().remove(sp_elem)

tb5 = slide5.shapes.add_textbox(slide5_left, slide5_top, slide5_w, slide5_h)
tb5.text_frame.clear()
slide5_items = [
    "▪  User Schema: Encapsulates authentication credentials and RBAC roles (_id, name, email, passwordHash [bcrypt salted 10 rounds], role ['admin' | 'buyer' | 'vendor'], createdAt).",
    "▪  Vendor Schema: Models supplier profile and KYC compliance (companyName, gstin [15-char statutory tax format], pan, category, status ['Pending' | 'Active' | 'Blacklisted'], overallScore [0-100], tierRating).",
    "▪  PurchaseOrder Schema: Core transactional entity referencing Buyer and Vendor (poNumber [unique indexed], vendorId, buyerId, status [8-state enum], items [embedded sub-schema: description, quantity, unitPrice, gstRate=0.18], subtotal, taxAmount, grandTotal, deliveryDate).",
    "▪  Evaluation Schema: Historical performance records (vendorId, qualityScore, deliveryScore, pricingScore, complianceScore, compositeScore, tierAssigned, evaluatedBy, timestamp).",
    "▪  AuditLog Schema: Immutable governance ledger (entityId, entityType, userId, action, fromState, toState, timestamp, clientMetadata)."
]
for idx, it in enumerate(slide5_items):
    p = tb5.text_frame.paragraphs[0] if idx == 0 else tb5.text_frame.add_paragraph()
    p.text = it
    p.font.name = "Segoe UI"
    p.font.size = Pt(14)
    p.space_after = Pt(8)

# ==============================================================================
# SLIDE 6: ROLE-BASED ACCESS CONTROL (RBAC) & SECURITY
# ==============================================================================
slide6_items = [
    "▪  Stateless JWT Token Pipeline: Users authenticate via email/password. The server cryptographically signs a JSON Web Token with user claims and role. Tokens are dispatched via Authorization: Bearer headers.",
    "▪  Granular Role Segmentation & Privilege Matrix:",
    "    1. Administrator: Controls platform governance, reviews and approves/rejects vendor KYC applications, monitors fiscal approval limits, and inspects the global audit trail.",
    "    2. Procurement Buyer: Authors purchase orders, inputs dynamic line items, submits orders for approval, and conducts periodic supplier scorecard evaluations.",
    "    3. Supplier (Vendor): Self-service portal to inspect assigned POs, confirm delivery dates, formally acknowledge orders, and view performance scorecard feedback.",
    "▪  Zero-Trust Server-Side Guards: verifyToken and authorizeRoles('admin', 'buyer') middleware strictly intercept endpoints, returning HTTP 403 Forbidden before database queries execute."
]
setup_standard_slide(prs.slides[5], "ROLE-BASED ACCESS CONTROL (RBAC) & SECURITY :", slide6_items, font_size=Pt(14))

# ==============================================================================
# SLIDE 7: CORE ENGINE 1: DETERMINISTIC PO STATE MACHINE (FSM)
# ==============================================================================
slide7_items = [
    "▪  The 8-Stage Deterministic Purchase Order Lifecycle:",
    "    Draft ➔ Pending Approval ➔ Approved ➔ Sent ➔ Acknowledged ➔ Delivered ➔ Invoiced ➔ Closed",
    "▪  Deterministic State Transition Guards:",
    "    • Transitions are enforced through a server-side transition lookup dictionary.",
    "    • Out-of-order execution (e.g., jumping from Draft to Delivered) is strictly rejected with HTTP 400 Bad Request.",
    "    • Eliminates process bypasses, unauthorized price alterations on approved orders, and status ambiguity.",
    "▪  Automated Financial & Statutory Tax Calculation:",
    "    • Interactive line calculator computes: Line Total = Quantity × Unit Price.",
    "    • Automatically computes Subtotal, applies statutory 18% GST (Tax = Subtotal × 0.18), and yields Grand Total.",
    "    • Orders exceeding INR 50,000 mandate administrative countersignature before dispatch.",
    "▪  Append-Only Audit History: Every transition appends a timestamped history entry and an immutable audit log record."
]
setup_standard_slide(prs.slides[6], "CORE ENGINE 1: DETERMINISTIC PO STATE MACHINE :", slide7_items, font_size=Pt(13.5))

# ==============================================================================
# SLIDE 8: CORE ENGINE 2: SUPPLIER EVALUATION SCORECARD
# ==============================================================================
slide8_items = [
    "▪  Objective 4-Pillar Quantitative Evaluation Model:",
    "    1. Product Quality Conformity (Weight W₁ = 35%): Measures adherence to agreed engineering and material specifications.",
    "    2. Delivery Timeliness (Weight W₂ = 30%): Tracks on-time delivery rate against committed PO schedule dates.",
    "    3. Pricing Competitiveness (Weight W₃ = 20%): Evaluates quote stability and adherence to agreed commercial rates.",
    "    4. Compliance & Responsiveness (Weight W₄ = 15%): Assesses speed of order acknowledgment and statutory KYC validity.",
    "▪  Mathematical Composite Rating Formulation:",
    "    Composite Score = (Quality × 0.35) + (Delivery × 0.30) + (Pricing × 0.20) + (Compliance × 0.15)  [0 to 100 Scale]",
    "▪  Autonomous Tier Classification:",
    "    • Preferred (Score ≥ 85): Prime supplier; prioritized for bulk orders and high-value requisitions.",
    "    • Approved (Score 70 - 84): Standard qualified supplier meeting baseline operational expectations.",
    "    • On-Watch (Score 50 - 69): Warning state; restricted to minor orders pending performance improvement.",
    "    • Blacklisted (Score < 50): Immediate sourcing freeze; system blocks buyers from issuing new purchase orders."
]
setup_standard_slide(prs.slides[7], "CORE ENGINE 2: SUPPLIER EVALUATION SCORECARD :", slide8_items, font_size=Pt(13.5))

# ==============================================================================
# SLIDE 9: TECHNOLOGY STACK & IMPLEMENTATION ENVIRONMENT
# ==============================================================================
slide9_items = [
    "▪  Frontend Presentation Tier:",
    "    • React 18 / 19 SPA: Declarative component architecture for real-time reactivity and state synchronization.",
    "    • Vite 8.x Bundler: Ultra-fast Hot Module Replacement (HMR) and optimized production asset bundling.",
    "    • Tailwind CSS & Lucide Icons: Modern corporate UI with responsive white-and-red design tokens.",
    "▪  Backend Application & API Tier:",
    "    • Node.js (v20.x LTS): High-throughput non-blocking asynchronous event-loop architecture.",
    "    • Express.js (v4.21): Modular RESTful routing, custom middleware pipelines, and error handling.",
    "    • JSON Web Token (JWT) & bcryptjs: Cryptographic authentication with 10 salt rounds.",
    "▪  Database & Services Tier:",
    "    • MongoDB Atlas: Document-oriented cloud database providing rapid horizontal scaling and JSON-native BSON storage.",
    "    • Mongoose ODM: Schema validation, virtual population, and transactional hooks.",
    "    • Nodemailer (SMTP): Automated email notification pipeline alerting stakeholders at key order milestones."
]
setup_standard_slide(prs.slides[8], "TECHNOLOGY STACK & IMPLEMENTATION TOOLS :", slide9_items, font_size=Pt(13.5))

# ==============================================================================
# SLIDE 10: PROTOTYPE DEMONSTRATION & IMPLEMENTED MODULES
# ==============================================================================
slide10_items = [
    "▪  Module 1: Interactive Purchase Order Builder:",
    "    • Dynamic line-item creator allowing instant row addition, deletion, and recalculation.",
    "    • Auto-calculates quantities, unit rates, statutory 18% GST, and gross totals with zero client-side latency.",
    "    • Live vendor selector displaying current vendor tier badge and active contact details.",
    "▪  Module 2: Supplier Onboarding & KYC Management:",
    "    • Dedicated modal for onboarding supplier companies with PAN and 15-character GSTIN format validation.",
    "    • Manages supplier status transitions across Pending, Active, Inactive, and Blacklisted states.",
    "▪  Module 3: Purchase Order Lifecycle Tracker:",
    "    • Visual timeline stepper showing real-time milestone progress from Draft to Closed.",
    "    • Status-dependent action buttons (e.g., 'Submit for Approval', 'Send to Vendor', 'Acknowledge Order').",
    "▪  Module 4: Supplier Performance Analytics:",
    "    • Multi-criteria scorecard visualizer presenting pillar metrics and automated tier classification badges."
]
setup_standard_slide(prs.slides[9], "PROTOTYPE DEMONSTRATION & CORE MODULES :", slide10_items, font_size=Pt(13.5))

# ==============================================================================
# SLIDE 11: TESTING, VERIFICATION & AUDIT TRAIL
# ==============================================================================
# Slide 11 has shapes 0, 1 and then multiple boxes from 0th review. Let's make it a clean structured testing slide!
slide11 = prs.slides[10]
slide11.shapes[0].text_frame.clear()
slide11.shapes[0].text_frame.paragraphs[0].text = "TESTING, VERIFICATION & AUDIT TRAIL :"
slide11.shapes[0].text_frame.paragraphs[0].font.name = "Segoe UI"
slide11.shapes[0].text_frame.paragraphs[0].font.size = Pt(28)
slide11.shapes[0].text_frame.paragraphs[0].font.bold = True

# We can reuse the 5 rounded rectangles for 5 testing dimensions!
test_titles = [
    "API ROUTE TESTING\nVerified all REST endpoints (/auth, /orders, /vendors, /evaluations) across 25+ Postman test cases.",
    "FSM STATE GUARDS\nTested illegal transition rejection (e.g., Draft -> Delivered rejected with HTTP 400).",
    "TAX COMPUTATION\nVerified line-item aggregation and 18% GST calculation across fractional quantities and prices.",
    "SECURITY & RBAC\nTested expired tokens, header tampering rejection, and role privilege boundary enforcement.",
    "AUDIT TRAIL LOGGING\nConfirmed append-only logging of userId, action, timestamp, and state diffs for all transactions."
]
for idx, shape_idx in enumerate([2, 3, 4, 5, 6]):
    s = slide11.shapes[shape_idx]
    s.text_frame.clear()
    p = s.text_frame.paragraphs[0]
    p.text = test_titles[idx]
    p.font.name = "Segoe UI"
    p.font.size = Pt(13)
    p.font.bold = True

# Bottom banner on Slide 11 (Shape 7)
s_bot = slide11.shapes[7]
s_bot.text_frame.clear()
p_bot = s_bot.text_frame.paragraphs[0]
p_bot.text = "MILESTONE STATUS (1ST REVIEW): Core Full-Stack Prototype is 100% Implemented & Verified with Zero Compile Errors."
p_bot.font.name = "Segoe UI"
p_bot.font.size = Pt(15)
p_bot.font.bold = True
p_bot.alignment = PP_ALIGN.CENTER

# ==============================================================================
# SLIDE 12: WORK COMPLETED, FUTURE SCOPE & REFERENCES
# ==============================================================================
slide12_items = [
    "▪  Work Completed (Review-1 Milestone):",
    "    • Full-stack MERN architecture established and deployed locally with Vite + Express + MongoDB Atlas.",
    "    • Role-based authentication and secure session handling active for Admin, Buyer, and Vendor roles.",
    "    • 8-Stage deterministic PO Finite State Machine and automated 18% GST calculation engine functional.",
    "    • Supplier onboarding, KYC validation, and 4-pillar weighted scorecard operational.",
    "▪  Future Scope (Next Milestones for 2nd / Final Review):",
    "    1. Automated OCR Invoice Parsing: Integrating optical character recognition (Tesseract / Document AI) to auto-extract line items from uploaded supplier invoice PDFs (Three-Way Matching).",
    "    2. Real-Time WebSockets (Socket.io): Replacing polling with instant bi-directional push alerts for PO status changes.",
    "    3. Corporate Banking / Accounting Integration: Direct webhook integrations for automated payment clearing.",
    "▪  Key References:",
    "    • Chopra, S., & Meindl, P. (2016). Supply Chain Management: Strategy, Planning, and Operation. Pearson.",
    "    • Monczka, R. M., et al. (2020). Purchasing and Supply Chain Management. Cengage Learning.",
    "    • Fowler, M. (2018). Patterns of Enterprise Application Architecture. Addison-Wesley."
]
setup_standard_slide(prs.slides[11], "FUTURE SCOPE, MILESTONES & REFERENCES :", slide12_items, font_size=Pt(13))

prs.save(dst_path)
print(f"Successfully generated: {dst_path}")
