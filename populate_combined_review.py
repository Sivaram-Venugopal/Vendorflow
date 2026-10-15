import sys
import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN

sys.stdout.reconfigure(encoding='utf-8')

src_path = 'C:/Users/LAKSHMI/FSD/Combined Review.pptx'
dst_path = 'C:/Users/LAKSHMI/FSD/Combined Review.pptx'  # We can update it in place or save as VendorFlow_Combined_Review.pptx
out_path = 'C:/Users/LAKSHMI/FSD/VendorFlow_Combined_Review.pptx'
prs = pptx.Presentation(src_path)

print(f"Loaded Combined Review with {len(prs.slides)} slides.")

# ==============================================================================
# SLIDE 1: AGENDA & TITLE
# ==============================================================================
s1 = prs.slides[0]
s1.shapes[0].text_frame.text = "VENDORFLOW : AN ENTERPRISE MERN PROCUREMENT SYSTEM"
s1.shapes[0].text_frame.paragraphs[0].font.size = Pt(20)
s1.shapes[0].text_frame.paragraphs[0].font.bold = True

s1.shapes[1].text_frame.text = "Review 1 & 2 Presentation | Department of Information Technology"
s1.shapes[1].text_frame.paragraphs[0].font.size = Pt(14)

# Presenter and guide in Text 8
tb_agenda = s1.shapes[4].text_frame
tb_agenda.clear()

p_head = tb_agenda.paragraphs[0]
p_head.text = "Presented By: SIVARAM VENUGOPAL (310624205263)  |  Supervisor: Dr. S. BERLIN SHAMEEMA"
p_head.font.size = Pt(11)
p_head.font.bold = True
p_head.font.color.rgb = RGBColor(190, 40, 40)
p_head.space_after = Pt(10)

agenda_items = [
    "1. Requirements (Functional & Non-Functional Specifications)",
    "2. Detailed System Architecture & Multi-Tier Execution Pipeline",
    "3. UML Use Case & MongoDB Entity-Relationship (ER) Diagrams",
    "4. Core Module Breakdown & Role-Based Access Control (RBAC)",
    "5. Full MERN Technology Stack & Supporting Libraries",
    "6. UI Design, Wireframes & Process Sequence Flows",
    "7. Frontend & Backend Core Implementation Modules",
    "8. Database Integration, Schema Models & RESTful APIs",
    "9. Module-wise Implementation Progress Status (75% Complete)",
    "10. Working Application Screenshots (Prepared Demonstration Slots)",
    "11. Engineering Challenges Encountered & Practical Solutions",
    "12. Remaining Work, Next Milestones & Key References"
]
for item in agenda_items:
    p = tb_agenda.add_paragraph()
    p.text = item
    p.font.size = Pt(9.5)
    p.space_after = Pt(2)

s1.shapes[6].text_frame.text = "Review 1 & 2  |  VendorFlow MERN Stack Project"

# ==============================================================================
# SLIDE 2: REQUIREMENTS (FUNCTIONAL & NON-FUNCTIONAL)
# ==============================================================================
s2 = prs.slides[1]
# Shape 7 is Functional Requirements text
tb_func = s2.shapes[7].text_frame
tb_func.clear()
func_items = [
    "• User registration & stateless JWT auth for Admin, Buyer, and Vendor",
    "• Supplier KYC Onboarding with PAN and 15-character statutory GSTIN validation",
    "• Interactive PO Builder with dynamic line items & live 18% GST calculation",
    "• Deterministic 8-Stage PO Finite State Machine (Draft ➔ Closed)",
    "• Multi-pillar supplier evaluation scorecard (Quality, Delivery, Price, Compliance)",
    "• Append-only audit logging recording all state changes and actor IDs"
]
for idx, it in enumerate(func_items):
    p = tb_func.paragraphs[0] if idx == 0 else tb_func.add_paragraph()
    p.text = it
    p.font.size = Pt(10)
    p.space_after = Pt(4)

# Shape 10 is Non-Functional Requirements text
tb_nonfunc = s2.shapes[10].text_frame
tb_nonfunc.clear()
nonfunc_items = [
    "• Performance: Sub-100ms API response time via MongoDB compound indexing",
    "• Security: Irreversible bcrypt hashing (10 salt rounds), JWT route guards, CORS",
    "• Reliability: Deterministic transition guards preventing illegal status jumps",
    "• Usability: Modern, responsive white-and-red UI built with Tailwind CSS & Lucide icons",
    "• Scalability: Horizontally scalable stateless Node/Express backend & Atlas cloud storage",
    "• Maintainability: Modular MVC architecture with isolated routers and controllers"
]
for idx, it in enumerate(nonfunc_items):
    p = tb_nonfunc.paragraphs[0] if idx == 0 else tb_nonfunc.add_paragraph()
    p.text = it
    p.font.size = Pt(10)
    p.space_after = Pt(4)

s2.shapes[12].text_frame.text = "Review 1 & 2  |  VendorFlow MERN Stack Project"

# ==============================================================================
# SLIDE 3: ARCHITECTURE (DETAILED) - INSERT DIAGRAM
# ==============================================================================
s3 = prs.slides[2]
s3.shapes[7].text_frame.text = "React 18 / 19 SPA, Vite Bundler, Tailwind CSS, Lucide Icons, Axios Client"
s3.shapes[11].text_frame.text = "Node.js v20 LTS + Express.js REST API, JWT Auth Guards, RBAC Middleware, FSM Engine"
s3.shapes[15].text_frame.text = "MongoDB Atlas Cloud NoSQL + Mongoose ODM (Users, Vendors, POs, Evaluations, Logs)"
s3.shapes[16].text_frame.text = "HTTP/HTTPS requests carry Bearer JWT tokens through security filters into business controllers, with atomic state updates persisted in MongoDB and alerts dispatched via Nodemailer SMTP."

# Remove placeholder text in Shape 18 and add architecture image
sp18 = s3.shapes[18]._element
sp18.getparent().remove(sp18)
sp17 = s3.shapes[17]._element
sp17.getparent().remove(sp17)

arch_img_path = 'C:/Users/LAKSHMI/FSD/docs/images/figure_4_1_architecture.png'
s3.shapes.add_picture(arch_img_path, Inches(1.2), Inches(5.1), Inches(10.8), Inches(1.75))

# ==============================================================================
# SLIDE 4: USE CASE DIAGRAM - INSERT DIAGRAM
# ==============================================================================
s4 = prs.slides[3]
# Remove placeholder box 5 and text 6
sp6 = s4.shapes[6]._element
sp6.getparent().remove(sp6)
sp5 = s4.shapes[5]._element
sp5.getparent().remove(sp5)

use_case_img = 'C:/Users/LAKSHMI/FSD/docs/images/use_case_diagram.png'
s4.shapes.add_picture(use_case_img, Inches(1.15), Inches(1.85), Inches(6.4), Inches(4.3))

# Update right side text (Shape 9)
tb_uc_right = s4.shapes[7].text_frame # wait, check shape index after removal
for sh in s4.shapes:
    if sh.has_text_frame and "Identify all actors" in sh.text:
        sh.text_frame.clear()
        uc_details = [
            "IDENTIFIED ACTORS:",
            "• Administrator: Oversees platform governance, validates supplier KYC, approves high-value POs.",
            "• Procurement Buyer: Authors purchase orders, inputs dynamic line items, evaluates vendor ratings.",
            "• Supplier (Vendor): Acknowledges POs, updates fulfillment status, submits commercial invoices.",
            "",
            "CORE SYSTEM USE CASES:",
            "• UC1: Stateless JWT Authentication & Role Verification",
            "• UC2: Vendor KYC Onboarding & GSTIN Format Validation",
            "• UC3: PO Drafting with Real-Time 18% GST Computation",
            "• UC4: Deterministic PO State Machine Transition & Approval",
            "• UC5: Order Acknowledgment & Delivery Milestone Updates",
            "• UC6: Multi-Pillar Quantitative Vendor Scorecard Rating",
            "• UC7: Immutable Chronological Audit Trail Logging"
        ]
        for idx, line in enumerate(uc_details):
            p = sh.text_frame.paragraphs[0] if idx == 0 else sh.text_frame.add_paragraph()
            p.text = line
            p.font.size = Pt(8.5) if line.startswith("•") else Pt(9.5)
            p.font.bold = False if line.startswith("•") else True
            p.space_after = Pt(2)
        break

# ==============================================================================
# SLIDE 5: ER DIAGRAM / DATABASE DESIGN - INSERT DIAGRAM
# ==============================================================================
s5 = prs.slides[4]
for sh in list(s5.shapes):
    if sh.has_text_frame and "Insert your ER Diagram" in sh.text:
        el = sh._element
        el.getparent().remove(el)
        break

er_img = 'C:/Users/LAKSHMI/FSD/docs/images/er_diagram.png'
s5.shapes.add_picture(er_img, Inches(1.15), Inches(1.85), Inches(6.4), Inches(4.3))

# Update right side text on ER slide
for sh in s5.shapes:
    if sh.has_text_frame and "List entities and attributes" in sh.text:
        sh.text_frame.clear()
        er_details = [
            "CORE COLLECTIONS & SCHEMAS:",
            "• Users: Credentials, bcrypt hash, role (admin, buyer, vendor).",
            "• Vendors: Company profile, 15-char GSTIN, PAN, tierRating, overallScore.",
            "• PurchaseOrders: poNumber (unique), vendorId (FK), buyerId (FK), status (8-state enum), items array, subtotal, taxAmount, grandTotal.",
            "• LineItems: Embedded sub-schema inside PO (description, quantity, unitPrice, gstRate=0.18, lineTotal).",
            "• Evaluations: Periodic supplier scores (quality 35%, delivery 30%, pricing 20%, compliance 15%), compositeScore, tierAssigned.",
            "• AuditLogs: Append-only ledger (entityId, entityType, userId, action, fromState, toState, timestamp).",
            "",
            "KEY RELATIONSHIPS:",
            "• User 1:N PurchaseOrder (Buyer requisition)",
            "• Vendor 1:N PurchaseOrder (Order issuance)",
            "• PurchaseOrder 1:N LineItem (Strict composition)",
            "• Vendor 1:N Evaluation (Periodic scorecard)",
            "• User 1:N AuditLog (Action traceability)"
        ]
        for idx, line in enumerate(er_details):
            p = sh.text_frame.paragraphs[0] if idx == 0 else sh.text_frame.add_paragraph()
            p.text = line
            p.font.size = Pt(8.5) if line.startswith("•") else Pt(9.5)
            p.font.bold = False if line.startswith("•") else True
            p.space_after = Pt(2)
        break

# ==============================================================================
# SLIDE 6: MODULE DESCRIPTION TABLE
# ==============================================================================
s6 = prs.slides[5]
t6 = s6.shapes[5].table
modules_data = [
    ("Authentication & RBAC", "Stateless JWT issuance, role verification guards, bcrypt password hashing", "Signup, Login, verifyToken, authorizeRoles"),
    ("Vendor KYC Onboarding", "Self-service supplier profile creation, tax credentials (PAN, GSTIN) verification", "OnboardVendor, VerifyGSTIN, UpdateVendorStatus"),
    ("PO Lifecycle & FSM Engine", "8-stage state machine governance, line aggregation, 18% GST auto-calculation", "CreatePO, CalculateTotals, TransitionState"),
    ("Supplier Scorecard Engine", "Quantitative 4-pillar evaluation model, automated performance tier mapping", "EvaluateSupplier, ComputeComposite, UpdateTier"),
    ("Audit & Notification Engine", "Immutable event ledger, before/after diffs, Nodemailer SMTP email dispatch", "RecordAuditLog, SendPODispatchAlert")
]
for r_idx, row_data in enumerate(modules_data):
    for c_idx, val in enumerate(row_data):
        cell = t6.cell(r_idx + 1, c_idx)
        cell.text = val
        cell.text_frame.paragraphs[0].font.size = Pt(9.5)

# ==============================================================================
# SLIDE 7: TECH STACK
# ==============================================================================
s7 = prs.slides[6]
s7.shapes[6].text_frame.paragraphs[0].text = "NoSQL Document Database (MongoDB Atlas, Mongoose ODM v8.x, Compound Indexes)"
s7.shapes[6].text_frame.paragraphs[0].font.size = Pt(9.5)

s7.shapes[9].text_frame.paragraphs[0].text = "RESTful API Server Framework (Express.js v4.21, Modular Controllers, Route Guards)"
s7.shapes[9].text_frame.paragraphs[0].font.size = Pt(9.5)

s7.shapes[12].text_frame.paragraphs[0].text = "Declarative SPA Framework (React 18 / 19, Vite 8.x Bundler, React Router v6)"
s7.shapes[12].text_frame.paragraphs[0].font.size = Pt(9.5)

s7.shapes[15].text_frame.paragraphs[0].text = "Asynchronous Event-Loop Runtime (Node.js v20.x LTS, Non-blocking I/O Operations)"
s7.shapes[15].text_frame.paragraphs[0].font.size = Pt(9.5)

# Supporting tools
tb_tools = s7.shapes[17].text_frame
tb_tools.clear()
tools_items = [
    "• Mongoose (ODM with validation & virtuals)",
    "• JWT & bcryptjs (Token auth & 10 salt rounds)",
    "• Tailwind CSS & Lucide (Modern UI tokens)",
    "• Nodemailer (SMTP email notification engine)",
    "• Axios (HTTP client with auth interceptors)",
    "• Postman & Overleaf (API tests & project thesis)"
]
for idx, it in enumerate(tools_items):
    p = tb_tools.paragraphs[0] if idx == 0 else tb_tools.add_paragraph()
    p.text = it
    p.font.size = Pt(9)
    p.space_after = Pt(2)

# ==============================================================================
# SLIDE 8: UI DESIGN / WIREFRAMES - INSERT SEQUENCE / PROCESS FLOW
# ==============================================================================
s8 = prs.slides[7]
for sh in list(s8.shapes):
    if sh.has_text_frame and "Insert wireframes" in sh.text:
        el = sh._element
        el.getparent().remove(el)
        break

ui_img = 'C:/Users/LAKSHMI/FSD/docs/images/figure_4_3_sequence_diagram.png'
s8.shapes.add_picture(ui_img, Inches(1.15), Inches(1.85), Inches(6.4), Inches(4.3))

# Update right side text on UI design slide
for sh in s8.shapes:
    if sh.has_text_frame and "Show key screen wireframes" in sh.text:
        sh.text_frame.clear()
        ui_details = [
            "INTERACTION & UI ARCHITECTURE:",
            "• Role-Based Workspaces: Tailored navigation for Admin (Governance), Buyer (Purchasing), and Vendor (Fulfillment).",
            "• Purchase Order Builder: Dynamic line item calculator with live subtotal and statutory 18% GST recalculation.",
            "• State Machine Stepper: Visual 8-stage progress tracker showing active milestones and historical timestamps.",
            "• Supplier Scorecard Radar: Visual scorecard presenting multi-pillar ratings and performance tier badges.",
            "",
            "ERGONOMICS & DESIGN SYSTEM:",
            "• Clean corporate white-and-red design tokens.",
            "• Built with Plus Jakarta Sans typography.",
            "• Real-time input validation & instant error prompts.",
            "• 100% responsive across desktop and tablet."
        ]
        for idx, line in enumerate(ui_details):
            p = sh.text_frame.paragraphs[0] if idx == 0 else sh.text_frame.add_paragraph()
            p.text = line
            p.font.size = Pt(8.5) if line.startswith("•") else Pt(9.5)
            p.font.bold = False if line.startswith("•") else True
            p.space_after = Pt(2)
        break

# ==============================================================================
# SLIDE 9: FRONTEND DEVELOPMENT
# ==============================================================================
s9 = prs.slides[8]
tb9 = s9.shapes[5].text_frame
tb9.clear()
fe_items = [
    "• Single Page Application (SPA): Developed using React 18 / 19 and bundled with Vite 8.x for instant Hot Module Replacement (HMR).",
    "• Modular Component Hierarchy: Implemented dedicated reusable components: POBuilder, VendorList, ScorecardCard, StateStepper, and AddCompanyModal.",
    "• Dynamic Line-Item Calculator: Real-time hooks compute quantities, unit prices, statutory 18% GST, and gross total with zero client latency.",
    "• State Management & Context API: Global session context synchronizes user role, active token, and real-time order state across views.",
    "• Protected Client Routing: React Router v6 with RouteGuard components restricting unauthorized role views.",
    "• Axios Interceptors: Automatically attaches Bearer JWT tokens to outbound headers and handles 401/403 session expiration.",
    "• Enterprise Styling: Modern corporate White-and-Red UI styled using Tailwind CSS utility tokens and Lucide React icons."
]
for idx, it in enumerate(fe_items):
    p = tb9.paragraphs[0] if idx == 0 else tb9.add_paragraph()
    p.text = it
    p.font.size = Pt(11)
    p.space_after = Pt(5)

# ==============================================================================
# SLIDE 10: BACKEND DEVELOPMENT
# ==============================================================================
s10 = prs.slides[9]
tb10 = s10.shapes[5].text_frame
tb10.clear()
be_items = [
    "• Asynchronous Server Architecture: Node.js (v20.x LTS) with Express.js adhering strictly to the Model-View-Controller (MVC) pattern.",
    "• Modular REST API Routing: Dedicated endpoint routers (/api/auth, /api/orders, /api/vendors, /api/evaluations, /api/audit-logs).",
    "• Deterministic FSM State Engine: Server-side VALID_TRANSITIONS lookup table strictly validates legal stage transitions (Draft ➔ Closed).",
    "• Cryptographic Security: Passwords salted and hashed with bcryptjs (10 salt rounds); stateless JWTs signed using HMAC-SHA256.",
    "• Middleware Pipeline: Custom verifyToken checks authentication; authorizeRoles('admin', 'buyer') enforces granular RBAC privileges.",
    "• Real-Time Tax & Fiscal Calculation: Automatically calculates itemized line totals and enforces 18% GST before database persistence.",
    "• Centralized Error Handling: Global Express error handler catches validation exceptions, preventing unhandled process crashes."
]
for idx, it in enumerate(be_items):
    p = tb10.paragraphs[0] if idx == 0 else tb10.add_paragraph()
    p.text = it
    p.font.size = Pt(11)
    p.space_after = Pt(5)

# ==============================================================================
# SLIDE 11: DATABASE INTEGRATION
# ==============================================================================
s11 = prs.slides[10]
tb11 = s11.shapes[5].text_frame
tb11.clear()
db_items = [
    "• Cloud Data Store: Hosted on MongoDB Atlas providing automated scaling, high availability, and native JSON/BSON document storage.",
    "• Mongoose Schemas & Data Constraints: Defined schemas for Users, Vendors, PurchaseOrders, Evaluations, and AuditLogs.",
    "• Referential Integrity & Population: Leveraged Mongoose ObjectId references to connect PurchaseOrders with Buyers and Vendors.",
    "• Embedded Sub-Schemas: Modeled LineItem and StateHistory as embedded sub-documents within PurchaseOrder for atomic consistency.",
    "• Query Performance Optimization: Implemented compound indexes on { vendorId: 1, status: 1 } for sub-100ms dashboard queries.",
    "• Transactional Atomicity: findByIdAndUpdate routines ensure order state updates and audit log appends occur consistently.",
    "• Append-Only Audit Ledger: AuditLog collection captures actor ID, action type, timestamp, and state diffs for complete auditability."
]
for idx, it in enumerate(db_items):
    p = tb11.paragraphs[0] if idx == 0 else tb11.add_paragraph()
    p.text = it
    p.font.size = Pt(11)
    p.space_after = Pt(5)

# ==============================================================================
# SLIDE 12: API DEVELOPMENT TABLE
# ==============================================================================
s12 = prs.slides[11]
t12 = s12.shapes[5].table
api_data = [
    ("POST", "/api/auth/login", "Authenticate user credentials & issue cryptographically signed JWT"),
    ("POST", "/api/orders", "Create a new purchase order with automatic 18% GST computation"),
    ("PUT", "/api/orders/:id/status", "Enforce FSM state transition, record history & log audit entry"),
    ("POST", "/api/vendors", "Onboard a new supplier company with PAN & 15-char GSTIN validation"),
    ("POST", "/api/evaluations", "Submit 4-pillar scores, compute composite rating & assign tier"),
    ("GET", "/api/audit-logs", "Fetch immutable transaction audit records filtered by entity or user")
]
for r_idx, row_data in enumerate(api_data):
    for c_idx, val in enumerate(row_data):
        cell = t12.cell(r_idx + 1, c_idx)
        cell.text = val
        cell.text_frame.paragraphs[0].font.size = Pt(9.5)

# ==============================================================================
# SLIDE 13: MODULE-WISE STATUS
# ==============================================================================
s13 = prs.slides[12]
s13.shapes[5].text_frame.text = "User Authentication & RBAC"
s13.shapes[8].text_frame.text = "100%"

s13.shapes[9].text_frame.text = "PO Builder & 18% GST Engine"
s13.shapes[12].text_frame.text = "100%"

s13.shapes[13].text_frame.text = "Deterministic FSM State Machine"
s13.shapes[16].text_frame.text = "100%"

s13.shapes[17].text_frame.text = "Supplier KYC & Scorecard Engine"
s13.shapes[20].text_frame.text = "90%"

s13.shapes[21].text_frame.text = "Frontend UI & Core Steppers"
s13.shapes[24].text_frame.text = "85%"

s13.shapes[25].text_frame.text = "Email Notifications (SMTP)"
s13.shapes[28].text_frame.text = "70%"

# ==============================================================================
# SLIDE 14: SCREENSHOTS PLACEHOLDERS (AS REQUESTED)
# ==============================================================================
s14 = prs.slides[13]
s14.shapes[6].text_frame.text = "[ Screenshot 1: User Login & Role-Based Dashboard ]\n(Ready for image upload)"
s14.shapes[8].text_frame.text = "[ Screenshot 2: Interactive PO Builder & 18% GST Calculator ]\n(Ready for image upload)"
s14.shapes[10].text_frame.text = "[ Screenshot 3: Vendor Onboarding & KYC Approval Modal ]\n(Ready for image upload)"
s14.shapes[12].text_frame.text = "[ Screenshot 4: 4-Pillar Supplier Scorecard & Performance Tiers ]\n(Ready for image upload)"

# ==============================================================================
# SLIDE 15: CHALLENGES FACED & SOLUTIONS TABLE
# ==============================================================================
s15 = prs.slides[14]
t15 = s15.shapes[5].table
challenges_data = [
    ("Out-of-order PO state transitions", "Designed and enforced server-side deterministic FSM transition lookup table"),
    ("Real-time multi-line tax and subtotal calculation", "Implemented synchronous aggregation hooks in React with 18% statutory GST formula"),
    ("Subjective supplier performance evaluations", "Formulated an objective 4-pillar weighted linear scorecard model (Quality, Delivery, Price, Compliance)"),
    ("Attribute mismatch between client DTOs and Mongoose schema", "Normalized schema property naming (vendorId, deliveryDate) across controllers and validators")
]
for r_idx, row_data in enumerate(challenges_data):
    for c_idx, val in enumerate(row_data):
        cell = t15.cell(r_idx + 1, c_idx)
        cell.text = val
        cell.text_frame.paragraphs[0].font.size = Pt(9.5)

# ==============================================================================
# SLIDE 16: NEXT STEPS & REMAINING WORK
# ==============================================================================
s16 = prs.slides[15]
tb16 = s16.shapes[5].text_frame
tb16.clear()
next_items = [
    "• Automated OCR Invoice Matching: Integrate Tesseract / Document AI to auto-extract line items from uploaded supplier invoice PDFs (Three-Way Matching).",
    "• Real-Time WebSockets: Replace intermittent polling with bidirectional Socket.io connections for instant dispatch and approval push alerts.",
    "• Corporate Banking / Payment Gateway APIs: Implement webhooks for automated financial settlement once goods receipt notes (GRN) and invoices are cleared.",
    "• Advanced Spend Analytics: Build predictive spend forecasting models to anticipate inventory reorder points and optimize supplier volume discounts.",
    "• Cloud Production Deployment: Deploy client SPA on Vercel/Netlify and Express backend on Render/AWS with MongoDB Atlas production cluster.",
    "• Comprehensive Documentation: Finalize project dissertation, system documentation, and video demonstration for final review."
]
for idx, it in enumerate(next_items):
    p = tb16.paragraphs[0] if idx == 0 else tb16.add_paragraph()
    p.text = it
    p.font.size = Pt(11)
    p.space_after = Pt(6)

# ==============================================================================
# SLIDE 17: REFERENCES TABLE
# ==============================================================================
s17 = prs.slides[16]
t17 = s17.shapes[5].table
refs_data = [
    ("1", "Chopra, S., & Meindl, P. (2016). Supply Chain Management: Strategy, Planning, and Operation, 6th ed., Pearson Education."),
    ("2", "Monczka, R. M., et al. (2020). Purchasing and Supply Chain Management, 7th ed., Cengage Learning, Boston."),
    ("3", "Fowler, M. (2018). Patterns of Enterprise Application Architecture, Addison-Wesley Professional."),
    ("4", "Goods and Services Tax Network (GSTN), Ministry of Finance, Govt of India (2023). Standard Operating Procedures.")
]
for r_idx, row_data in enumerate(refs_data):
    for c_idx, val in enumerate(row_data):
        cell = t17.cell(r_idx + 1, c_idx)
        cell.text = val
        cell.text_frame.paragraphs[0].font.size = Pt(9.5)

# Save both in place and as new file
prs.save(out_path)
prs.save(dst_path)
print(f"Successfully generated: {out_path} and updated {dst_path}")
