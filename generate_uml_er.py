import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches

def generate_use_case_diagram():
    fig, ax = plt.subplots(figsize=(12, 8), dpi=300)
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 8)
    ax.axis('off')
    fig.patch.set_facecolor('#ffffff')

    # Title
    ax.text(6, 7.6, "UML Use Case Diagram - VendorFlow Procurement Portal", 
            ha='center', va='center', fontsize=15, fontweight='bold', color='#1e293b')

    # System boundary box
    sys_box = patches.FancyBboxPatch((3.2, 0.4), 6.4, 6.8, boxstyle="round,pad=0.1",
                                    facecolor="#f8fafc", edgecolor="#94a3b8", linewidth=1.5, linestyle="--")
    ax.add_patch(sys_box)
    ax.text(3.4, 7.0, "VendorFlow System Boundary", fontsize=11, fontweight='bold', color="#475569")

    # Actors on left and right
    # Admin (Left Top), Buyer (Left Bottom), Vendor (Right Center)
    actors = [
        ("Administrator\n(Governance & Approval)", 1.2, 5.5, "#dc2626"),
        ("Procurement Buyer\n(Purchasing & Evaluation)", 1.2, 2.2, "#2563eb"),
        ("Supplier / Vendor\n(Order Fulfillment)", 10.8, 3.8, "#059669")
    ]

    for name, x, y, col in actors:
        circle = patches.Circle((x, y + 0.35), 0.25, facecolor='#ffffff', edgecolor=col, linewidth=2)
        ax.add_patch(circle)
        ax.plot([x, x], [y + 0.1, y - 0.4], color=col, linewidth=2) # body
        ax.plot([x - 0.3, x + 0.3], [y - 0.1, y - 0.1], color=col, linewidth=2) # arms
        ax.plot([x, x - 0.25], [y - 0.4, y - 0.8], color=col, linewidth=2) # left leg
        ax.plot([x, x + 0.25], [y - 0.4, y - 0.8], color=col, linewidth=2) # right leg
        ax.text(x, y - 1.1, name, ha='center', va='top', fontsize=9, fontweight='bold', color=col)

    # Use cases (ellipses)
    use_cases = [
        ("UC1: User Authentication & JWT Session", 6.4, 6.4, "#f1f5f9", "#334155"),
        ("UC2: Vendor KYC Onboarding & Verification", 6.4, 5.5, "#fee2e2", "#991b1b"),
        ("UC3: Purchase Order Drafting & 18% GST", 6.4, 4.6, "#dbeafe", "#1e40af"),
        ("UC4: PO Approval & FSM State Transition", 6.4, 3.7, "#fef3c7", "#92400e"),
        ("UC5: Order Acknowledgment & Dispatch", 6.4, 2.8, "#d1fae5", "#065f46"),
        ("UC6: Multi-Pillar Vendor Performance Rating", 6.4, 1.9, "#ede9fe", "#5b21b6"),
        ("UC7: Immutable Audit Trail Logging", 6.4, 1.0, "#f1f5f9", "#334155")
    ]

    for label, cx, cy, bg, border in use_cases:
        ellipse = patches.Ellipse((cx, cy), 3.8, 0.65, facecolor=bg, edgecolor=border, linewidth=1.5)
        ax.add_patch(ellipse)
        ax.text(cx, cy, label, ha='center', va='center', fontsize=9, fontweight='bold', color=border)

    # Association lines from actors to use cases
    # Admin connects to UC1, UC2, UC4, UC7
    for ucy in [6.4, 5.5, 3.7, 1.0]:
        ax.annotate("", xy=(4.5, ucy), xytext=(1.5, 5.5),
                    arrowprops=dict(arrowstyle="-", color="#dc2626", lw=1.2, alpha=0.8))

    # Buyer connects to UC1, UC3, UC4, UC6, UC7
    for ucy in [6.4, 4.6, 3.7, 1.9, 1.0]:
        ax.annotate("", xy=(4.5, ucy), xytext=(1.5, 2.2),
                    arrowprops=dict(arrowstyle="-", color="#2563eb", lw=1.2, alpha=0.8))

    # Vendor connects to UC1, UC2, UC5
    for ucy in [6.4, 5.5, 2.8]:
        ax.annotate("", xy=(8.3, ucy), xytext=(10.5, 3.8),
                    arrowprops=dict(arrowstyle="-", color="#059669", lw=1.2, alpha=0.8))

    plt.tight_layout()
    plt.savefig('C:/Users/LAKSHMI/FSD/docs/images/use_case_diagram.png', bbox_inches='tight')
    plt.close()
    print("Generated use_case_diagram.png successfully!")

def generate_er_diagram():
    fig, ax = plt.subplots(figsize=(12, 8), dpi=300)
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 8)
    ax.axis('off')
    fig.patch.set_facecolor('#ffffff')

    ax.text(6, 7.7, "Entity-Relationship (ER) Diagram - VendorFlow Collections", 
            ha='center', va='center', fontsize=15, fontweight='bold', color='#1e293b')

    # Entities boxes
    # Entity: User, Vendor, PurchaseOrder, LineItem, Evaluation, AuditLog
    entities = [
        ("USER", 0.6, 4.8, 3.2, 2.4, "#2563eb", [
            ("PK", "_id : ObjectId"),
            ("", "name : String"),
            ("", "email : String (Unique)"),
            ("", "passwordHash : String"),
            ("", "role : String [admin, buyer, vendor]"),
            ("", "createdAt : Date")
        ]),
        ("VENDOR", 4.4, 4.8, 3.2, 2.4, "#059669", [
            ("PK", "_id : ObjectId"),
            ("", "companyName : String"),
            ("", "gstin : String (15-char)"),
            ("", "pan : String"),
            ("", "status : String [Pending..]"),
            ("", "overallScore : Number"),
            ("", "tierRating : String")
        ]),
        ("PURCHASE_ORDER", 8.2, 4.4, 3.4, 2.8, "#dc2626", [
            ("PK", "_id : ObjectId"),
            ("", "poNumber : String (Unique)"),
            ("FK", "vendorId : ObjectId -> Vendor"),
            ("FK", "buyerId : ObjectId -> User"),
            ("", "status : Enum [8-States]"),
            ("", "subtotal, taxAmount, grandTotal"),
            ("", "deliveryDate : Date"),
            ("", "items : [LineItem]")
        ]),
        ("LINE_ITEM", 8.2, 1.0, 3.4, 2.2, "#b91c1c", [
            ("", "description : String"),
            ("", "quantity : Number (min: 1)"),
            ("", "unitPrice : Number"),
            ("", "gstRate : Number (0.18)"),
            ("", "lineTotal : Number")
        ]),
        ("EVALUATION", 4.4, 1.0, 3.2, 2.5, "#7c3aed", [
            ("PK", "_id : ObjectId"),
            ("FK", "vendorId : ObjectId -> Vendor"),
            ("", "qualityScore : Number (35%)"),
            ("", "deliveryScore : Number (30%)"),
            ("", "pricingScore : Number (20%)"),
            ("", "complianceScore : Number (15%)"),
            ("", "compositeScore : Number"),
            ("", "tierAssigned : String")
        ]),
        ("AUDIT_LOG", 0.6, 1.0, 3.2, 2.5, "#475569", [
            ("PK", "_id : ObjectId"),
            ("FK", "userId : ObjectId -> User"),
            ("", "entityType : String"),
            ("", "entityId : ObjectId"),
            ("", "action : String"),
            ("", "fromState, toState : String"),
            ("", "timestamp : Date")
        ])
    ]

    for title, x, y, w, h, col, fields in entities:
        # Header
        hdr = patches.Rectangle((x, y + h - 0.5), w, 0.5, facecolor=col, edgecolor=col)
        ax.add_patch(hdr)
        ax.text(x + w/2, y + h - 0.25, title, ha='center', va='center', fontsize=10, fontweight='bold', color='#ffffff')
        # Body
        body = patches.Rectangle((x, y), w, h - 0.5, facecolor='#f8fafc', edgecolor=col, linewidth=1.5)
        ax.add_patch(body)
        fy = y + h - 0.75
        for pk_label, fname in fields:
            if pk_label:
                ax.text(x + 0.15, fy, pk_label, fontsize=7.5, fontweight='bold', color='#dc2626')
                ax.text(x + 0.6, fy, fname, fontsize=7.5, color='#1e293b')
            else:
                ax.text(x + 0.2, fy, fname, fontsize=7.5, color='#334155')
            fy -= 0.3

    # Relationship connectors
    # User (1) to PO (M)
    ax.annotate("1", xy=(3.8, 5.8), fontsize=9, fontweight='bold', color='#2563eb')
    ax.annotate("creates\n(1:N)", xy=(4.1, 5.9), fontsize=7.5, color='#64748b')
    ax.annotate("N", xy=(8.2, 5.8), fontsize=9, fontweight='bold', color='#2563eb')
    ax.plot([3.8, 4.2, 4.2, 8.2], [5.8, 5.8, 7.3, 7.3], color='#2563eb', lw=1.2, linestyle=':')

    # Vendor (1) to PO (M)
    ax.plot([7.6, 8.2], [6.0, 6.0], color='#059669', lw=1.5)
    ax.text(7.65, 6.1, "1", fontsize=8.5, fontweight='bold', color='#059669')
    ax.text(8.05, 6.1, "N", fontsize=8.5, fontweight='bold', color='#059669')

    # PO (1) to LineItem (M) - Composition
    ax.plot([9.9, 9.9], [4.4, 3.2], color='#dc2626', lw=1.8)
    ax.text(9.7, 4.1, "1", fontsize=8.5, fontweight='bold', color='#dc2626')
    ax.text(9.7, 3.3, "N", fontsize=8.5, fontweight='bold', color='#dc2626')

    # Vendor (1) to Evaluation (M)
    ax.plot([6.0, 6.0], [4.8, 3.5], color='#7c3aed', lw=1.5)
    ax.text(6.1, 4.5, "1", fontsize=8.5, fontweight='bold', color='#7c3aed')
    ax.text(6.1, 3.6, "N", fontsize=8.5, fontweight='bold', color='#7c3aed')

    # User (1) to AuditLog (M)
    ax.plot([2.2, 2.2], [4.8, 3.5], color='#475569', lw=1.5)
    ax.text(2.3, 4.5, "1", fontsize=8.5, fontweight='bold', color='#475569')
    ax.text(2.3, 3.6, "N", fontsize=8.5, fontweight='bold', color='#475569')

    plt.tight_layout()
    plt.savefig('C:/Users/LAKSHMI/FSD/docs/images/er_diagram.png', bbox_inches='tight')
    plt.close()
    print("Generated er_diagram.png successfully!")

if __name__ == "__main__":
    generate_use_case_diagram()
    generate_er_diagram()
