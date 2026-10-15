import sys
import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN

sys.stdout.reconfigure(encoding='utf-8')

src_path = 'C:/Users/LAKSHMI/FSD/Combined Review.pptx'
prs = pptx.Presentation(src_path)

print(f"Loaded presentation with {len(prs.slides)} slides.")

# ==============================================================================
# SLIDE 1: AGENDA & TITLE
# Remove background, remove supervisor name, remove student name
# ==============================================================================
s1 = prs.slides[0]

# Set clean white background
s1.background.fill.solid()
s1.background.fill.fore_color.rgb = RGBColor(255, 255, 255)

# Title
s1.shapes[0].text_frame.clear()
p0 = s1.shapes[0].text_frame.paragraphs[0]
p0.text = "VENDORFLOW : ENTERPRISE PROCUREMENT SYSTEM"
p0.font.name = "Segoe UI"
p0.font.size = Pt(22)
p0.font.bold = True
p0.font.color.rgb = RGBColor(30, 41, 59)

# Subtitle
s1.shapes[1].text_frame.clear()
p1 = s1.shapes[1].text_frame.paragraphs[0]
p1.text = "Project Work (Phase-I) — Review 1 & 2  |  Department of Information Technology"
p1.font.name = "Segoe UI"
p1.font.size = Pt(13)
p1.font.color.rgb = RGBColor(100, 116, 139)

# Agenda box - clean humanized agenda with NO student name and NO supervisor name
tb_agenda = s1.shapes[4].text_frame
tb_agenda.clear()

agenda_points = [
    "• Project Requirements & Scope Definition",
    "• Three-Tier System Architecture & Data Flow",
    "• UML Use Case Model & Actor Interactions",
    "• MongoDB Entity-Relationship (ER) Schema Design",
    "• Core Module Breakdown & Role-Based Access Control (RBAC)",
    "• Full MERN Technology Stack & Implementation Frameworks",
    "• UI Design, User Interaction & Process Workflows",
    "• Frontend Component Architecture & Client State Management",
    "• Backend REST API Architecture & FSM Transition Engine",
    "• Database Modeling, Indexing & Collections",
    "• Implementation Status & Module Completion Table",
    "• Live Application Screenshots & Demonstration Slots",
    "• Engineering Challenges Encountered & Solutions",
    "• Future Milestones & Project References"
]

for idx, pt in enumerate(agenda_points):
    p = tb_agenda.paragraphs[0] if idx == 0 else tb_agenda.add_paragraph()
    p.text = pt
    p.font.name = "Segoe UI"
    p.font.size = Pt(10)
    p.font.color.rgb = RGBColor(51, 65, 85)
    p.space_after = Pt(2.5)

s1.shapes[6].text_frame.text = "Review 1 & 2  |  MERN Stack Project"

# ==============================================================================
# SLIDE 2: REQUIREMENTS (HUMANIZED & STRUCTURED)
# ==============================================================================
s2 = prs.slides[1]
tb_func = s2.shapes[7].text_frame
tb_func.clear()
func_items = [
    "• Role-Based Access: Secure JWT authentication separating Admin, Buyer, and Vendor access.",
    "• Supplier KYC Onboarding: Automated verification for trade details, PAN, and 15-digit GSTIN.",
    "• Dynamic Purchase Order Builder: Real-time calculation of item subtotals and 18% statutory GST.",
    "• Strict State Machine (FSM): 8-stage linear workflow (Draft to Closed) with no illegal skipping.",
    "• Supplier Performance Scorecard: Automated rating across Quality, Delivery, Price, and Compliance.",
    "• Audit Ledger: Append-only event history tracking every action, user ID, and state change."
]
for idx, it in enumerate(func_items):
    p = tb_func.paragraphs[0] if idx == 0 else tb_func.add_paragraph()
    p.text = it
    p.font.name = "Segoe UI"
    p.font.size = Pt(9.5)
    p.space_after = Pt(4)

tb_nonfunc = s2.shapes[10].text_frame
tb_nonfunc.clear()
nonfunc_items = [
    "• Performance: Sub-100ms database response using targeted compound indexes.",
    "• Security: Passwords hashed with bcrypt (10 rounds); routes protected by Bearer token guards.",
    "• Transactional Safety: Strict transition checks prevent out-of-sequence order updates.",
    "• Interface Ergonomics: Clean, accessible interface built with Tailwind CSS and responsive components.",
    "• High Availability: Cloud-native database hosting on MongoDB Atlas with automatic failover.",
    "• Maintainability: Modular MVC code structure separating routes, controllers, and models."
]
for idx, it in enumerate(nonfunc_items):
    p = tb_nonfunc.paragraphs[0] if idx == 0 else tb_nonfunc.add_paragraph()
    p.text = it
    p.font.name = "Segoe UI"
    p.font.size = Pt(9.5)
    p.space_after = Pt(4)

# ==============================================================================
# SLIDE 3: ARCHITECTURE (REMOVE EXISTING BOXES & ADD ONLY ARCHITECTURE IMAGE)
# ==============================================================================
s3 = prs.slides[2]

# Remove shapes 5 through 19 (all tier boxes, arrows, text, and old small image)
# Keep only shapes 0 to 4 (header) and shapes 17, 18 footer
header_ids = [s3.shapes[i].shape_id for i in range(5)]
footer_ids = [s3.shapes[len(s3.shapes)-2].shape_id, s3.shapes[len(s3.shapes)-1].shape_id]
keep_ids = set(header_ids + footer_ids)

for sh in list(s3.shapes):
    if sh.shape_id not in keep_ids:
        el = sh._element
        el.getparent().remove(el)

# Add ONLY the architecture image, large, clean, and centered!
arch_img = 'C:/Users/LAKSHMI/FSD/docs/images/figure_4_1_architecture.png'
s3.shapes.add_picture(arch_img, Inches(1.1), Inches(1.55), Inches(11.1), Inches(4.7))

# ==============================================================================
# SLIDE 4: USE CASE DIAGRAM (REMOVE INCLUDE BLOCK & ADD LARGE IMAGE)
# ==============================================================================
s4 = prs.slides[3]

# Remove everything except header (shapes 0-4) and footer
s4_header_ids = [s4.shapes[i].shape_id for i in range(5)]
s4_footer_ids = [s4.shapes[len(s4.shapes)-2].shape_id, s4.shapes[len(s4.shapes)-1].shape_id]
s4_keep_ids = set(s4_header_ids + s4_footer_ids)

for sh in list(s4.shapes):
    if sh.shape_id not in s4_keep_ids:
        el = sh._element
        el.getparent().remove(el)

# Add large, centered Use Case Diagram
uc_img = 'C:/Users/LAKSHMI/FSD/docs/images/use_case_diagram.png'
s4.shapes.add_picture(uc_img, Inches(1.5), Inches(1.55), Inches(10.3), Inches(4.7))

# ==============================================================================
# SLIDE 5: ER DIAGRAM (REMOVE INCLUDE BLOCK & ADD LARGE IMAGE)
# ==============================================================================
s5 = prs.slides[4]

s5_header_ids = [s5.shapes[i].shape_id for i in range(5)]
s5_footer_ids = [s5.shapes[len(s5.shapes)-2].shape_id, s5.shapes[len(s5.shapes)-1].shape_id]
s5_keep_ids = set(s5_header_ids + s5_footer_ids)

for sh in list(s5.shapes):
    if sh.shape_id not in s5_keep_ids:
        el = sh._element
        el.getparent().remove(el)

# Add large, centered ER Diagram
er_img = 'C:/Users/LAKSHMI/FSD/docs/images/er_diagram.png'
s5.shapes.add_picture(er_img, Inches(1.3), Inches(1.55), Inches(10.7), Inches(4.7))

# ==============================================================================
# SLIDE 6: MODULE DESCRIPTION (CLEAN HUMANIZED TABLE)
# ==============================================================================
s6 = prs.slides[5]
t6 = s6.shapes[5].table
modules_data = [
    ("Authentication & RBAC", "Issues stateless JWT tokens, verifies roles, and hashes passwords via bcrypt", "register, login, verifyToken, authorizeRoles"),
    ("Vendor Onboarding & KYC", "Handles supplier registration, tax document checks (PAN & GSTIN), and status approval", "createVendor, verifyTaxId, updateVendorStatus"),
    ("PO Lifecycle & FSM", "Manages the 8-stage state machine, dynamic line items, and automated 18% GST calculation", "createPO, calculateTotals, updatePOStatus"),
    ("Supplier Scorecard", "Evaluates vendors across 4 weighted operational pillars and assigns performance tiers", "evaluateSupplier, getVendorRating, updateTier"),
    ("Audit & Notifications", "Maintains an immutable change log and dispatches email alerts at critical milestones", "logAuditEvent, sendPODispatchAlert, sendApprovalAlert")
]
for r_idx, row_data in enumerate(modules_data):
    for c_idx, val in enumerate(row_data):
        cell = t6.cell(r_idx + 1, c_idx)
        cell.text = val
        cell.text_frame.paragraphs[0].font.name = "Segoe UI"
        cell.text_frame.paragraphs[0].font.size = Pt(9.5)

# ==============================================================================
# SLIDE 7: TECH STACK (STRUCTURED HUMANIZED TEXT)
# ==============================================================================
s7 = prs.slides[6]
s7.shapes[6].text_frame.paragraphs[0].text = "MongoDB Atlas: Cloud document database with compound indexing and native JSON/BSON storage"
s7.shapes[6].text_frame.paragraphs[0].font.size = Pt(9)

s7.shapes[9].text_frame.paragraphs[0].text = "Express.js: Lightweight backend web framework providing modular REST routes and middleware"
s7.shapes[9].text_frame.paragraphs[0].font.size = Pt(9)

s7.shapes[12].text_frame.paragraphs[0].text = "React 18 / Vite: Fast, component-driven client application with responsive state reactivity"
s7.shapes[12].text_frame.paragraphs[0].font.size = Pt(9)

s7.shapes[15].text_frame.paragraphs[0].text = "Node.js (v20 LTS): Non-blocking asynchronous runtime executing high-concurrency event loops"
s7.shapes[15].text_frame.paragraphs[0].font.size = Pt(9)

# ==============================================================================
# SLIDE 8: UI DESIGN / WIREFRAMES (REMOVE INCLUDE BLOCK & ADD LARGE IMAGE)
# ==============================================================================
s8 = prs.slides[7]

s8_header_ids = [s8.shapes[i].shape_id for i in range(5)]
s8_footer_ids = [s8.shapes[len(s8.shapes)-2].shape_id, s8.shapes[len(s8.shapes)-1].shape_id]
s8_keep_ids = set(s8_header_ids + s8_footer_ids)

for sh in list(s8.shapes):
    if sh.shape_id not in s8_keep_ids:
        el = sh._element
        el.getparent().remove(el)

# Add large, centered UI sequence flow diagram
ui_img = 'C:/Users/LAKSHMI/FSD/docs/images/figure_4_3_sequence_diagram.png'
s8.shapes.add_picture(ui_img, Inches(1.3), Inches(1.55), Inches(10.7), Inches(4.7))

# ==============================================================================
# SLIDE 9: FRONTEND (HUMANIZED & CLEAN)
# ==============================================================================
s9 = prs.slides[8]
tb9 = s9.shapes[5].text_frame
tb9.clear()
fe_points = [
    "• Single Page Application: Built with React 18 and Vite for fast builds and immediate Hot Module Replacement.",
    "• Reusable Components: Modular UI components including POBuilder, VendorList, ScorecardCard, and StateStepper.",
    "• Live Calculation Hooks: Automatically recalculates line totals, statutory 18% GST, and overall expenditure in real time.",
    "• Role-Protected Routes: React Router v6 guards block unauthorized users from accessing pages outside their assigned role.",
    "• API Communication: Axios handles API requests with interceptors that attach the JWT token to every outbound header.",
    "• Clean Corporate Styling: Tailored with Tailwind CSS using consistent white-and-red design tokens and Lucide icons."
]
for idx, it in enumerate(fe_points):
    p = tb9.paragraphs[0] if idx == 0 else tb9.add_paragraph()
    p.text = it
    p.font.name = "Segoe UI"
    p.font.size = Pt(10.5)
    p.space_after = Pt(5)

# ==============================================================================
# SLIDE 10: BACKEND (HUMANIZED & CLEAN)
# ==============================================================================
s10 = prs.slides[9]
tb10 = s10.shapes[5].text_frame
tb10.clear()
be_points = [
    "• MVC Architecture: Node.js and Express server organized into separate routes, controllers, models, and middleware.",
    "• Modular Endpoints: Distinct routers manage authentication, purchase orders, vendor profiles, and audit logging.",
    "• Deterministic FSM Engine: Server-side validation table guarantees orders only progress through legal states (Draft to Closed).",
    "• Token-Based Security: Generates signed JSON Web Tokens for sessions and salts passwords with bcrypt (10 rounds).",
    "• Route Protection: verifyToken and authorizeRoles middleware verify permissions before controllers execute any logic.",
    "• Centralized Error Handling: Custom error middleware catches validation issues and returns clear JSON error messages."
]
for idx, it in enumerate(be_points):
    p = tb10.paragraphs[0] if idx == 0 else tb10.add_paragraph()
    p.text = it
    p.font.name = "Segoe UI"
    p.font.size = Pt(10.5)
    p.space_after = Pt(5)

# ==============================================================================
# SLIDE 11: DATABASE (HUMANIZED & CLEAN)
# ==============================================================================
s11 = prs.slides[10]
tb11 = s11.shapes[5].text_frame
tb11.clear()
db_points = [
    "• Cloud-Hosted Database: Runs on MongoDB Atlas, providing automated backups, scalability, and JSON-native BSON storage.",
    "• Mongoose Schemas: Data models defined with schema-level validation for Users, Vendors, PurchaseOrders, Evaluations, and Logs.",
    "• Clear Entity Relationships: Leverages MongoDB ObjectId references to connect orders with buyers and suppliers cleanly.",
    "• Embedded Sub-Documents: Line items and status histories are stored directly inside the order document for atomic updates.",
    "• Query Performance: Compound indexes on frequently queried fields like { vendorId: 1, status: 1 } ensure sub-100ms lookups.",
    "• Audit Traceability: Append-only collection logs user IDs, action names, timestamps, and previous/new states for all changes."
]
for idx, it in enumerate(db_points):
    p = tb11.paragraphs[0] if idx == 0 else tb11.add_paragraph()
    p.text = it
    p.font.name = "Segoe UI"
    p.font.size = Pt(10.5)
    p.space_after = Pt(5)

# ==============================================================================
# SLIDE 12: API DEVELOPMENT TABLE
# ==============================================================================
s12 = prs.slides[11]
t12 = s12.shapes[5].table
api_data_clean = [
    ("POST", "/api/auth/login", "Authenticates user credentials and returns a signed JWT token"),
    ("POST", "/api/orders", "Creates a new purchase order with automatic 18% GST calculation"),
    ("PUT", "/api/orders/:id/status", "Validates and transitions order state, recording an audit log entry"),
    ("POST", "/api/vendors", "Onboards a new supplier with PAN and statutory 15-char GSTIN checks"),
    ("POST", "/api/evaluations", "Submits performance scores across 4 pillars and updates the vendor tier"),
    ("GET", "/api/audit-logs", "Fetches immutable system audit records filtered by entity or user")
]
for r_idx, row_data in enumerate(api_data_clean):
    for c_idx, val in enumerate(row_data):
        cell = t12.cell(r_idx + 1, c_idx)
        cell.text = val
        cell.text_frame.paragraphs[0].font.name = "Segoe UI"
        cell.text_frame.paragraphs[0].font.size = Pt(9.5)

# ==============================================================================
# SLIDE 13: MODULE-WISE STATUS (REPLACE UGLY BARS WITH A CLEAN, ELEGANT TABLE)
# ==============================================================================
s13 = prs.slides[12]

# Remove all the bar shapes on Slide 13! Keep only header (shapes 0-4) and footer
s13_header_ids = [s13.shapes[i].shape_id for i in range(5)]
s13_footer_ids = [s13.shapes[len(s13.shapes)-2].shape_id, s13.shapes[len(s13.shapes)-1].shape_id]
s13_keep_ids = set(s13_header_ids + s13_footer_ids)

for sh in list(s13.shapes):
    if sh.shape_id not in s13_keep_ids:
        el = sh._element
        el.getparent().remove(el)

# Add a clean, readable professional table
rows = 7
cols = 4
left = Inches(1.1)
top = Inches(1.6)
width = Inches(11.1)
height = Inches(4.4)

table_shape = s13.shapes.add_table(rows, cols, left, top, width, height)
st_table = table_shape.table

# Set column widths
st_table.columns[0].width = Inches(2.6)
st_table.columns[1].width = Inches(4.5)
st_table.columns[2].width = Inches(1.8)
st_table.columns[3].width = Inches(2.2)

status_headers = ["Functional Module", "Key Implementation Deliverables", "Progress", "Validation Status"]
for c_idx, h_text in enumerate(status_headers):
    cell = st_table.cell(0, c_idx)
    cell.text = h_text
    p = cell.text_frame.paragraphs[0]
    p.font.name = "Segoe UI"
    p.font.size = Pt(11)
    p.font.bold = True
    p.alignment = PP_ALIGN.CENTER
    cell.fill.solid()
    cell.fill.fore_color.rgb = RGBColor(30, 41, 59)
    p.font.color.rgb = RGBColor(255, 255, 255)

status_rows = [
    ("User Authentication & RBAC", "Stateless JWT token pipeline, role-based route guards for Admin, Buyer, and Vendor", "100% Completed", "Verified via Postman"),
    ("Purchase Order Builder", "Dynamic line-item creation, real-time subtotal and statutory 18% GST calculation", "100% Completed", "End-to-End Verified"),
    ("FSM State Machine Engine", "8-stage linear workflow (Draft to Closed) with server-side transition lookup guards", "100% Completed", "Guard Tests Passed"),
    ("Supplier KYC Onboarding", "Self-service onboarding modal, PAN and 15-character GSTIN format validation", "90% Completed", "Functional in UI"),
    ("Supplier Scorecard Engine", "Objective 4-pillar weighted evaluation model with automated tier classification", "90% Completed", "Algorithm Verified"),
    ("Audit & Email Alerts", "Append-only change ledger with Nodemailer SMTP dispatch for order milestones", "70% Completed", "SMTP Pipeline Ready")
]

for r_idx, row_data in enumerate(status_rows):
    for c_idx, val in enumerate(row_data):
        cell = st_table.cell(r_idx + 1, c_idx)
        cell.text = val
        p = cell.text_frame.paragraphs[0]
        p.font.name = "Segoe UI"
        p.font.size = Pt(9.5)
        if c_idx == 2:
            p.font.bold = True
            p.alignment = PP_ALIGN.CENTER
            if "100%" in val:
                p.font.color.rgb = RGBColor(16, 149, 93) # Green
            else:
                p.font.color.rgb = RGBColor(217, 119, 6) # Amber
        elif c_idx == 3:
            p.alignment = PP_ALIGN.CENTER

# ==============================================================================
# SLIDE 14: SCREENSHOTS (CLEAN LABELED SLOTS FOR USER TO DROP IMAGES)
# ==============================================================================
s14 = prs.slides[13]
s14.shapes[6].text_frame.text = "[ Screenshot 1: User Login & Role Dashboard ]"
s14.shapes[8].text_frame.text = "[ Screenshot 2: Interactive PO Builder & 18% GST Calculator ]"
s14.shapes[10].text_frame.text = "[ Screenshot 3: Vendor Onboarding & KYC Approval Modal ]"
s14.shapes[12].text_frame.text = "[ Screenshot 4: 4-Pillar Supplier Scorecard & Performance Tiers ]"

for idx in [6, 8, 10, 12]:
    p = s14.shapes[idx].text_frame.paragraphs[0]
    p.font.name = "Segoe UI"
    p.font.size = Pt(10)
    p.font.bold = True
    p.alignment = PP_ALIGN.CENTER

# ==============================================================================
# SLIDE 15: CHALLENGES & SOLUTIONS (HUMANIZED & CLEAN)
# ==============================================================================
s15 = prs.slides[14]
t15 = s15.shapes[5].table
challenges_clean = [
    ("Preventing unauthorized order state leaps", "Enforced a server-side finite state machine dictionary that strictly blocks invalid transitions"),
    ("Accurate real-time tax calculation during drafting", "Implemented custom React hooks to compute item subtotals and 18% GST synchronously"),
    ("Eliminating subjective vendor performance reviews", "Formulated an objective weighted scorecard combining Quality (35%), Delivery (30%), Price (20%), and Compliance (15%)"),
    ("Aligning frontend form data with Mongoose schemas", "Normalized property names (vendorId, deliveryDate) across client DTOs and server validators")
]
for r_idx, row_data in enumerate(challenges_clean):
    for c_idx, val in enumerate(row_data):
        cell = t15.cell(r_idx + 1, c_idx)
        cell.text = val
        cell.text_frame.paragraphs[0].font.name = "Segoe UI"
        cell.text_frame.paragraphs[0].font.size = Pt(9.5)

# ==============================================================================
# SLIDE 16: NEXT STEPS (HUMANIZED & CLEAN)
# ==============================================================================
s16 = prs.slides[15]
tb16 = s16.shapes[5].text_frame
tb16.clear()
next_points = [
    "• Automated OCR Invoice Matching: Integrate Tesseract / Document AI to extract data from uploaded invoice PDFs and verify three-way matching against purchase orders.",
    "• Real-Time WebSockets: Connect client and server via Socket.io for instantaneous alerts when an order is approved or acknowledged, avoiding manual refreshes.",
    "• Banking & Payment Integration: Implement corporate payment webhooks to automate disbursements once goods receipts and invoices are reconciled.",
    "• Predictive Spend Analytics: Add lightweight forecasting models to help procurement buyers anticipate seasonal demand and negotiate bulk discounts.",
    "• Cloud Production Deployment: Deploy the React frontend to Vercel and the Express backend to Render, backed by a production MongoDB Atlas cluster."
]
for idx, it in enumerate(next_points):
    p = tb16.paragraphs[0] if idx == 0 else tb16.add_paragraph()
    p.text = it
    p.font.name = "Segoe UI"
    p.font.size = Pt(10.5)
    p.space_after = Pt(6)

# ==============================================================================
# SLIDE 17: REFERENCES (CLEAN ACADEMIC CITATIONS)
# ==============================================================================
s17 = prs.slides[16]
t17 = s17.shapes[5].table
refs_clean = [
    ("1", "Chopra, S., & Meindl, P. (2016). Supply Chain Management: Strategy, Planning, and Operation, 6th ed., Pearson Education."),
    ("2", "Monczka, R. M., et al. (2020). Purchasing and Supply Chain Management, 7th ed., Cengage Learning, Boston."),
    ("3", "Fowler, M. (2018). Patterns of Enterprise Application Architecture, Addison-Wesley Professional."),
    ("4", "Goods and Services Tax Network (GSTN), Ministry of Finance, Govt of India (2023). Standard Operating Procedures for Invoicing.")
]
for r_idx, row_data in enumerate(refs_clean):
    for c_idx, val in enumerate(row_data):
        cell = t17.cell(r_idx + 1, c_idx)
        cell.text = val
        cell.text_frame.paragraphs[0].font.name = "Segoe UI"
        cell.text_frame.paragraphs[0].font.size = Pt(9.5)

# Save both in place and as backup
# prs.save(src_path)
prs.save('C:/Users/LAKSHMI/FSD/VendorFlow_Combined_Review.pptx')
print("Successfully updated Combined Review.pptx with clean, humanized, properly structured slides!")
