import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches

def draw_widescreen_architecture():
    # 15 x 7 inches corresponds perfectly to 2.14:1 widescreen presentation area
    fig, ax = plt.subplots(figsize=(15, 6.8), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 50)
    ax.axis('off')
    fig.patch.set_facecolor('#ffffff')

    # Top Diagram Header Banner
    hdr_box = patches.FancyBboxPatch((2, 43.5), 96, 5.5, boxstyle="round,pad=0.4",
                                    facecolor="#0f172a", edgecolor="#0f172a")
    ax.add_patch(hdr_box)
    ax.text(50, 46.2, "VENDORFLOW : MULTI-TIER ENTERPRISE ARCHITECTURE", 
            ha='center', va='center', fontsize=14, fontweight='bold', color='#ffffff')
    ax.text(50, 44.3, "MERN Full-Stack Paradigm: Client SPA ⇄ Express REST API ⇄ FSM & Scorecard Engines ⇄ MongoDB Atlas", 
            ha='center', va='center', fontsize=9, color='#94a3b8')

    # 4 Main Columns / Tiers
    # Col 1: Presentation Tier (x: 2 to 24)
    # Col 2: API & Security Tier (x: 26 to 48)
    # Col 3: Business Logic & FSM Tier (x: 50 to 72)
    # Col 4: Persistence & Services (x: 74 to 98)

    tiers = [
        # (title, subtitle, col, bg, border, x, y, w, h, items)
        (
            "1. PRESENTATION TIER",
            "React 18 + Vite + Tailwind",
            "#b91c1c", "#fef2f2", "#dc2626", 2, 2.5, 22.5, 39,
            [
                ("Role-Based Workspaces", [
                    "• Admin Governance Console",
                    "• Buyer PO Builder Workspace",
                    "• Supplier Self-Service Portal"
                ], "#dc2626"),
                ("Client State & Flow", [
                    "• Context API / Redux Toolkit",
                    "• Protected Route Guards",
                    "• Real-time Calculation Hooks"
                ], "#b91c1c"),
                ("UI System & Client HTTP", [
                    "• Tailwind CSS Corporate Tokens",
                    "• Recharts Visual Analytics",
                    "• Axios Bearer Token Interceptor"
                ], "#991b1b")
            ]
        ),
        (
            "2. API & SECURITY GATEWAY",
            "Node.js v20 + Express.js",
            "#1d4ed8", "#eff6ff", "#2563eb", 26.5, 2.5, 22.5, 39,
            [
                ("REST Endpoint Routing", [
                    "• /api/auth (Login / Register)",
                    "• /api/orders (PO Lifecycle)",
                    "• /api/vendors & /api/evaluations"
                ], "#2563eb"),
                ("Zero-Trust Security Guards", [
                    "• Stateless JWT Authentication",
                    "• Role Middleware (RBAC)",
                    "• Bcryptjs 10-Salt Hashing"
                ], "#1d4ed8"),
                ("Validation & Sanitization", [
                    "• 15-char GSTIN & PAN Formats",
                    "• Payload Data Sanitization",
                    "• Global Error Handling Pipeline"
                ], "#1e40af")
            ]
        ),
        (
            "3. BUSINESS LOGIC ENGINES",
            "Deterministic State Machines",
            "#7c3aed", "#faf5ff", "#9333ea", 51, 2.5, 22.5, 39,
            [
                ("8-Stage FSM Order Engine", [
                    "• Draft ➔ Approval ➔ Sent ➔",
                    "  Acknowledged ➔ Delivered ➔",
                    "  Invoiced ➔ Closed",
                    "• Out-of-order Transition Guards"
                ], "#9333ea"),
                ("Automated Fiscal Engine", [
                    "• Dynamic Line-Item Aggregator",
                    "• Statutory 18% GST Formula",
                    "• Spend Threshold Checks (>50k)"
                ], "#7c3aed"),
                ("Supplier Scorecard Engine", [
                    "• 4 Pillars: Quality(35%), Delivery(30%),",
                    "  Pricing(20%), Compliance(15%)",
                    "• Tiering: Preferred, Approved, etc."
                ], "#6b21a8")
            ]
        ),
        (
            "4. DATA & INTEGRATION",
            "MongoDB Atlas + Services",
            "#047857", "#f0fdf4", "#059669", 75.5, 2.5, 22.5, 39,
            [
                ("MongoDB Atlas Cloud NoSQL", [
                    "• Users & Vendors Collections",
                    "• PurchaseOrders & LineItems",
                    "• Evaluations & AuditLogs"
                ], "#059669"),
                ("Performance & Indexing", [
                    "• Compound Index on (vendorId, status)",
                    "• Sub-100ms Query Execution",
                    "• Atomic findByIdAndUpdate"
                ], "#047857"),
                ("External Services & Alerts", [
                    "• Nodemailer SMTP Transport",
                    "• Automated Dispatch Email Alerts",
                    "• Append-Only Audit Logging"
                ], "#065f46")
            ]
        )
    ]

    for title, sub, hdr_col, bg_col, border_col, x, y, w, h, sub_blocks in tiers:
        # Outer tier box
        outer = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.3",
                                      facecolor=bg_col, edgecolor=border_col, linewidth=1.5)
        ax.add_patch(outer)

        # Header box
        hdr = patches.FancyBboxPatch((x + 0.4, y + h - 5.5), w - 0.8, 5.0, boxstyle="round,pad=0.2",
                                    facecolor=hdr_col, edgecolor=hdr_col)
        ax.add_patch(hdr)
        ax.text(x + w/2, y + h - 2.2, title, ha='center', va='center', fontsize=9.5, fontweight='bold', color='#ffffff')
        ax.text(x + w/2, y + h - 4.2, sub, ha='center', va='center', fontsize=7.5, color='#e2e8f0')

        # Sub-blocks inside tier
        block_y = y + h - 7.0
        for b_title, b_items, b_color in sub_blocks:
            b_h = 9.2 if len(b_items) >= 4 else 8.5
            box = patches.FancyBboxPatch((x + 0.8, block_y - b_h), w - 1.6, b_h, boxstyle="round,pad=0.2",
                                        facecolor='#ffffff', edgecolor='#cbd5e1', linewidth=1)
            ax.add_patch(box)
            ax.text(x + 1.6, block_y - 1.8, b_title, fontsize=8, fontweight='bold', color=b_color)
            
            line_y = block_y - 3.4
            for item in b_items:
                ax.text(x + 1.6, line_y, item, fontsize=6.8, color='#334155')
                line_y -= 1.6
            
            block_y -= (b_h + 1.2)

    # Connecting Flow Arrows between Tiers
    # Arrow 1 -> 2
    ax.annotate("", xy=(26.2, 23), xytext=(24.5, 23),
                arrowprops=dict(facecolor='#2563eb', edgecolor='#2563eb', width=2.5, headwidth=6))
    ax.text(25.4, 24.5, "HTTPS / JWT", fontsize=6.5, ha='center', fontweight='bold', color='#1d4ed8', rotation=90)

    # Arrow 2 -> 3
    ax.annotate("", xy=(50.7, 23), xytext=(49.0, 23),
                arrowprops=dict(facecolor='#7c3aed', edgecolor='#7c3aed', width=2.5, headwidth=6))
    ax.text(49.9, 24.5, "FSM Guard", fontsize=6.5, ha='center', fontweight='bold', color='#6b21a8', rotation=90)

    # Arrow 3 -> 4
    ax.annotate("", xy=(75.2, 23), xytext=(73.5, 23),
                arrowprops=dict(facecolor='#059669', edgecolor='#059669', width=2.5, headwidth=6))
    ax.text(74.4, 24.5, "Mongoose ODM", fontsize=6.5, ha='center', fontweight='bold', color='#047857', rotation=90)

    plt.tight_layout()
    out_img = 'C:/Users/LAKSHMI/FSD/docs/images/figure_4_1_architecture.png'
    plt.savefig(out_img, bbox_inches='tight')
    plt.close()
    print("Widescreen architecture diagram generated successfully!")

if __name__ == '__main__':
    draw_widescreen_architecture()
