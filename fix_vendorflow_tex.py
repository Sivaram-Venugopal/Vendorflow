import os
import shutil
import zipfile

base_dir = r"C:\Users\LAKSHMI\FSD"
tex_path = os.path.join(base_dir, "VendorFlow_Project_Report.tex")

with open(tex_path, 'r', encoding='utf-8') as f:
    s = f.read()

# 1. Update Title Page
title_start = s.find(r'\begin{titlepage}')
title_end = s.find(r'\end{titlepage}') + len(r'\end{titlepage}')

new_title = r'''\begin{titlepage}
\begin{center}
    \vspace*{0.2cm}
    {\fontsize{14pt}{18pt}\selectfont \textbf{VENDORFLOW: AN ENTERPRISE MERN-STACK PROCUREMENT\\AND SUPPLIER LIFECYCLE MANAGEMENT SYSTEM}\par}
    
    \vspace{\fill}
    {\fontsize{13pt}{16pt}\selectfont \textbf{A PROJECT REPORT}\par}
    
    \vspace{\fill}
    {\fontsize{11pt}{14pt}\selectfont \textit{Submitted by}\par}
    \vspace{0.25cm}
    {\fontsize{13pt}{16pt}\selectfont \textbf{SIVARAM VENUGOPAL}\par}
    \vspace{0.15cm}
    {\fontsize{12pt}{15pt}\selectfont \textbf{(310624205263)}\par}
    
    \vspace{\fill}
    {\fontsize{11pt}{14pt}\selectfont \textit{in partial fulfillment for the award of the degree}\par}
    \vspace{0.15cm}
    {\fontsize{11pt}{14pt}\selectfont \textit{of}\par}
    \vspace{0.25cm}
    {\fontsize{13pt}{16pt}\selectfont \textbf{BACHELOR OF TECHNOLOGY}\par}
    \vspace{0.15cm}
    {\fontsize{11pt}{14pt}\selectfont \textit{in}\par}
    \vspace{0.25cm}
    {\fontsize{13pt}{16pt}\selectfont \textbf{INFORMATION TECHNOLOGY}\par}
    
    \vspace{\fill}
    \includegraphics[width=3.5cm]{figures/college_logo.png}\par
    
    \vspace{\fill}
    {\fontsize{13pt}{16pt}\selectfont \textbf{EASWARI ENGINEERING COLLEGE}\par}
    \vspace{0.15cm}
    {\fontsize{9.5pt}{12pt}\selectfont \textbf{(AN AUTONOMOUS INSTITUTION) -- AFFILIATED TO ANNA UNIVERSITY}\par}
    \vspace{0.15cm}
    {\fontsize{9.5pt}{12pt}\selectfont \textbf{RAMAPURAM, CHENNAI -- 600 089}\par}
    
    \vspace{\fill}
    {\fontsize{12pt}{15pt}\selectfont \textbf{OCTOBER 2026}\par}
    \vspace*{0.2cm}
\end{center}
\end{titlepage}'''

s = s[:title_start] + new_title + s[title_end:]

# 2. Remove BLANK INSIDE PAGE
blank_idx = s.find(r'% 2. BLANK INSIDE PAGE')
if blank_idx != -1:
    bonafide_idx = s.find(r'% 3. BONAFIDE CERTIFICATE', blank_idx)
    s = s[:blank_idx] + s[bonafide_idx:]

# Ensure Bonafide starts at Roman page 2
s = s.replace(r'\setcounter{page}{3}' + '\n' + r'\thispagestyle{empty}' + '\n\n' + r'\begin{center}' + '\n    {\large \textbf{EASWARI ENGINEERING COLLEGE}}',
              r'\setcounter{page}{2}' + '\n' + r'\begin{center}' + '\n    {\large \textbf{EASWARI ENGINEERING COLLEGE}}')
s = s.replace(r'\setcounter{page}{3}', r'\setcounter{page}{2}')

# 3. Update TOC (Remove Contd title, update page numbers)
toc_start = s.find(r'\chapter*{TABLE OF CONTENTS}')
lof_start = s.find(r'\chapter*{LIST OF FIGURES}')

new_toc = r'''\chapter*{TABLE OF CONTENTS}

\noindent
\begin{tabularx}{\textwidth}{@{}p{3.2cm}X r@{}}
\textbf{CHAPTER NO.} & \multicolumn{1}{c}{\textbf{TITLE}} & \textbf{PAGE No.} \\[0.3cm]
& \textbf{ABSTRACT} & \textbf{iv} \\
& \textbf{ACKNOWLEDGEMENT} & \textbf{v} \\
\textbf{CHAPTER 1} & \textbf{INTRODUCTION} & \textbf{1--3} \\
& 1.1 OVERVIEW & 1 \\
& 1.2 PROBLEM DEFINITION & 1 \\
& 1.3 OBJECTIVE & 2 \\
& 1.4 SCOPE OF THE PROJECT & 2 \\
& 1.5 MOTIVATION & 3 \\
& 1.6 SUMMARY & 3 \\
\textbf{CHAPTER 2} & \textbf{RELATED WORK} & \textbf{4--6} \\
& 2.1 LITERATURE REVIEW & 4 \\
& 2.2 EXISTING SYSTEM & 4 \\
& 2.3 PROPOSED SYSTEM & 5 \\
& 2.4 SUMMARY & 6 \\
\textbf{CHAPTER 3} & \textbf{SYSTEM ANALYSIS} & \textbf{7--10} \\
& 3.1 SYSTEM REQUIREMENTS & 7 \\
& 3.2 SOFTWARE AND HARDWARE REQUIREMENTS & 8 \\
& 3.3 SUMMARY & 10 \\
\textbf{CHAPTER 4} & \textbf{SYSTEM DESIGN} & \textbf{11--15} \\
& 4.1 SYSTEM ARCHITECTURE & 11 \\
& 4.2 MODULE DESCRIPTION & 12 \\
& 4.3 CLASS DIAGRAM & 13 \\
& 4.4 SEQUENCE DIAGRAM & 14 \\
& 4.5 SUMMARY & 15 \\
\textbf{CHAPTER 5} & \textbf{IMPLEMENTATION} & \textbf{16--19} \\
& 5.1 IMPLEMENTATION OVERVIEW & 16 \\
& 5.2 KEY FUNCTIONS (CODE EXPLANATION) & 16 \\
& 5.3 SUMMARY & 19 \\
\textbf{CHAPTER 6} & \textbf{CONCLUSION \& FUTURE WORK} & \textbf{20--21} \\
& 6.1 CONCLUSION & 20 \\
& 6.2 FUTURE ENHANCEMENTS & 20 \\
& 6.3 SUMMARY & 21 \\
\end{tabularx}

\clearpage

% Table of Contents Page 2 - NO CONTD TITLE!
\noindent
\begin{tabularx}{\textwidth}{@{}p{3.2cm}X r@{}}
\textbf{CHAPTER NO.} & \multicolumn{1}{c}{\textbf{TITLE}} & \textbf{PAGE No.} \\[0.3cm]
\textbf{APPENDIX} & \textbf{SOURCE CODE} & \textbf{22--29} \\
& 1. Project Folder Structure & 22 \\
& 2. Backend Package Installation Commands & 22 \\
& 3. Database Connection Configuration & 22 \\
& 4. Environment Variables Configuration & 23 \\
& 5. User \& Supplier Domain Schema & 23 \\
& 6. Supplier Registration \& Password Hashing Controller & 24 \\
& 7. Login and JWT Generation Controller & 24 \\
& 8. Authentication \& RBAC Middleware & 25 \\
& 9. Create API (Purchase Order with 18\% GST Engine) & 25 \\
& 10. Read API (Supplier Directory \& Performance Query) & 26 \\
& 11. Update API (FSM Purchase Order State Transitions) & 26 \\
& 12. Delete API (PO Cancellation \& Audit Rollback) & 27 \\
& 13. Express REST API Routes Configuration & 27 \\
& 14. Main Server Entry Point \& WebSocket Initialization & 28 \\
& 15. React Procurement Buyer Dashboard Component & 28 \\
& 16. Supplier Scorecard \& Performance Aggregation & 29 \\
& 17. REST API Request and Response Examples & 29 \\
& \textbf{SCREENSHOTS OF THE PROJECT} & \textbf{30--31} \\
& \textbf{REFERENCES} & \textbf{32} \\
\end{tabularx}

\clearpage
'''

s = s[:toc_start] + new_toc + s[lof_start:]

# 4. Update LOF & LOT
lof_start = s.find(r'\chapter*{LIST OF FIGURES}')
arab_start = s.find(r'\pagenumbering{arabic}')

new_lof_lot = r'''\chapter*{LIST OF FIGURES}

\noindent
\begin{tabularx}{\textwidth}{@{}p{2.8cm}X r@{}}
\textbf{FIGURE NO.} & \multicolumn{1}{c}{\textbf{TITLE}} & \textbf{PAGE No.} \\[0.4cm]
Figure 1 & Four-Tier Enterprise Architecture of VendorFlow Platform & 11 \\[0.3cm]
Figure 2 & UML Class Diagram of VendorFlow Entities and Domain Relationships & 13 \\[0.3cm]
Figure 3 & UML Sequence Diagram: Purchase Order Creation \& Multi-Tier Approval & 14 \\[0.3cm]
Figure 4 & VendorFlow Procurement Dashboard: Purchase Order Lifecycle \& Real-Time KPI & 30 \\[0.3cm]
Figure 5 & Automated Purchase Order Calculator with 18\% GST Line-Item Tax Valuation & 30 \\[0.3cm]
Figure 6 & Supplier Compliance Console: PAN/GSTIN Credential Verification \& Tier Status & 31 \\[0.3cm]
Figure 7 & Quantitative Supplier Scorecard: Multi-Criteria Quality \& Delivery Ratings & 31 \\
\end{tabularx}

\clearpage

\chapter*{LIST OF TABLES}

\noindent
\begin{tabularx}{\textwidth}{@{}p{2.8cm}X r@{}}
\textbf{TABLE NO.} & \multicolumn{1}{c}{\textbf{TITLE}} & \textbf{PAGE No.} \\[0.4cm]
Table 1 & Operational Hardware Specifications & 8 \\[0.3cm]
Table 2 & Software Frameworks and Runtime Specifications & 9 \\
\end{tabularx}

\clearpage
'''

s = s[:lof_start] + new_lof_lot + s[arab_start:]

# Save VendorFlow_Project_Report.tex
with open(tex_path, 'w', encoding='utf-8') as f:
    f.write(s)

# Also update main.tex
main_path = os.path.join(base_dir, "main.tex")
with open(main_path, 'w', encoding='utf-8') as f:
    f.write(s)

# Update zip directly
zip_name = os.path.join(base_dir, "VendorFlow_Overleaf_Project.zip")
with zipfile.ZipFile(zip_name, "w", zipfile.ZIP_DEFLATED) as zipf:
    zipf.write(main_path, arcname="main.tex")
    fig_dir = os.path.join(base_dir, "figures")
    if os.path.exists(fig_dir):
        for root, dirs, files in os.walk(fig_dir):
            for file in files:
                full_p = os.path.join(root, file)
                rel_p = os.path.relpath(full_p, base_dir)
                zipf.write(full_p, arcname=rel_p)

print("Finished fixing VendorFlow LaTeX files and Overleaf Zip!")
