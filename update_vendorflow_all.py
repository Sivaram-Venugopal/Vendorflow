import os
import shutil
import zipfile

base_dir = r"C:\Users\LAKSHMI\FSD"
docx_script = os.path.join(base_dir, "build_vendorflow_docx.py")

with open(docx_script, 'r', encoding='utf-8') as f:
    s = f.read()

# 1. Update add_p to support indent
old_add_p = '''def add_p(text="", align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=0, space_after=6, line_spacing=1.5, bold=False, italic=False, font_size=12):
    p = doc.add_paragraph()
    p.alignment = align
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = line_spacing
    if text:
        run = p.add_run(text)
        run.bold = bold
        run.italic = italic
        run.font.name = 'Times New Roman'
        run.font.size = Pt(font_size)
    return p'''

new_add_p = '''def add_p(text="", align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_before=0, space_after=6, line_spacing=1.5, bold=False, italic=False, font_size=12, indent=True):
    p = doc.add_paragraph()
    p.alignment = align
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = line_spacing
    if indent and align == WD_ALIGN_PARAGRAPH.JUSTIFY:
        p.paragraph_format.first_line_indent = Inches(0.4)
    if text:
        run = p.add_run(text)
        run.bold = bold
        run.italic = italic
        run.font.name = 'Times New Roman'
        run.font.size = Pt(font_size)
    return p'''

if old_add_p in s:
    s = s.replace(old_add_p, new_add_p)

# 2. Update Title Page
title_start = s.find('# 1. TITLE PAGE')
title_end = s.find('# =============================================================\n# 2. BONAFIDE CERTIFICATE')

new_title = '''# 1. TITLE PAGE - Perfectly Balanced Vertical Spacing
# =============================================================
add_p("VENDORFLOW: AN ENTERPRISE MERN-STACK PROCUREMENT AND SUPPLIER LIFECYCLE MANAGEMENT SYSTEM",
      align=WD_ALIGN_PARAGRAPH.CENTER, space_before=16, space_after=26, line_spacing=1.3, bold=True, font_size=15, indent=False)

add_p("A PROJECT REPORT", align=WD_ALIGN_PARAGRAPH.CENTER, space_before=14, space_after=18, bold=True, font_size=13, indent=False)

add_p("Submitted by", align=WD_ALIGN_PARAGRAPH.CENTER, space_before=10, space_after=4, italic=True, font_size=11, indent=False)
add_p("SIVARAM VENUGOPAL", align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=2, bold=True, font_size=13.5, indent=False)
add_p("(310624205263)", align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=22, bold=True, font_size=12, indent=False)

add_p("in partial fulfillment for the award of the degree", align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=3, italic=True, font_size=11, indent=False)
add_p("of", align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=4, italic=True, font_size=11, indent=False)
add_p("BACHELOR OF TECHNOLOGY", align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=3, bold=True, font_size=13, indent=False)
add_p("in", align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=3, italic=True, font_size=11, indent=False)
add_p("INFORMATION TECHNOLOGY", align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=22, bold=True, font_size=13, indent=False)

if os.path.exists(logo_path):
    p_logo = doc.add_paragraph()
    p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_logo.paragraph_format.space_before = Pt(6)
    p_logo.paragraph_format.space_after = Pt(18)
    p_logo.paragraph_format.first_line_indent = Inches(0)
    p_logo.add_run().add_picture(logo_path, width=Inches(1.6))

add_p("EASWARI ENGINEERING COLLEGE", align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=3, bold=True, font_size=13, indent=False)
add_p("(AN AUTONOMOUS INSTITUTION) -- AFFILIATED TO ANNA UNIVERSITY", align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=2, bold=True, font_size=9.5, indent=False)
add_p("RAMAPURAM, CHENNAI -- 600 089", align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=22, bold=True, font_size=9.5, indent=False)
add_p("OCTOBER 2026", align=WD_ALIGN_PARAGRAPH.CENTER, space_before=0, space_after=0, bold=True, font_size=12, indent=False)

doc.add_page_break()

'''
s = s[:title_start] + new_title + s[title_end:]

# 3. Update TOC Page 1 & 2, LOF, LOT
toc_start = s.find('toc_rows_p1 = [')
toc_end = s.find('doc.add_page_break()\n\n# =============================================================\n# 8. CHAPTER 1: INTRODUCTION')

new_toc = '''toc_rows_p1 = [
    ("CHAPTER NO.", "TITLE", "PAGE No."),
    ("", "ABSTRACT", "iv"),
    ("", "ACKNOWLEDGEMENT", "v"),
    ("CHAPTER 1", "INTRODUCTION", "1-3"),
    ("1.1", "OVERVIEW", "1"),
    ("1.2", "PROBLEM DEFINITION", "1"),
    ("1.3", "OBJECTIVE", "2"),
    ("1.4", "SCOPE OF THE PROJECT", "2"),
    ("1.5", "MOTIVATION", "3"),
    ("1.6", "SUMMARY", "3"),
    ("CHAPTER 2", "RELATED WORK", "4-6"),
    ("2.1", "LITERATURE REVIEW", "4"),
    ("2.2", "EXISTING SYSTEM", "4"),
    ("2.3", "PROPOSED SYSTEM", "5"),
    ("2.4", "SUMMARY", "6"),
    ("CHAPTER 3", "SYSTEM ANALYSIS", "7-10"),
    ("3.1", "SYSTEM REQUIREMENTS", "7"),
    ("3.2", "SOFTWARE AND HARDWARE REQUIREMENTS", "8"),
    ("3.3", "SUMMARY", "10"),
    ("CHAPTER 4", "SYSTEM DESIGN", "11-15"),
    ("4.1", "SYSTEM ARCHITECTURE", "11"),
    ("4.2", "MODULE DESCRIPTION", "12"),
    ("4.3", "CLASS DIAGRAM", "13"),
    ("4.4", "SEQUENCE DIAGRAM", "14"),
    ("4.5", "SUMMARY", "15"),
    ("CHAPTER 5", "IMPLEMENTATION", "16-19"),
    ("5.1", "IMPLEMENTATION OVERVIEW", "16"),
    ("5.2", "KEY FUNCTIONS (CODE EXPLANATION)", "16"),
    ("5.3", "SUMMARY", "19"),
    ("CHAPTER 6", "CONCLUSION & FUTURE WORK", "20-21"),
    ("6.1", "CONCLUSION", "20"),
    ("6.2", "FUTURE ENHANCEMENTS", "20"),
    ("6.3", "SUMMARY", "21")
]
tbl_toc1 = doc.add_table(rows=len(toc_rows_p1), cols=3)
tbl_toc1.alignment = WD_TABLE_ALIGNMENT.CENTER
remove_table_borders(tbl_toc1)
for r_i, (c1, c2, c3) in enumerate(toc_rows_p1):
    cell_w = [Inches(1.5), Inches(4.0), Inches(1.0)]
    for c_i, (txt, w) in enumerate(zip([c1, c2, c3], cell_w)):
        cell = tbl_toc1.cell(r_i, c_i)
        cell.width = w
        if r_i == 0:
            set_cell_txt(cell, txt, bold=True, font_size=10.5, align=WD_ALIGN_PARAGRAPH.CENTER if c_i != 1 else WD_ALIGN_PARAGRAPH.CENTER)
        else:
            is_ch = (c1.startswith("CHAPTER")) or ("ABSTRACT" in c2) or ("ACKNOWLEDGEMENT" in c2)
            set_cell_txt(cell, txt, bold=is_ch, font_size=9.5, align=WD_ALIGN_PARAGRAPH.RIGHT if c_i == 2 else (WD_ALIGN_PARAGRAPH.LEFT if c_i == 0 else WD_ALIGN_PARAGRAPH.LEFT))

doc.add_page_break()

# Page 2 of TOC - NO CONTD TITLE!
toc_rows_p2 = [
    ("CHAPTER NO.", "TITLE", "PAGE No."),
    ("APPENDIX", "SOURCE CODE", "22-29"),
    ("1", "Project Folder Structure", "22"),
    ("2", "Backend Package Installation Commands", "22"),
    ("3", "Database Connection Configuration", "22"),
    ("4", "Environment Variables Configuration", "23"),
    ("5", "User & Supplier Domain Schema", "23"),
    ("6", "Supplier Registration & Password Hashing Controller", "24"),
    ("7", "Login and JWT Generation Controller", "24"),
    ("8", "Authentication & RBAC Middleware", "25"),
    ("9", "Create API (Purchase Order with 18% GST Engine)", "25"),
    ("10", "Read API (Supplier Directory & Performance Query)", "26"),
    ("11", "Update API (FSM Purchase Order State Transitions)", "26"),
    ("12", "Delete API (PO Cancellation & Audit Rollback)", "27"),
    ("13", "Express REST API Routes Configuration", "27"),
    ("14", "Main Server Entry Point & WebSocket Initialization", "28"),
    ("15", "React Procurement Buyer Dashboard Component", "28"),
    ("16", "Supplier Scorecard & Performance Aggregation", "29"),
    ("17", "REST API Request and Response Examples", "29"),
    ("", "SCREENSHOTS OF THE PROJECT", "30-31"),
    ("", "REFERENCES", "32")
]
tbl_toc2 = doc.add_table(rows=len(toc_rows_p2), cols=3)
tbl_toc2.alignment = WD_TABLE_ALIGNMENT.CENTER
remove_table_borders(tbl_toc2)
for r_i, (c1, c2, c3) in enumerate(toc_rows_p2):
    cell_w = [Inches(1.5), Inches(4.0), Inches(1.0)]
    for c_i, (txt, w) in enumerate(zip([c1, c2, c3], cell_w)):
        cell = tbl_toc2.cell(r_i, c_i)
        cell.width = w
        if r_i == 0:
            set_cell_txt(cell, txt, bold=True, font_size=10.5, align=WD_ALIGN_PARAGRAPH.CENTER if c_i != 1 else WD_ALIGN_PARAGRAPH.CENTER)
        else:
            is_ch = (c1 == "APPENDIX") or ("SCREENSHOTS" in c2) or ("REFERENCES" in c2)
            set_cell_txt(cell, txt, bold=is_ch, font_size=10, align=WD_ALIGN_PARAGRAPH.RIGHT if c_i == 2 else (WD_ALIGN_PARAGRAPH.LEFT if c_i == 0 else WD_ALIGN_PARAGRAPH.LEFT))

doc.add_page_break()

# =============================================================
# 7. LIST OF FIGURES & LIST OF TABLES (Dedicated Pages)
# =============================================================
add_unnumbered_heading("LIST OF FIGURES")
fig_rows = [
    ("FIGURE NO.", "TITLE", "PAGE No."),
    ("Figure 1", "Four-Tier Enterprise Architecture of VendorFlow Platform", "11"),
    ("Figure 2", "UML Class Diagram of VendorFlow Entities and Domain Relationships", "13"),
    ("Figure 3", "UML Sequence Diagram: Purchase Order Creation & Multi-Tier Approval", "14"),
    ("Figure 4", "VendorFlow Procurement Dashboard: Purchase Order Lifecycle & Real-Time KPI", "30"),
    ("Figure 5", "Automated Purchase Order Calculator with 18% GST Line-Item Tax Valuation", "30"),
    ("Figure 6", "Supplier Compliance Console: PAN/GSTIN Credential Verification & Tier Status", "31"),
    ("Figure 7", "Quantitative Supplier Scorecard: Multi-Criteria Quality & Delivery Ratings", "31")
]
tbl_fig = doc.add_table(rows=len(fig_rows), cols=3)
tbl_fig.alignment = WD_TABLE_ALIGNMENT.CENTER
remove_table_borders(tbl_fig)
for r_i, (c1, c2, c3) in enumerate(fig_rows):
    cell_w = [Inches(1.5), Inches(4.0), Inches(1.0)]
    for c_i, (txt, w) in enumerate(zip([c1, c2, c3], cell_w)):
        cell = tbl_fig.cell(r_i, c_i)
        cell.width = w
        if r_i == 0:
            set_cell_txt(cell, txt, bold=True, font_size=10.5, align=WD_ALIGN_PARAGRAPH.CENTER if c_i != 1 else WD_ALIGN_PARAGRAPH.CENTER)
        else:
            set_cell_txt(cell, txt, bold=False, font_size=10, align=WD_ALIGN_PARAGRAPH.RIGHT if c_i == 2 else (WD_ALIGN_PARAGRAPH.LEFT if c_i == 0 else WD_ALIGN_PARAGRAPH.LEFT))

doc.add_page_break()

add_unnumbered_heading("LIST OF TABLES")
tab_rows = [
    ("TABLE NO.", "TITLE", "PAGE No."),
    ("Table 1", "Operational Hardware Specifications", "8"),
    ("Table 2", "Software Frameworks and Runtime Specifications", "9")
]
tbl_tab = doc.add_table(rows=len(tab_rows), cols=3)
tbl_tab.alignment = WD_TABLE_ALIGNMENT.CENTER
remove_table_borders(tbl_tab)
for r_i, (c1, c2, c3) in enumerate(tab_rows):
    cell_w = [Inches(1.5), Inches(4.0), Inches(1.0)]
    for c_i, (txt, w) in enumerate(zip([c1, c2, c3], cell_w)):
        cell = tbl_tab.cell(r_i, c_i)
        cell.width = w
        if r_i == 0:
            set_cell_txt(cell, txt, bold=True, font_size=10.5, align=WD_ALIGN_PARAGRAPH.CENTER if c_i != 1 else WD_ALIGN_PARAGRAPH.CENTER)
        else:
            set_cell_txt(cell, txt, bold=False, font_size=10, align=WD_ALIGN_PARAGRAPH.RIGHT if c_i == 2 else (WD_ALIGN_PARAGRAPH.LEFT if c_i == 0 else WD_ALIGN_PARAGRAPH.LEFT))
'''
s = s[:toc_start] + new_toc + s[toc_end:]

with open(docx_script, 'w', encoding='utf-8') as f:
    f.write(s)

print("Updated VendorFlow build_vendorflow_docx.py successfully!")
