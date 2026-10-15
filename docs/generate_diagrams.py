import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from PIL import Image

output_dir = r"C:\Users\LAKSHMI\FSD\docs\images"
os.makedirs(output_dir, exist_ok=True)

# -----------------------------------------------------------------------------
# 1. GENERATE FIGURE 4.1: SYSTEM ARCHITECTURE DIAGRAM
# -----------------------------------------------------------------------------
fig, ax = plt.subplots(figsize=(12, 10), dpi=300)
ax.set_xlim(0, 100)
ax.set_ylim(0, 100)
ax.axis('off')

# Title
ax.text(50, 97, "VENDORFLOW: 4-TIER ENTERPRISE PROCUREMENT ARCHITECTURE", 
        ha='center', va='center', fontsize=14, fontweight='bold', color='#0f172a')

# Tier 1: Client Presentation Tier
tier1 = patches.FancyBboxPatch((5, 74), 90, 19, boxstyle="round,pad=1", ec="#cbd5e1", fc="#f8fafc", lw=1.5)
ax.add_patch(tier1)
ax.text(8, 90, "TIER 1: CLIENT PRESENTATION TIER (REACT 19 + VITE 8 + TAILWIND CSS)", 
        fontsize=10, fontweight='bold', color='#b91c1c')

# Subcomponents Tier 1
c1 = patches.FancyBboxPatch((8, 76), 25, 11, boxstyle="round,pad=0.5", ec="#dc2626", fc="#ffffff", lw=1)
ax.add_patch(c1)
ax.text(20.5, 83.5, "Role-Gated Workspaces", fontsize=9, fontweight='bold', ha='center', color='#0f172a')
ax.text(20.5, 79.5, "• Admin Governance Portal\n• Buyer PO Workspace\n• Supplier Fulfillment Center", 
        fontsize=7.5, ha='center', color='#475569')

c2 = patches.FancyBboxPatch((37.5, 76), 25, 11, boxstyle="round,pad=0.5", ec="#2563eb", fc="#ffffff", lw=1)
ax.add_patch(c2)
ax.text(50, 83.5, "Redux Toolkit State Store", fontsize=9, fontweight='bold', ha='center', color='#0f172a')
ax.text(50, 79.5, "• authSlice (JWT / RBAC)\n• purchaseOrderSlice (FSM)\n• vendorSlice & evalSlice", 
        fontsize=7.5, ha='center', color='#475569')

c3 = patches.FancyBboxPatch((67, 76), 25, 11, boxstyle="round,pad=0.5", ec="#059669", fc="#ffffff", lw=1)
ax.add_patch(c3)
ax.text(79.5, 83.5, "Visual Analytics & Axios", fontsize=9, fontweight='bold', ha='center', color='#0f172a')
ax.text(79.5, 79.5, "• Recharts Spend Analytics\n• Radar & Time-Series Curves\n• Axios Cookie Interceptors", 
        fontsize=7.5, ha='center', color='#475569')

# Arrow Down 1
ax.annotate('', xy=(50, 69), xytext=(50, 73.5),
            arrowprops=dict(facecolor='#dc2626', edgecolor='#dc2626', width=2, headwidth=7))
ax.text(52, 71.5, "RESTful HTTPS / JSON (httpOnly Cookies)", fontsize=8, color='#dc2626', fontweight='bold')

# Tier 2: Gateway & Security Middleware Tier
tier2 = patches.FancyBboxPatch((5, 52), 90, 16.5, boxstyle="round,pad=1", ec="#cbd5e1", fc="#f8fafc", lw=1.5)
ax.add_patch(tier2)
ax.text(8, 66, "TIER 2: API GATEWAY & SECURITY MIDDLEWARE TIER (EXPRESS 4.X)", 
        fontsize=10, fontweight='bold', color='#b91c1c')

g1 = patches.FancyBboxPatch((8, 54), 20, 9.5, boxstyle="round,pad=0.5", ec="#64748b", fc="#ffffff", lw=1)
ax.add_patch(g1)
ax.text(18, 60, "Security Shields", fontsize=8.5, fontweight='bold', ha='center', color='#0f172a')
ax.text(18, 56.5, "Helmet CSP Headers\nRate-Limit Anti-DDoS", fontsize=7.5, ha='center', color='#475569')

g2 = patches.FancyBboxPatch((30.5, 54), 22, 9.5, boxstyle="round,pad=0.5", ec="#dc2626", fc="#ffffff", lw=1)
ax.add_patch(g2)
ax.text(41.5, 60, "Zero-Trust RBAC Guard", fontsize=8.5, fontweight='bold', ha='center', color='#0f172a')
ax.text(41.5, 56.5, "authMiddleware (JWT)\nroleMiddleware(Role)", fontsize=7.5, ha='center', color='#475569')

g3 = patches.FancyBboxPatch((55, 54), 20, 9.5, boxstyle="round,pad=0.5", ec="#2563eb", fc="#ffffff", lw=1)
ax.add_patch(g3)
ax.text(65, 60, "Input Validation", fontsize=8.5, fontweight='bold', ha='center', color='#0f172a')
ax.text(65, 56.5, "express-validator\nPayload Sanitization", fontsize=7.5, ha='center', color='#475569')

g4 = patches.FancyBboxPatch((77.5, 54), 14.5, 9.5, boxstyle="round,pad=0.5", ec="#059669", fc="#ffffff", lw=1)
ax.add_patch(g4)
ax.text(84.7, 60, "File Gateway", fontsize=8.5, fontweight='bold', ha='center', color='#0f172a')
ax.text(84.7, 56.5, "Multer KYC Upload\nDisk Storage", fontsize=7.5, ha='center', color='#475569')

# Arrow Down 2
ax.annotate('', xy=(50, 47), xytext=(50, 51.5),
            arrowprops=dict(facecolor='#dc2626', edgecolor='#dc2626', width=2, headwidth=7))
ax.text(52, 49.5, "Authorized Request Dispatch", fontsize=8, color='#dc2626', fontweight='bold')

# Tier 3: Core Application Business Logic Tier
tier3 = patches.FancyBboxPatch((5, 27), 90, 19.5, boxstyle="round,pad=1", ec="#cbd5e1", fc="#f8fafc", lw=1.5)
ax.add_patch(tier3)
ax.text(8, 44, "TIER 3: CORE APPLICATION LOGIC & DOMAIN SERVICES TIER", 
        fontsize=10, fontweight='bold', color='#b91c1c')

s1 = patches.FancyBboxPatch((8, 29), 25, 12, boxstyle="round,pad=0.5", ec="#dc2626", fc="#ffffff", lw=1)
ax.add_patch(s1)
ax.text(20.5, 37.5, "Purchase Order FSM Engine", fontsize=9, fontweight='bold', ha='center', color='#0f172a')
ax.text(20.5, 33, "• 8-Stage Sequential Logic\n• Role-Gated Transition Checks\n• 18% GST Tax Computation", 
        fontsize=7.5, ha='center', color='#475569')

s2 = patches.FancyBboxPatch((37.5, 29), 25, 12, boxstyle="round,pad=0.5", ec="#2563eb", fc="#ffffff", lw=1)
ax.add_patch(s2)
ax.text(50, 37.5, "Vendor Performance Engine", fontsize=9, fontweight='bold', ha='center', color='#0f172a')
ax.text(50, 33, "• 4-Pillar Weighted Scoring\n• Autonomous Tier Allocation\n  (Preferred/Approved/Watch)", 
        fontsize=7.5, ha='center', color='#475569')

s3 = patches.FancyBboxPatch((67, 29), 25, 12, boxstyle="round,pad=0.5", ec="#059669", fc="#ffffff", lw=1)
ax.add_patch(s3)
ax.text(79.5, 37.5, "Governance & Communication", fontsize=9, fontweight='bold', ha='center', color='#0f172a')
ax.text(79.5, 33, "• Append-Only State Diff Logs\n• Nodemailer SMTP Transporter\n• In-App Event Polling Engine", 
        fontsize=7.5, ha='center', color='#475569')

# Arrow Down 3
ax.annotate('', xy=(50, 22), xytext=(50, 26.5),
            arrowprops=dict(facecolor='#dc2626', edgecolor='#dc2626', width=2, headwidth=7))
ax.text(52, 24.5, "Mongoose ODM Operations", fontsize=8, color='#dc2626', fontweight='bold')

# Tier 4: Database Persistence Tier
tier4 = patches.FancyBboxPatch((5, 3), 90, 18.5, boxstyle="round,pad=1", ec="#cbd5e1", fc="#f8fafc", lw=1.5)
ax.add_patch(tier4)
ax.text(8, 19, "TIER 4: DATABASE PERSISTENCE TIER (MONGODB ENTERPRISE SERVER)", 
        fontsize=10, fontweight='bold', color='#b91c1c')

d1 = patches.FancyBboxPatch((8, 5.5), 16, 11, boxstyle="round,pad=0.5", ec="#047857", fc="#ffffff", lw=1)
ax.add_patch(d1)
ax.text(16, 12.5, "Users\nCollection", fontsize=8.5, fontweight='bold', ha='center', color='#0f172a')
ax.text(16, 8, "Credentials, Roles\nDepartments", fontsize=7.5, ha='center', color='#475569')

d2 = patches.FancyBboxPatch((26.5, 5.5), 16, 11, boxstyle="round,pad=0.5", ec="#047857", fc="#ffffff", lw=1)
ax.add_patch(d2)
ax.text(34.5, 12.5, "Vendors\nCollection", fontsize=8.5, fontweight='bold', ha='center', color='#0f172a')
ax.text(34.5, 8, "GSTIN, PAN, KYC\nTiers & Ratings", fontsize=7.5, ha='center', color='#475569')

d3 = patches.FancyBboxPatch((45, 5.5), 18, 11, boxstyle="round,pad=0.5", ec="#047857", fc="#ffffff", lw=1)
ax.add_patch(d3)
ax.text(54, 12.5, "PurchaseOrders\nCollection", fontsize=8.5, fontweight='bold', ha='center', color='#0f172a')
ax.text(54, 8, "PO Number, Items\nSubtotal, Tax, FSM", fontsize=7.5, ha='center', color='#475569')

d4 = patches.FancyBboxPatch((65.5, 5.5), 13.5, 11, boxstyle="round,pad=0.5", ec="#047857", fc="#ffffff", lw=1)
ax.add_patch(d4)
ax.text(72.2, 12.5, "Evaluations\nCollection", fontsize=8.5, fontweight='bold', ha='center', color='#0f172a')
ax.text(72.2, 8, "4-Pillar Scores\nAssigned Tier", fontsize=7.5, ha='center', color='#475569')

d5 = patches.FancyBboxPatch((81.5, 5.5), 11, 11, boxstyle="round,pad=0.5", ec="#047857", fc="#ffffff", lw=1)
ax.add_patch(d5)
ax.text(87, 12.5, "AuditLogs\nCollection", fontsize=8.5, fontweight='bold', ha='center', color='#0f172a')
ax.text(87, 8, "State Diffs\nActor, IP, Logs", fontsize=7.5, ha='center', color='#475569')

plt.tight_layout()
arch_path = os.path.join(output_dir, "figure_4_1_architecture.png")
plt.savefig(arch_path, dpi=300, bbox_inches='tight')
plt.close()
print(f"Generated: {arch_path}")

# -----------------------------------------------------------------------------
# 2. GENERATE FIGURE 4.2: CLASS DIAGRAM
# -----------------------------------------------------------------------------
fig, ax = plt.subplots(figsize=(13, 10), dpi=300)
ax.set_xlim(0, 130)
ax.set_ylim(0, 100)
ax.axis('off')

ax.text(65, 97, "VENDORFLOW: DOMAIN OBJECT MODEL & CLASS DIAGRAM", 
        ha='center', va='center', fontsize=14, fontweight='bold', color='#0f172a')

def draw_class(x, y, w, h, title, fields, methods, header_color="#dc2626"):
    # Outer box
    box = patches.FancyBboxPatch((x, y), w, h, boxstyle="square,pad=0", ec="#334155", fc="#ffffff", lw=1.2)
    ax.add_patch(box)
    # Header box
    hdr = patches.Rectangle((x, y + h - 4.5), w, 4.5, ec="#334155", fc=header_color, lw=1.2)
    ax.add_patch(hdr)
    ax.text(x + w/2, y + h - 2.25, title, ha='center', va='center', fontsize=8.5, fontweight='bold', color='#ffffff')
    
    # Separator line
    sep_y = y + len(methods)*3.2 + 1.5
    ax.plot([x, x + w], [sep_y, sep_y], color='#334155', lw=1)
    
    # Fields
    curr_y = y + h - 7
    for f in fields:
        ax.text(x + 1.5, curr_y, f, fontsize=7, color='#1e293b')
        curr_y -= 2.6
        
    # Methods
    curr_y = sep_y - 2.8
    for m in methods:
        ax.text(x + 1.5, curr_y, m, fontsize=7, color='#0f766e', style='italic')
        curr_y -= 2.6

# Class 1: User
draw_class(5, 60, 36, 32, "User", 
           ["- _id: ObjectId", "- name: String", "- email: String", "- passwordHash: String", 
            "- role: Enum [Admin|Buyer|Vendor]", "- department: String", "- phone: String"],
           ["+ matchPassword(enteredPassword): Boolean", "+ generateJWT(): String", "+ getProfile(): Object"],
           "#b91c1c")

# Class 2: Vendor
draw_class(50, 58, 38, 36, "Vendor",
           ["- _id: ObjectId", "- owner: ObjectId (ref: User)", "- companyName: String", 
            "- category: String", "- taxId: String (GSTIN)", "- panNumber: String", 
            "- status: Enum [Pending|Approved|Rejected]", "- ratingTier: Enum [Preferred|Approved|Watch]", 
            "- complianceScore: Number", "- overallRating: Number"],
           ["+ updateStatus(newStatus, actor): Void", "+ recalculateRating(): Void", "+ uploadKYCDoc(file): String"],
           "#b91c1c")

# Class 3: PurchaseOrder
draw_class(94, 52, 34, 42, "PurchaseOrder",
           ["- _id: ObjectId", "- poNumber: String (Unique)", "- vendor: ObjectId (ref: Vendor)", 
            "- buyer: ObjectId (ref: User)", "- title: String", "- items: LineItem[]", 
            "- subtotal: Number", "- taxAmount: Number (18% GST)", "- totalAmount: Number", 
            "- status: Enum [Draft|Pending|Approved|...]", "- deliveryDate: Date"],
           ["+ validateTransition(newStatus): Boolean", "+ calculateTotals(): Void", "+ appendHistory(status, actor): Void"],
           "#1d4ed8")

# Class 4: LineItem
draw_class(96, 18, 30, 24, "LineItem",
           ["- itemCode: String", "- description: String", "- quantity: Number", 
            "- unitPrice: Number", "- totalAmount: Number"],
           ["+ computeLineTotal(): Number"],
           "#475569")

# Class 5: Evaluation
draw_class(50, 14, 38, 34, "Evaluation",
           ["- _id: ObjectId", "- vendor: ObjectId (ref: Vendor)", "- evaluator: ObjectId (ref: User)", 
            "- timelinessScore: Number (30%)", "- qualityScore: Number (30%)", 
            "- pricingScore: Number (20%)", "- supportScore: Number (20%)", 
            "- compositeScore: Number", "- assignedTier: Enum"],
           ["+ calculateCompositeScore(): Number", "+ determineTier(score): Enum"],
           "#047857")

# Class 6: AuditLog
draw_class(5, 14, 36, 34, "AuditLog",
           ["- _id: ObjectId", "- user: ObjectId (ref: User)", "- action: String", 
            "- entityType: String", "- entityId: ObjectId", "- beforeState: Object", 
            "- afterState: Object", "- ipAddress: String", "- timestamp: Date"],
           ["+ logTransition(req, data): Void", "+ fetchDiff(): Object"],
           "#334155")

# Draw Relationships
# User to Vendor (1 to 0..1)
ax.plot([41, 50], [75, 75], color='#334155', lw=1.5)
ax.text(42, 76.5, "1", fontsize=8, fontweight='bold')
ax.text(47, 76.5, "0..1", fontsize=8, fontweight='bold')
ax.text(45.5, 73, "owns", fontsize=7, style='italic', ha='center')

# Vendor to PO (1 to 0..*)
ax.plot([88, 94], [75, 75], color='#334155', lw=1.5)
ax.text(89, 76.5, "1", fontsize=8, fontweight='bold')
ax.text(92, 76.5, "0..*", fontsize=8, fontweight='bold')
ax.text(91, 73, "fulfills", fontsize=7, style='italic', ha='center')

# PO to LineItem (Composition 1 to 1..*)
ax.plot([111, 111], [52, 42], color='#334155', lw=1.5)
ax.plot([111], [52], marker='D', markersize=6, color='#334155')
ax.text(112.5, 49, "1", fontsize=8, fontweight='bold')
ax.text(112.5, 43, "1..*", fontsize=8, fontweight='bold')

# Vendor to Evaluation (1 to 0..*)
ax.plot([69, 69], [58, 48], color='#334155', lw=1.5)
ax.text(70.5, 55, "1", fontsize=8, fontweight='bold')
ax.text(70.5, 49, "0..*", fontsize=8, fontweight='bold')
ax.text(64, 52, "evaluated by", fontsize=7, style='italic')

# User to AuditLog (1 to 0..*)
ax.plot([23, 23], [60, 48], color='#334155', lw=1.5)
ax.text(24.5, 57, "1", fontsize=8, fontweight='bold')
ax.text(24.5, 50, "0..*", fontsize=8, fontweight='bold')
ax.text(18, 54, "initiates", fontsize=7, style='italic')

plt.tight_layout()
class_path = os.path.join(output_dir, "figure_4_2_class_diagram.png")
plt.savefig(class_path, dpi=300, bbox_inches='tight')
plt.close()
print(f"Generated: {class_path}")

# -----------------------------------------------------------------------------
# 3. GENERATE FIGURE 4.3: SEQUENCE DIAGRAM
# -----------------------------------------------------------------------------
fig, ax = plt.subplots(figsize=(13, 11), dpi=300)
ax.set_xlim(0, 130)
ax.set_ylim(0, 110)
ax.axis('off')

ax.text(65, 107, "VENDORFLOW: PURCHASE ORDER LIFECYCLE & AUDIT SEQUENCE DIAGRAM", 
        ha='center', va='center', fontsize=13, fontweight='bold', color='#0f172a')

# Lifelines
lifelines = [
    ("Procurement Buyer", 15, "#dc2626"),
    ("React Client Shell", 37, "#2563eb"),
    ("Gateway / Auth Guard", 60, "#059669"),
    ("PO Controller & FSM", 83, "#d97706"),
    ("MongoDB Storage", 104, "#475569"),
    ("Vendor Portal", 123, "#9333ea"),
]

for label, x_pos, color in lifelines:
    hdr = patches.FancyBboxPatch((x_pos - 8, 98), 16, 6, boxstyle="round,pad=0.3", ec=color, fc="#ffffff", lw=1.5)
    ax.add_patch(hdr)
    ax.text(x_pos, 101, label, ha='center', va='center', fontsize=7.5, fontweight='bold', color=color)
    # Dashed vertical lifeline
    ax.plot([x_pos, x_pos], [10, 98], color='#94a3b8', linestyle='--', lw=1)

y_cursor = 92

def draw_msg(y, x1, x2, text, is_reply=False, is_self=False):
    if is_self:
        ax.plot([x1, x1+6, x1+6, x1], [y, y, y-3, y-3], color='#1e293b', lw=1.2)
        ax.annotate('', xy=(x1, y-3), xytext=(x1+6, y-3),
                    arrowprops=dict(facecolor='#1e293b', edgecolor='#1e293b', width=1, headwidth=4))
        ax.text(x1 + 7, y - 1.5, text, fontsize=7, color='#1e293b', va='center')
        return y - 6
    else:
        ls = '--' if is_reply else '-'
        col = '#047857' if is_reply else '#1e293b'
        ax.plot([x1, x2], [y, y], color=col, linestyle=ls, lw=1.2)
        ax.annotate('', xy=(x2, y), xytext=(x1, y),
                    arrowprops=dict(facecolor=col, edgecolor=col, width=1, headwidth=5))
        mid_x = (x1 + x2) / 2
        ax.text(mid_x, y + 1.2, text, fontsize=7, color=col, ha='center', va='bottom')
        return y - 6

y_cursor = draw_msg(y_cursor, 15, 37, "1. Input items, quantities & select Vendor")
y_cursor = draw_msg(y_cursor, 37, 37, "2. Auto-compute subtotal & 18% GST tax", is_self=True)
y_cursor = draw_msg(y_cursor, 37, 60, "3. POST /api/purchase-orders (with JWT cookie)")
y_cursor = draw_msg(y_cursor, 60, 60, "4. Verify JWT token & Buyer role", is_self=True)
y_cursor = draw_msg(y_cursor, 60, 83, "5. Dispatch payload to Controller")
y_cursor = draw_msg(y_cursor, 83, 83, "6. Validate initial status == 'Draft'", is_self=True)
y_cursor = draw_msg(y_cursor, 83, 104, "7. PurchaseOrder.create({ status: 'Draft', ... })")
y_cursor = draw_msg(y_cursor, 104, 83, "8. DB Document Saved (PO-2026-0001)", is_reply=True)
y_cursor = draw_msg(y_cursor, 83, 104, "9. logAudit('PO_CREATED', actor, stateDiff)")
y_cursor = draw_msg(y_cursor, 83, 37, "10. 201 Created Response", is_reply=True)
y_cursor = draw_msg(y_cursor, 37, 15, "11. Display Draft Created UI Banner", is_reply=True)

y_cursor -= 2
ax.plot([5, 125], [y_cursor, y_cursor], color='#dc2626', linestyle=':', lw=1.5)
ax.text(65, y_cursor + 1.5, "APPROVAL & DISPATCH PHASE", color='#dc2626', fontsize=8, fontweight='bold', ha='center')
y_cursor -= 5

y_cursor = draw_msg(y_cursor, 15, 37, "12. Submit PO for approval / dispatch")
y_cursor = draw_msg(y_cursor, 37, 83, "13. PATCH /api/purchase-orders/:id/status ('Sent')")
y_cursor = draw_msg(y_cursor, 83, 83, "14. validatePOTransition('Draft' -> 'Sent')", is_self=True)
y_cursor = draw_msg(y_cursor, 83, 104, "15. Update PO.status='Sent' & append history")
y_cursor = draw_msg(y_cursor, 83, 123, "16. Dispatch SMTP Email & In-App Notification")
y_cursor = draw_msg(y_cursor, 123, 83, "17. Vendor acknowledges order ('Acknowledged')")
y_cursor = draw_msg(y_cursor, 123, 83, "18. Vendor marks fulfillment & invoices ('Invoiced')")
y_cursor = draw_msg(y_cursor, 15, 83, "19. Buyer inspects deliverables & marks 'Closed'")
y_cursor = draw_msg(y_cursor, 83, 104, "20. Final PO State logged & Audit Diff saved")

plt.tight_layout()
seq_path = os.path.join(output_dir, "figure_4_3_sequence_diagram.png")
plt.savefig(seq_path, dpi=300, bbox_inches='tight')
plt.close()
print(f"Generated: {seq_path}")
