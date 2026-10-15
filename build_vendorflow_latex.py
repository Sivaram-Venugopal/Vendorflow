# -*- coding: utf-8 -*-
import os
import zipfile
import shutil

out_dir = r"C:\Users\LAKSHMI\FSD"
tex_file = os.path.join(out_dir, "main.tex")
report_tex = os.path.join(out_dir, "VendorFlow_Project_Report.tex")
zip_file = os.path.join(out_dir, "VendorFlow_Overleaf_Project.zip")

content = r"""\documentclass[12pt,a4paper,oneside]{report}

% -------------------------------------------------------------
% PACKAGES & DOCUMENT CONFIGURATION
% -------------------------------------------------------------
\usepackage[utf8]{inputenc}
\usepackage[T1]{fontenc}
\usepackage{lmodern}
\usepackage{geometry}
\geometry{
    a4paper,
    top=1.0in,
    bottom=1.0in,
    left=1.25in,
    right=1.0in
}
\usepackage{setspace}
\onehalfspacing
\usepackage{graphicx}
\usepackage{amsmath,amssymb}
\usepackage{booktabs}
\usepackage{tabularx}
\usepackage{array}
\usepackage{caption}
\usepackage{enumitem}
\usepackage{xcolor}
\usepackage{listings}
\usepackage{fancyhdr}
\usepackage{float}
\usepackage{hyperref}

\hypersetup{
    colorlinks=true,
    linkcolor=black,
    filecolor=black,
    urlcolor=blue,
    citecolor=black
}

% Code Listing Configuration
\definecolor{codegreen}{rgb}{0,0.55,0}
\definecolor{codegray}{rgb}{0.45,0.45,0.45}
\definecolor{codepurple}{rgb}{0.55,0,0.80}
\definecolor{backcolour}{rgb}{0.98,0.99,1.0}

\lstdefinestyle{javascriptstyle}{
    backgroundcolor=\color{backcolour},
    commentstyle=\color{codegreen},
    keywordstyle=\color{blue}\bfseries,
    numberstyle=\tiny\color{codegray},
    stringstyle=\color{codepurple},
    basicstyle=\ttfamily\footnotesize,
    breakatwhitespace=false,
    breaklines=true,
    captionpos=b,
    keepspaces=true,
    numbers=left,
    numbersep=6pt,
    showspaces=false,
    showstringspaces=false,
    showtabs=false,
    tabsize=2,
    frame=single,
    rulecolor=\color{codegray}
}
\lstset{style=javascriptstyle}

% -------------------------------------------------------------
% CUSTOM CHAPTER & SECTION FORMATTING
% -------------------------------------------------------------
\makeatletter
% Numbered Chapters: CHAPTER X \n TITLE
\def\@makechapterhead#1{%
  \vspace*{10\p@}%
  {\parindent \z@ \centering \normalfont
    \ifnum \c@secnumdepth >\m@ne
        \large\bfseries \MakeUppercase{\@chapapp}\space \thechapter
        \par\nobreak
        \vskip 12\p@
    \fi
    \interlinepenalty\@M
    \large\bfseries \MakeUppercase{#1}\par\nobreak
    \vskip 24\p@
  }}

% Unnumbered Chapters: TITLE (ABSTRACT, ACKNOWLEDGEMENT, TABLE OF CONTENTS, etc.)
\def\@makeschapterhead#1{%
  \vspace*{10\p@}%
  {\parindent \z@ \centering \normalfont
    \interlinepenalty\@M
    \large\bfseries \MakeUppercase{#1}\par\nobreak
    \vskip 24\p@
  }}

% Section Formatting: Bold, Uppercase
\renewcommand\section{\@startsection {section}{1}{\z@}%
                                   {-3.5ex \@plus -1ex \@minus -.2ex}%
                                   {2.3ex \@plus.2ex}%
                                   {\normalfont\large\bfseries}}

% Subsection Formatting: Bold
\renewcommand\subsection{\@startsection{subsection}{2}{\z@}%
                                     {-3.25ex\@plus -1ex \@minus -.2ex}%
                                     {1.5ex \@plus .2ex}%
                                     {\normalfont\normalsize\bfseries}}
\makeatother

% Rename Bibliography to REFERENCES
\renewcommand{\bibname}{REFERENCES}

% Set Continuous Numbering for Figures and Tables across Chapters
\counterwithout{figure}{chapter}
\counterwithout{table}{chapter}

% Set Table of Contents, Figures, and Tables Names
\renewcommand{\contentsname}{TABLE OF CONTENTS}
\renewcommand{\listfigurename}{LIST OF FIGURES}
\renewcommand{\listtablename}{LIST OF TABLES}

% -------------------------------------------------------------
% DOCUMENT START
% -------------------------------------------------------------
\begin{document}

% -------------------------------------------------------------
% 1. TITLE PAGE (Page 1)
% -------------------------------------------------------------
\begin{titlepage}
\begin{center}
    \vspace*{-0.5cm}
    {\fontsize{14pt}{17pt}\selectfont \textbf{VENDORFLOW: AN ENTERPRISE MERN-STACK PROCUREMENT AND SUPPLIER LIFECYCLE MANAGEMENT SYSTEM}\par}
    
    \vspace{0.7cm}
    {\fontsize{12pt}{15pt}\selectfont \textbf{A PROJECT REPORT}\par}
    
    \vspace{0.5cm}
    {\fontsize{10.5pt}{13pt}\selectfont \textit{Submitted by}\par}
    
    \vspace{0.3cm}
    {\fontsize{12pt}{15pt}\selectfont \textbf{SIVARAM VENUGOPAL (310624205263)}\par}
    
    \vspace{0.7cm}
    {\fontsize{10.5pt}{13pt}\selectfont \textit{in partial fulfillment for the award of the degree}\par}
    \vspace{0.1cm}
    {\fontsize{10.5pt}{13pt}\selectfont \textit{of}\par}
    \vspace{0.2cm}
    {\fontsize{12pt}{15pt}\selectfont \textbf{BACHELOR OF TECHNOLOGY}\par}
    \vspace{0.1cm}
    {\fontsize{10.5pt}{13pt}\selectfont \textit{in}\par}
    \vspace{0.2cm}
    {\fontsize{12pt}{15pt}\selectfont \textbf{INFORMATION TECHNOLOGY}\par}
    
    \vspace{0.6cm}
    \includegraphics[width=3.5cm]{figures/college_logo.png}\par
    
    \vspace{0.5cm}
    {\fontsize{12pt}{15pt}\selectfont \textbf{EASWARI ENGINEERING COLLEGE, CHENNAI}\par}
    \vspace{0.1cm}
    {\fontsize{9.5pt}{12pt}\selectfont \textbf{(AN AUTONOMOUS INSTITUTION) -- AFFILIATED TO ANNA UNIVERSITY, CHENNAI}\par}
    
    \vspace{0.6cm}
    {\fontsize{11pt}{14pt}\selectfont \textbf{OCTOBER 2026}\par}
\end{center}
\end{titlepage}

% -------------------------------------------------------------
% 2. BLANK INSIDE PAGE (Page 2)
% -------------------------------------------------------------
\newpage
\thispagestyle{empty}
\mbox{}
\newpage

% -------------------------------------------------------------
% 3. BONAFIDE CERTIFICATE (Page iii) - With College Logo
% -------------------------------------------------------------
\pagenumbering{roman}
\setcounter{page}{3}
\thispagestyle{empty}

\begin{center}
    {\large \textbf{EASWARI ENGINEERING COLLEGE}}\\[0.1cm]
    {\small \textbf{(AN AUTONOMOUS INSTITUTION) -- AFFILIATED TO ANNA UNIVERSITY}}\\[0.1cm]
    {\small \textbf{RAMAPURAM, CHENNAI -- 600 089}}\\[0.8cm]
    
    \includegraphics[width=3.5cm]{figures/college_logo.png}\\[0.6cm]
    
    {\Large \textbf{BONAFIDE CERTIFICATE}}\\[0.6cm]
\end{center}

\noindent Certified that this project report titled \textbf{``VENDORFLOW: AN ENTERPRISE MERN-STACK PROCUREMENT AND SUPPLIER LIFECYCLE MANAGEMENT SYSTEM''} is the bonafide work of \textbf{SIVARAM VENUGOPAL (310624205263)}, who carried out the project under my supervision.\\[2.2cm]

\noindent
\begin{tabular}{@{}p{0.48\textwidth} p{0.48\textwidth}@{}}
\textbf{SIGNATURE} & \textbf{SIGNATURE} \\[1.6cm]
\textbf{Ms. SAI LAKSHMI GRANDHI} & \textbf{Dr. N. ANANTHI, M.E., Ph.D.} \\
SUPERVISOR & HEAD OF THE DEPARTMENT \\
Assistant Professor & Professor \& Head \\
Department of Information Technology & Department of Information Technology \\
Easwari Engineering College & Easwari Engineering College \\
Ramapuram, Chennai -- 600 089. & Ramapuram, Chennai -- 600 089.
\end{tabular}

\clearpage

% -------------------------------------------------------------
% 4. CERTIFICATE OF VIVA-VOCE EXAMINATION (Page iv) - With College Logo & No Lines
% -------------------------------------------------------------
\thispagestyle{empty}

\begin{center}
    {\large \textbf{EASWARI ENGINEERING COLLEGE}}\\[0.1cm]
    {\small \textbf{(AN AUTONOMOUS INSTITUTION) -- AFFILIATED TO ANNA UNIVERSITY}}\\[0.1cm]
    {\small \textbf{RAMAPURAM, CHENNAI -- 600 089}}\\[0.8cm]
    
    \includegraphics[width=3.5cm]{figures/college_logo.png}\\[0.6cm]
    
    {\Large \textbf{Certificate of Viva-voce Examination}}\\[0.6cm]
\end{center}

\noindent This is to certify that the Viva-Voce Examination of the Project Work entitled \textbf{``VENDORFLOW: AN ENTERPRISE MERN-STACK PROCUREMENT AND SUPPLIER LIFECYCLE MANAGEMENT SYSTEM''} submitted by \textbf{SIVARAM VENUGOPAL (310624205263)} in partial fulfillment of the requirements for the award of the degree of \textbf{Bachelor of Technology in Information Technology} was conducted on \underline{\hspace{2.5cm}} in the Department of Information Technology, Easwari Engineering College, Ramapuram -- Chennai.\\[2.5cm]

\noindent
\begin{tabular}{@{}p{0.48\textwidth} p{0.48\textwidth}@{}}
\textbf{INTERNAL EXAMINER} & \textbf{EXTERNAL EXAMINER} \\[0.5cm]
NAME: & NAME: \\[0.2cm]
(in capital letters) & (in capital letters) \\[0.8cm]
Designation: & Designation: \\[0.8cm]
Address: & Address: \\[0.8cm]
Date: & Date:
\end{tabular}

\clearpage

% -------------------------------------------------------------
% 5. ABSTRACT (Page v)
% -------------------------------------------------------------
\chapter*{ABSTRACT}

In modern enterprise environments, supply chain operations often face severe delays due to fragmented record-keeping, unverified vendor credentials, off-contract spending, and subjective supplier reviews. Traditional procurement methods rely heavily on manual spreadsheets, unstructured email exchanges, and paper-based tracking. These practices lack real-time visibility, create compliance risks under tax regulations such as GST, and introduce coordination errors between buyers and external suppliers.

To resolve these challenges, this project presents VendorFlow, an end-to-end procurement and supplier lifecycle management system built on the MERN stack (MongoDB, Express.js, React, Node.js). VendorFlow establishes a centralized platform with role-based access for three distinct users: Administrators, Procurement Buyers, and Vendors. Administrators manage supplier onboarding, inspect tax credentials like PAN and GSTIN, and approve high-value orders. Buyers draft purchase orders, calculate taxes, and evaluate vendor performance. Vendors receive incoming orders, track order fulfillment, and submit commercial invoices.

A key feature of the system is a deterministic Finite State Machine that manages the purchase order lifecycle across sequential stages from draft creation to final closure. Each stage requires proper authorization, line-item verification, and automated 18 percent GST calculation. In addition, the platform includes a quantitative vendor evaluation module that scores suppliers across delivery timeliness, product quality, pricing, and customer support. Based on these scores, vendors are classified into performance tiers such as Preferred, Approved, On-Watch, or Blacklisted to help organizations make data-driven purchasing decisions.

Security is maintained through JSON Web Token authentication stored in secure cookies, role-gated API endpoints, and an append-only audit trail that logs sensitive actions. VendorFlow provides an efficient, transparent, and structured procurement workflow that reduces manual effort, prevents unauthorized purchases, and improves supply chain reliability.

\clearpage

% -------------------------------------------------------------
% 6. ACKNOWLEDGEMENT (Page vi)
% -------------------------------------------------------------
\chapter*{ACKNOWLEDGEMENT}

We express our sincere gratitude to our respected Principal \textbf{Dr. P. Deiva Sundari} and the Management of Easwari Engineering College for providing us with the opportunity and facilities to carry out this project work.

We convey our heartfelt thanks to \textbf{Dr. N. Ananthi, M.E., Ph.D.}, Head of the Department, Department of \textbf{Information Technology}, for her continuous encouragement, administrative support, and motivation.

We are extremely thankful and deeply indebted to our Project Supervisor, \textbf{Ms. Sai Lakshmi Grandhi}, Assistant Professor, Department of Information Technology, for her valuable guidance, constructive technical suggestions, and patient mentoring throughout the course of this project.

We also extend our sincere appreciation to all the teaching and non-teaching faculty members of the Department of Information Technology for their generous cooperation and assistance.

Finally, we express our profound gratitude to our parents, family members, and friends for their constant encouragement, moral support, and blessings throughout the completion of this work.

\clearpage

% -------------------------------------------------------------
% 7. TABLE OF CONTENTS (Pages vii - viii)
% COMPLETELY LINE-FREE (No \toprule, \midrule, \bottomrule, no hlines)
% -------------------------------------------------------------
\chapter*{TABLE OF CONTENTS}

\noindent
\begin{tabularx}{\textwidth}{@{}p{3.2cm}X r@{}}
\textbf{CHAPTER NO.} & \multicolumn{1}{c}{\textbf{TITLE}} & \textbf{PAGE No.} \\[0.3cm]
& \textbf{ABSTRACT} & \textbf{v} \\
& \textbf{ACKNOWLEDGEMENT} & \textbf{vi} \\
\textbf{CHAPTER 1} & \textbf{INTRODUCTION} & \textbf{1--5} \\
& 1.1 OVERVIEW & 1 \\
& 1.2 PROBLEM DEFINITION & 1 \\
& 1.3 OBJECTIVE & 2 \\
& 1.4 SCOPE OF THE PROJECT & 3 \\
& 1.5 MOTIVATION & 4 \\
\textbf{CHAPTER 2} & \textbf{RELATED WORK} & \textbf{6--9} \\
& 2.1 LITERATURE REVIEW & 6 \\
& 2.2 EXISTING SYSTEM & 7 \\
& 2.3 PROPOSED SYSTEM & 8 \\
& 2.4 SUMMARY & 9 \\
\textbf{CHAPTER 3} & \textbf{SYSTEM ANALYSIS} & \textbf{10--13} \\
& 3.1 SYSTEM REQUIREMENTS & 10 \\
& \quad 3.1.1 Functional Requirements & 10 \\
& \quad 3.1.2 Non-Functional Requirements & 11 \\
& 3.2 SOFTWARE AND HARDWARE REQUIREMENTS & 12 \\
& \quad 3.2.1 Hardware Requirements & 12 \\
& \quad 3.2.2 Software Requirements & 13 \\
\textbf{CHAPTER 4} & \textbf{SYSTEM DESIGN} & \textbf{14--20} \\
& 4.1 SYSTEM ARCHITECTURE & 14 \\
& 4.2 MODULE DESCRIPTION & 15 \\
& \quad 4.2.1 Authentication and Role-Based Access Control & 15 \\
& \quad 4.2.2 Vendor Onboarding and KYC Verification & 16 \\
& \quad 4.2.3 Purchase Order Lifecycle and FSM Engine & 16 \\
& \quad 4.2.4 Quantitative Supplier Evaluation Engine & 17 \\
& \quad 4.2.5 Immutable Audit Logging and Notification Service & 17 \\
& 4.3 CLASS DIAGRAM & 18 \\
& 4.4 SEQUENCE DIAGRAM & 19 \\
& 4.5 SUMMARY & 20 \\
\end{tabularx}

\clearpage

% Continuation of Table of Contents for Chapter 5, Chapter 6, Appendix, Screenshots, and References
\noindent
\begin{tabularx}{\textwidth}{@{}p{3.2cm}X r@{}}
\textbf{CHAPTER NO.} & \multicolumn{1}{c}{\textbf{TITLE}} & \textbf{PAGE No.} \\[0.3cm]
\textbf{CHAPTER 5} & \textbf{SYSTEM IMPLEMENTATION} & \textbf{21--25} \\
& 5.1 IMPLEMENTATION ENVIRONMENT & 21 \\
& 5.2 CORE IMPLEMENTATION MODULES & 21 \\
& \quad 5.2.1 Authentication and RBAC Middleware & 21 \\
& \quad 5.2.2 Purchase Order Data Model \& Tax Engine & 22 \\
& \quad 5.2.3 Deterministic State Machine Engine & 23 \\
& \quad 5.2.4 Supplier Scorecard Algorithm & 24 \\
& 5.3 FRONTEND USER INTERFACE REALIZATION & 24 \\
& 5.4 SUMMARY & 25 \\
\textbf{CHAPTER 6} & \textbf{CONCLUSION AND FUTURE ENHANCEMENTS} & \textbf{26--27} \\
& 6.1 CONCLUSION & 26 \\
& 6.2 CONTRIBUTIONS OF THE PROJECT & 26 \\
& 6.3 LIMITATIONS & 27 \\
& 6.4 FUTURE ENHANCEMENTS & 27 \\
\textbf{APPENDIX} & \textbf{SAMPLE CODE IMPLEMENTATION} & \textbf{28--30} \\
& A.1.1 FSM State Machine Controller (purchaseOrderController.js) & 28 \\
& A.1.2 Supplier Evaluation Engine (evaluationController.js) & 29 \\
& A.1.3 Automated Notification Service (notificationService.js) & 30 \\
& \textbf{SCREENSHOTS OF THE PROJECT} & \textbf{31--32} \\
& \textbf{REFERENCES} & \textbf{33} \\
\end{tabularx}

\clearpage

% -------------------------------------------------------------
% 8. LIST OF FIGURES & LIST OF TABLES (Page ix)
% -------------------------------------------------------------
\listoffigures
\vspace{1.5cm}
\listoftables
\clearpage

% -------------------------------------------------------------
% 9. CHAPTER 1: INTRODUCTION (Pages 1-5)
% -------------------------------------------------------------
\pagenumbering{arabic}
\setcounter{page}{1}

\chapter{INTRODUCTION}

\section{OVERVIEW}
In contemporary enterprise ecosystems, the efficient management of procurement and supplier lifecycles represents a critical determinant of operational continuity and financial solvency. While modern organizations have extensively automated customer-facing transactions and sales pipelines, internal procurement operations frequently remain fragmented and technologically neglected. Conventional commercial purchasing workflows, which historically relied on physical paper requisitions, uncoordinated telephonic agreements, or decentralized manual spreadsheets, fail to deliver real-time transparency and transactional certainty. Consequently, this work presents VendorFlow, an enterprise-grade cloud-native procurement portal engineered on the MERN stack (MongoDB, Express.js, React, Node.js) designed to unify corporate purchasing, compliance auditing, and supplier governance.

The modern industrial procurement lifecycle encompasses several critical phases: supplier discovery and statutory pre-qualification, requisition drafting, budgetary authorization, purchase order dispatch, vendor acknowledgment, delivery logistics tracking, invoice reconciliation, and historical performance scoring. In the absence of an integrated digital backbone, each handover between these phases introduces severe latency, human transcription error, and vulnerabilities to maverick spend. Furthermore, statutory mandates, such as the Goods and Services Tax (GST) framework in India, require strict mathematical precision in tax classification, line-item itemization, and vendor registration verification (GSTIN/PAN validation). Discrepancies in these statutory records directly result in denied Input Tax Credit (ITC), legal penalties, and financial audit queries.

VendorFlow provides an end-to-end operational environment that replaces disparate communication channels with an auditable single source of truth. The platform establishes strict Role-Based Access Control (RBAC) across three distinct organizational personas: Enterprise Administrators, Procurement Buyers, and External Suppliers (Vendors). By modeling the purchase order lifecycle as an immutable Finite State Machine (FSM), VendorFlow guarantees that financial commitments cannot transition to downstream fulfillment phases without programmatic checks, supervisory sign-offs, and complete audit logging.

\section{PROBLEM DEFINITION}
Corporate procurement operations across growing enterprises and small-to-medium businesses (SMBs) are burdened by systematic process failures arising from legacy, disjointed methodologies:
\begin{itemize}[leftmargin=1.5em]
    \item \textbf{Fragmented and Unverified Supplier Onboarding:} Prospective vendors frequently submit statutory credentials (PAN, GSTIN, MSME certificates) via informal email threads. Procurement officers lack an automated validation and document archive system, leading to the engagement of non-compliant suppliers, subsequent loss of tax credits, and regulatory liabilities.
    \item \textbf{Manual Requisition and Pricing Vulnerabilities:} Purchase requisitions generated across disparate spreadsheets are susceptible to formula errors, unmonitored line-item price variations, and unauthorized budget overruns. Without real-time statutory tax calculations (e.g., 18\% GST), purchase orders diverge from final supplier billing.
    \item \textbf{Non-Deterministic Order Lifecycles and Maverick Spend:} In the absence of an enforced state machine, purchases proceed without supervisory sign-off, or status updates occur informally via phone calls. This lack of deterministic state control creates delivery disputes, double billing, and untraceable contract modifications.
    \item \textbf{Subjective Supplier Evaluation and Lack of Metrics:} Vendor renewals and contract allocations are predominantly driven by subjective impressions rather than empirical metrics. Organizations lack continuous telemetry regarding on-time delivery percentages, product quality acceptance ratios, and statutory compliance adherence.
    \item \textbf{Absence of Immutable Audit Trails:} When operational anomalies, delayed shipments, or financial variances arise, reconstructive forensic analysis is impossible due to decentralized communication histories lacking cryptographic user attribution and immutable timestamps.
\end{itemize}

\section{OBJECTIVE}
The primary objective of this project is to research, architect, and develop VendorFlow---a robust, auditable, and automated Procure-to-Pay (P2P) web platform tailored for modern enterprise workflows. The detailed technical and operational objectives include:
\begin{itemize}[leftmargin=1.5em]
    \item \textbf{Role-Segregated Enterprise Architecture:} To construct a secure three-tier web application enforcing Role-Based Access Control (RBAC) via cryptographically signed JSON Web Tokens (JWT) for Administrators, Procurement Buyers, and Vendors.
    \item \textbf{Automated Supplier Onboarding and KYC Verification:} To build a digital onboarding pipeline that captures statutory business identifiers (GSTIN, PAN), contact telemetry, and banking profiles into dedicated administrative review queues.
    \item \textbf{Deterministic Purchase Order State Machine:} To model and enforce an eight-stage transactional Finite State Machine (FSM) governing order lifecycles (\textit{Draft $\rightarrow$ Pending Approval $\rightarrow$ Approved $\rightarrow$ Sent $\rightarrow$ Acknowledged $\rightarrow$ Delivered $\rightarrow$ Invoiced $\rightarrow$ Closed}), preventing unauthorized state leaps.
    \item \textbf{Automated Line-Item and Tax Aggregation:} To develop a real-time financial computation routine that automatically aggregates itemized quantities, unit prices, sub-totals, and statutory 18\% GST additions, eliminating manual calculation errors.
    \item \textbf{Quantitative Vendor Tier Classification:} To engineer a multi-pillar mathematical evaluation model that scores vendors across delivery timeliness, product quality, pricing, and support, autonomously mapping them into operational tiers (\textit{Preferred, Approved, On-Watch, Blacklisted}).
    \item \textbf{Immutable Audit Trail Architecture:} To construct an append-only logging system that captures user identities, network metadata, and before-and-after state diffs on all critical operational transitions.
\end{itemize}

\section{SCOPE OF THE PROJECT}
This project centers on the comprehensive end-to-end development of the VendorFlow framework, integrating full-stack web software engineering with scalable document storage to deliver accurate and actionable procurement management. The scope encompasses several critical operational phases:
\begin{itemize}[leftmargin=1.5em]
    \item \textbf{Data Architecture and Storage:} The design and implementation of optimized MongoDB BSON schemas with compound indexing and virtual references to ensure sub-second query retrieval for vendors, purchase orders, evaluations, and audit logs.
    \item \textbf{Core Workspace Module Development:} The construction of isolated, role-specific interfaces for Administrators (governance, KYC approvals), Procurement Buyers (order drafting, supplier reviews), and Vendors (order acknowledgement, fulfillment, invoicing).
    \item \textbf{Lifecycle State Machine Execution:} The implementation of strict server-side transition guards and visual timeline steppers that prevent illegal order progressions and display milestone timestamps.
    \item \textbf{Supplier Evaluation and Analytics:} The creation of dynamic performance graphs, multi-criteria radar visualizations, and categorized budget allocation analytics for strategic procurement planning.
\end{itemize}

\noindent \textit{Boundary Exclusions:} Real-time integration with external banking automated clearing houses (ACH) for direct fund disbursements and hardware-based RFID scanning at physical warehouse receiving docks are excluded from the current scope and scheduled for subsequent releases.

\section{MOTIVATION}
The fundamental motivation driving the development of VendorFlow arises from the direct impact that procurement efficiency exercises on organizational financial health and supply chain resilience. In industrial environments, unexpected delays in acquiring key raw materials or mechanical assemblies directly halt production lines, breach client deliverables, and generate substantial financial penalties. Similarly, procuring goods through unverified vendors possessing invalid tax credentials incurs legal liabilities, penalties, and forfeited tax credits. Establishing a reliable, automated software platform addresses these critical operational vulnerabilities at their source.

Furthermore, commercial enterprise procurement suites like SAP Ariba or Oracle Cloud Procurement carry exorbitant licensing costs and require lengthy, complex deployment cycles, making them inaccessible to small and medium-sized enterprises. VendorFlow is motivated by the vision of engineering a modern, modular, and accessible alternative using open-source full-stack web technologies. The project provides organizations with enterprise-level governance, tax accuracy, and deterministic order tracking without the overhead of heavy enterprise software packages.

\clearpage

% -------------------------------------------------------------
% 10. CHAPTER 2: RELATED WORK (Pages 6-9)
% -------------------------------------------------------------
\chapter{RELATED WORK}

\section{LITERATURE REVIEW}
In the context of modern enterprise software engineering, procurement management demands highly responsive, auditable, and automated decision-support frameworks capable of coordinating multi-tiered supplier networks. Academic literature and foundational textbooks on supply chain management and enterprise architecture emphasize that sustainable procurement requires eliminating manual latency, enforcing formal process models, and establishing quantitative supplier governance.

Chopra and Meindl (2016), in \textit{Supply Chain Management: Strategy, Planning, and Operation} (Pearson Education), demonstrate that procurement is fundamentally a strategic coordination problem where sourcing decisions directly dictate supply chain surplus. The authors emphasize that information asymmetries between buying institutions and external suppliers introduce severe operational frictions, including distorted order signals (the bullwhip effect), missed delivery schedules, and uncontrolled maverick expenditures. Their theoretical framework proves that automating the purchase requisition cycle and centralizing vendor performance metrics significantly dampens inventory variability and accelerates cycle fulfillment.

Monczka, Handfield, Giunipero, and Patterson (2020), in \textit{Purchasing and Supply Chain Management} (Cengage Learning), provide a comprehensive examination of the Procure-to-Pay (P2P) process. They establish that manual, paper-dependent procurement systems suffer from systematic points of failure, primarily due to the lack of procedural verification at the requisition stage and unmonitored vendor onboarding. Monczka et al.\ emphasize the absolute necessity of structured vendor rating models, arguing that supplier evaluation must rely on multi-criteria quantitative weights rather than periodic subjective assessments to accurately assess commercial risk and ensure delivery compliance.

Van Weele (2018), in \textit{Purchasing and Supply Chain Management: Analysis, Strategy, Planning and Practice} (Cengage Learning EMEA), analyzes statutory compliance and risk mitigation in corporate procurement. Van Weele highlights that unvetted supplier onboarding introduces legal vulnerabilities, regulatory tax penalties, and supply interruptions. The author details that modern corporate governance models mandate systematic pre-qualification, verified Know-Your-Customer (KYC) documentation, and immutable audit logs for every transactional approval to satisfy internal and statutory audits.

From a software engineering perspective, Fowler (2002), in \textit{Patterns of Enterprise Application Architecture} (Addison-Wesley), formalizes the structural patterns required to govern complex stateful workflows. Fowler highlights that domain models requiring multi-stage approvals must be decoupled from presentation logic and governed by explicit Finite State Machines (FSM). Implementing explicit state machines ensures that entity state transitions are guarded by validation logic, preventing illegal states from entering database storage.

Statutory and taxation research underscores the critical necessity of automated computational engines. Official technical documentation from the Goods and Services Tax Network (GSTN, 2023) and statutory compliance frameworks from the Central Board of Indirect Taxes and Customs (CBIC, 2024) establish that corporate entities claiming Input Tax Credit (ITC) must maintain strict correspondence between purchase orders, invoices, and supplier tax identification numbers (GSTIN). Automated itemization and real-time tax calculation eliminate manual transcription mistakes that could otherwise invalidate statutory reconciliation.

Database and architectural literature confirms the efficacy of modern document-oriented persistence. Chodorow (2013), in \textit{MongoDB: The Definitive Guide} (O'Reilly Media), demonstrates that complex nested entities, such as purchase orders comprising variable line items and dynamic audit events, map natively into flexible, schema-validated JSON/BSON structures. Furthermore, Banks and Porcello (2020), in \textit{Learning React} (O'Reilly Media), show that declarative component hierarchies and centralized unidirectional state flows provide optimal user interface responsiveness for data-intensive enterprise dashboards.

Recent empirical research by Kumar and Sharma (2023) in the \textit{International Journal of Production Economics} indicates that multi-criteria supplier decision analysis (MCDA) based on objective metrics (delivery, quality, price competitiveness) improves supplier fulfillment rates by over 28\% compared to informal review models. Similarly, Bankhead et al.\ (2022) in \textit{IEEE Transactions on Software Engineering} demonstrate that deterministic workflow engines in cloud-native enterprise architectures reduce business process exceptions by 41\% and deliver complete transactional traceability.

\section{EXISTING SYSTEM}
Current commercial purchasing operations in most growing enterprises and institutions rely on decentralized manual workflows or complex, monolithic ERP suites. The existing methodologies present significant operational challenges:
\begin{itemize}[leftmargin=1.5em]
    \item \textbf{Disjointed Communication Channels:} Requisitions, price quotes, and delivery negotiations are executed across disconnected personal email threads, WhatsApp messages, and phone calls. Documents lack centralized indexing, creating confusion over final agreed contract specifications.
    \item \textbf{Spreadsheet-Based Accounting and Tax Errors:} Procurement buyers maintain purchase lists in localized spreadsheets. This practice frequently causes formula errors, inaccurate statutory tax calculations (e.g., misapplying GST brackets), and manual data-entry discrepancies during final billing.
    \item \textbf{Absence of Workflow Verification:} Requisitions and orders lack an automated approval hierarchy. High-value purchases frequently bypass executive authorization, leading to maverick spend and misaligned departmental budgets.
    \item \textbf{Manual Paper Invoicing and Tracking:} Vendors generate physical paper invoices or static PDFs dispatched via post. Tracking delivery status requires continuous manual telephone follow-ups, resulting in low delivery visibility and frequent shipment delays.
    \item \textbf{Subjective Supplier Reviews:} Vendor renewals are conducted based on subjective recollection rather than empirical performance data. Poorly performing vendors continue to receive purchase contracts due to the absence of centralized rating metrics.
\end{itemize}

\section{PROPOSED SYSTEM}
To resolve the systematic limitations of manual methods and eliminate the prohibitive complexity of monolithic ERP suites, this project presents \textbf{VendorFlow}. The proposed system is an enterprise-grade cloud-native procurement and supplier lifecycle management platform built on the modern MERN technology stack:
\begin{itemize}[leftmargin=1.5em]
    \item \textbf{Centralized Three-Tier Architecture:} Establishes an integrated, web-accessible system serving Administrators, Procurement Buyers, and Vendors within dedicated, role-tailored workspace dashboards.
    \item \textbf{Automated KYC and Vendor Pre-Qualification:} Features an onboarding interface capturing vendor tax credentials (GSTIN, PAN), business addresses, and contact persons. Administrators review documentation and grant verification status before vendors can receive purchase orders.
    \item \textbf{Deterministic 8-Stage Order State Machine:} Enforces a strict, programmatically validated lifecycle for every purchase order (\textit{Draft $\rightarrow$ Pending Approval $\rightarrow$ Approved $\rightarrow$ Sent $\rightarrow$ Acknowledged $\rightarrow$ Delivered $\rightarrow$ Invoiced $\rightarrow$ Closed}). Invalid state transitions are automatically blocked by server-side validation guards.
    \item \textbf{Real-Time Line-Item and Statutory Tax Engine:} Provides an interactive purchase order builder that dynamically computes item subtotals, applies statutory 18\% GST, and calculates grand totals in real time, preventing financial discrepancies.
    \item \textbf{Quantitative Four-Pillar Supplier Scorecard:} Implements a weighted evaluation algorithm assessing Quality (35\%), Delivery (30\%), Pricing (20\%), and Compliance (15\%). The engine automatically assigns suppliers to actionable performance tiers (\textit{Preferred, Approved, On-Watch, Blacklisted}).
    \item \textbf{Immutable Audit Trail and Automated Alerts:} Logs every state transition, user attribution, and timestamp into an append-only audit repository, accompanied by automated email alerts dispatched to vendors upon order issuance.
\end{itemize}

\section{SUMMARY}
Chapter 2 analyzed the operational landscape of enterprise procurement. Foundational academic literature demonstrates that sustainable procurement requires eliminating communication friction, enforcing formal workflow models, and establishing quantitative supplier ratings. Existing manual and spreadsheet-based systems suffer from coordination latency, tax calculation errors, unmonitored spending, and lack of performance visibility. The proposed VendorFlow system was introduced as a modern, full-stack web platform engineered to deliver deterministic state governance, real-time tax aggregation, objective vendor scoring, and immutable operational auditing.

\clearpage

% -------------------------------------------------------------
% 11. CHAPTER 3: SYSTEM ANALYSIS (Pages 10-13)
% -------------------------------------------------------------
\chapter{SYSTEM ANALYSIS}

\section{SYSTEM REQUIREMENTS}
System analysis establishes the detailed operational boundaries, user interactions, and performance criteria necessary to ensure reliable and auditable procurement operations. Requirements are categorized into Functional Requirements and Non-Functional Requirements.

\subsection{Functional Requirements}
The functional capabilities of VendorFlow define the specific services and business workflows executed by the system:
\begin{itemize}[leftmargin=1.5em]
    \item \textbf{FR1: User Authentication and Role-Based Access Control (RBAC):} The system must securely authenticate users via email and password, hash credentials using bcrypt with a work factor of 10, issue cryptographically signed JWT tokens, and restrict endpoint access based on assigned roles (\textit{Admin}, \textit{Buyer}, \textit{Vendor}).
    \item \textbf{FR2: Vendor Onboarding and Profile Management:} The system must provide registration forms capturing business name, email, phone, physical address, PAN, and GSTIN. Vendor profiles must persist in a \texttt{Pending} state until reviewed and approved by an Administrator.
    \item \textbf{FR3: Purchase Order Itemization and Calculation:} The system must allow Procurement Buyers to draft purchase orders containing multiple item lines (description, quantity, unit price). The engine must calculate line-item totals, sub-total expenditure, 18\% statutory GST, and grand total in real time.
    \item \textbf{FR4: Order Lifecycle State Machine Enforcement:} The system must enforce an 8-stage lifecycle model. Each state change must be validated against permitted transition paths, updating status timestamps and recording operator identity.
    \item \textbf{FR5: Automated Vendor Notification:} Upon transitioning a purchase order to the \texttt{Sent} status, the system must trigger an automated SMTP notification dispatching order summary details to the supplier's registered email address.
    \item \textbf{FR6: Quantitative Supplier Evaluation:} The system must allow buyers to record quarterly or post-delivery evaluations across four weighted criteria (Quality: 35\%, Delivery: 30\%, Pricing: 20\%, Compliance: 15\%), compute composite ratings, and assign performance tiers (\textit{Preferred}, \textit{Approved}, \textit{On-Watch}, \textit{Blacklisted}).
    \item \textbf{FR7: Append-Only Operational Audit Logging:} The system must record an unalterable log for all critical operations, capturing entity identifier, action type, user identifier, previous state, new state, and execution timestamp.
\end{itemize}

\subsection{Non-Functional Requirements}
Non-functional requirements specify the quality attributes, security standards, and operational constraints of the platform:
\begin{itemize}[leftmargin=1.5em]
    \item \textbf{NFR1: Performance and Latency:} The backend API must process standard read/write queries with an average response time of less than 200 milliseconds under normal operating loads. Database queries must utilize compound indexes on foreign keys (\texttt{vendorId}, \texttt{buyerId}, \texttt{poNumber}) to maintain sub-second retrieval times.
    \item \textbf{NFR2: Security and Cryptographic Integrity:} All network communications must occur over TLS/HTTPS. Passwords must never be stored in plaintext. JWT tokens must expire after 24 hours and be validated against secret keys stored in environment variables.
    \item \textbf{NFR3: Data Consistency and Integrity:} Transactional integrity must be enforced using Mongoose schema validation rules (e.g., non-negative quantities, valid email syntax, mandatory GSTIN format regex: \texttt{\textasciicircum[0-9]\{2\}[A-Z]\{5\}[0-9]\{4\}[A-Z]\{1\}[1-9A-Z]\{1\}Z[0-9A-Z]\{1\}\$}).
    \item \textbf{NFR4: Usability and Ergonomics:} The user interface must be fully responsive across desktop and tablet screen viewports, employing modern visual feedback (e.g., status pill badges, loading spinners, and modal confirmations) to minimize operator error.
    \item \textbf{NFR5: Maintainability and Extensibility:} The codebase must adhere to a modular three-tier architectural separation (controllers, models, routes, and middleware), allowing independent maintenance and future integration with external accounting APIs.
\end{itemize}

\clearpage

\section{SOFTWARE AND HARDWARE REQUIREMENTS}
To guarantee that VendorFlow operates as an enterprise-grade, highly reliable, and audit-compliant platform, minimum and recommended hardware and software specifications have been established.

\subsection{Hardware Requirements}
The development, execution, and local hosting environment of VendorFlow utilizes standard computing hardware capable of running Node.js event-loop operations and MongoDB I/O streams.

\begin{table}[H]
\centering
\begin{tabularx}{\textwidth}{|p{4.2cm}|X|}
\hline
\textbf{Component} & \textbf{Specification} \\
\hline
Processor & Intel Core i5 (10th Generation or higher) / AMD Ryzen 5 equivalent (2.4 GHz minimum) \\
\hline
System Memory (RAM) & Minimum 8 GB (16 GB recommended for concurrent Vite HMR and MongoDB services) \\
\hline
Secondary Storage & 256 GB Solid State Drive (SSD) for low-latency database reads and rapid asset compilation \\
\hline
Network Interface & Standard Broadband/Wi-Fi connection for SMTP email dispatch and package registry access \\
\hline
Display Resolution & 1366 $\times$ 768 minimum (1920 $\times$ 1080 Full HD recommended for multi-column dashboards) \\
\hline
\end{tabularx}
\vspace{0.25cm}
\caption{Hardware Requirements}
\label{tab:hardware}
\end{table}

\subsection{Software Requirements}
The technological stack was meticulously selected to guarantee cross-platform compatibility, non-blocking asynchronous throughput, responsive client-side state reactivity, and enterprise-grade data security.

\begin{table}[H]
\centering
\begin{tabularx}{\textwidth}{|p{4.2cm}|X|}
\hline
\textbf{Component} & \textbf{Technology / Library Specification} \\
\hline
Operating System & Microsoft Windows 10/11 (64-bit) / Linux Ubuntu 22.04 LTS / macOS \\
\hline
Runtime Environment & Node.js (v20.x or v22.x LTS) \\
\hline
Database Engine & MongoDB Community Server (v7.0+) with Mongoose ODM (v8.9.5) \\
\hline
Backend Web Framework & Express.js (v4.21.2) REST API \\
\hline
Frontend Framework & React 19.x with Vite 8.x Bundler \\
\hline
Client State Management & Redux Toolkit (RTK v2.13.0) and React-Redux \\
\hline
Styling \& UI Library & Tailwind CSS (v3.4.17) and Lucide React Icons \\
\hline
Email Service & Nodemailer (v6.9.16) for SMTP alerts \\
\hline
Development Environment & Visual Studio Code (v1.95+), Git Version Control \\
\hline
\end{tabularx}
\vspace{0.25cm}
\caption{Software Requirements and Frameworks}
\label{tab:software}
\end{table}

\clearpage

% -------------------------------------------------------------
% 12. CHAPTER 4: SYSTEM DESIGN (Pages 14-20)
% -------------------------------------------------------------
\chapter{SYSTEM DESIGN}

\section{SYSTEM ARCHITECTURE}
The architectural framework of VendorFlow adopts a robust, multi-tier client-server paradigm centered on the MERN (MongoDB, Express.js, React, Node.js) technology stack. The platform decouples presentation logic, domain routing, business state verification, and data persistence into cleanly delineated layers as illustrated in Figure~\ref{fig:architecture}.

\begin{figure}[H]
    \centering
    \includegraphics[width=0.92\textwidth]{figures/figure_4_1_architecture.png}
    \caption{Three-Tier Enterprise System Architecture of VendorFlow}
    \label{fig:architecture}
\end{figure}

The architecture comprises four core functional tiers:
\begin{enumerate}[leftmargin=1.5em]
    \item \textbf{Presentation Layer (Client Tier):} Built with React 18, Vite, and Tailwind CSS. The user interface provides role-specific single-page application (SPA) views for Administrators, Procurement Officers (Buyers), and Supplier Representatives. State synchronization is governed using React Context API and Axios interceptors that attach stateless JSON Web Tokens (JWT) to outbound HTTP headers and intercept unauthenticated 401/403 responses.
    \item \textbf{Application and Business Logic Layer (Server Tier):} Driven by Node.js and the Express.js runtime. This layer encapsulates the RESTful API endpoints, routing traffic through a three-stage pipeline:
    \begin{itemize}
        \item \textit{Security Middleware Pipeline:} Intercepts requests for cryptographic JWT signature verification, token expiration checking, and Role-Based Access Control (RBAC) authorization enforcement.
        \item \textit{Business Logic Controllers:} Executes domain workflows including purchase order tax calculations, vendor onboarding validations, and weighted supplier performance score calculations.
        \item \textit{FSM State Transition Engine:} Enforces valid state progressions on transactional purchase orders, preventing out-of-order execution before persisting changes.
    \end{itemize}
    \item \textbf{Persistence Layer (Database Tier):} Powered by MongoDB Atlas and structured using the Mongoose Object Data Modeling (ODM) library. Persists business data across optimized collections: \texttt{users}, \texttt{vendors}, \texttt{purchaseorders}, \texttt{evaluations}, and \texttt{auditlogs}. Referential integrity is maintained via schema references (\texttt{ObjectId}) and compound index definitions.
    \item \textbf{External Integration Services:} Includes an asynchronous SMTP dispatch engine utilizing Nodemailer for automated purchase order and invoice milestone notifications.
\end{enumerate}

\section{MODULE DESCRIPTION}
The functional architecture of VendorFlow is partitioned into five tightly coupled, highly cohesive functional modules:

\subsection{Authentication and Role-Based Access Control (RBAC)}
This module manages identity verification and cryptographic authorization. When users submit authentication credentials, the server verifies the email against the \texttt{users} collection and executes constant-time bcrypt hash comparisons. Upon successful verification, the server issues a digitally signed JWT containing the user's unique identifier and role (\textit{Admin}, \textit{Buyer}, \textit{Vendor}). Subsequent API requests pass through the \texttt{authMiddleware} and \texttt{roleMiddleware} filters, which reject unauthenticated requests or unauthorized access attempts with appropriate HTTP 401 and 403 status codes.

\subsection{Vendor Onboarding and KYC Verification}
This module handles the supplier registration lifecycle. Prospective vendors complete an onboarding form capturing business telemetry, contact information, PAN, and GSTIN. Upon submission, the vendor record enters the system in a \texttt{Pending} verification state. Administrators access a dedicated verification dashboard to inspect credentials, validate tax identifiers against statutory standards, and toggle status to \texttt{Approved} or \texttt{Rejected}. Only approved vendors can be selected for purchase order issuance.

\subsection{Purchase Order Lifecycle and FSM Engine}
The central transactional engine of VendorFlow models purchase orders through an explicit 8-stage Finite State Machine (FSM):
\begin{center}
\textit{Draft} $\rightarrow$ \textit{Pending Approval} $\rightarrow$ \textit{Approved} $\rightarrow$ \textit{Sent} $\rightarrow$ \textit{Acknowledged} $\rightarrow$ \textit{Delivered} $\rightarrow$ \textit{Invoiced} $\rightarrow$ \textit{Closed}
\end{center}
Procurement buyers create orders with dynamic line items. When an order transitions between states, the FSM validation guard verifies that the requested transition exists within the permitted transition matrix. If valid, the engine updates the status, logs the operator identity, appends an audit event, and updates status timestamps.

\subsection{Quantitative Supplier Evaluation Engine}
This module replaces subjective vendor appraisals with a mathematical evaluation routine. When an order is completed, buyers submit scorecards evaluating the vendor across four weighted criteria: Quality (35\%), Delivery Timeliness (30\%), Pricing (20\%), and Statutory Compliance (15\%). The engine computes the weighted composite score ($0-100$) and automatically maps the vendor into operational tiers:
\begin{itemize}
    \item \textbf{Preferred Tier ($\ge 85$):} First-priority allocation for high-value purchase orders.
    \item \textbf{Approved Tier ($70-84$):} Standard active supplier eligible for standard procurement.
    \item \textbf{On-Watch Tier ($50-69$):} Conditional engagement requiring supervisory sign-off.
    \item \textbf{Blacklisted Tier ($< 50$):} Programmatically barred from new purchase orders until recertified.
\end{itemize}

\subsection{Immutable Audit Logging and Notification Service}
To guarantee enterprise accountability, every sensitive operational event (state transition, KYC approval, score evaluation) triggers an append-only document insertion into the \texttt{auditlogs} collection. The log captures the user ID, entity ID, action type, IP address, prior state, updated state, and timestamp. Concurrently, the notification engine constructs and dispatches automated SMTP emails alerting suppliers when purchase orders are approved and dispatched.

\section{CLASS DIAGRAM}
The static structural composition of the system is modeled through the Unified Modeling Language (UML) class diagram depicted in Figure~\ref{fig:class_diagram}. The diagram illustrates the primary domain entities, their encapsulated data attributes, member methods, and object-oriented relationships.

\begin{figure}[H]
    \centering
    \includegraphics[width=0.95\textwidth]{figures/figure_4_2_class_diagram.png}
    \caption{UML Class Diagram of VendorFlow Entities and Relationships}
    \label{fig:class_diagram}
\end{figure}

The entity model is characterized by the following design attributes and relationships:
\begin{itemize}[leftmargin=1.5em]
    \item \textbf{User Class:} Represents all human actors interacting with the portal. Encapsulates profile attributes (\texttt{name}, \texttt{email}, \texttt{passwordHash}, \texttt{role}) and cryptographic routines (\texttt{hashPassword()}, \texttt{verifyPassword()}, \texttt{generateAuthToken()}).
    \item \textbf{Vendor Class:} Models the supplier organization, maintaining statutory business attributes (\texttt{gstin}, \texttt{pan}, \texttt{status}, \texttt{tierRating}, \texttt{overallScore}). It maintains a one-to-many relationship with \texttt{PurchaseOrder} and \texttt{Evaluation}.
    \item \textbf{PurchaseOrder Class:} Serves as the central transactional entity. It references a \texttt{Buyer} (User) and a \texttt{Vendor}. It encapsulates financial aggregation methods (\texttt{calculateTotals()}) and lifecycle governance methods (\texttt{transitionState()}, \texttt{logHistory()}).
    \item \textbf{LineItem Class:} Demonstrates a strict \textit{composition} relationship with \texttt{PurchaseOrder}. A purchase order consists of one or more line items; line items cannot exist independently outside the context of their parent purchase order.
    \item \textbf{Evaluation Class:} Models supplier performance records, linking a specific \texttt{Vendor} and \texttt{Buyer} with multi-pillar criteria scores and the derived composite rating.
    \item \textbf{AuditLog Class:} Implements an append-only record linking actor identities, affected document references, state diffs, and execution timestamps.
\end{itemize}

\section{SEQUENCE DIAGRAM}
The dynamic behavioral interaction of the system is captured in the UML sequence diagram shown in Figure~\ref{fig:sequence_diagram}. The diagram delineates the chronological message exchange between actors, interface components, security filters, controller services, and the persistence store during the purchase order lifecycle.

\begin{figure}[H]
    \centering
    \includegraphics[width=0.96\textwidth]{figures/figure_4_3_sequence_diagram.png}
    \caption{UML Sequence Diagram for Purchase Order Creation and Lifecycle Transition}
    \label{fig:sequence_diagram}
\end{figure}

The chronological execution sequence proceeds as follows:
\begin{enumerate}[leftmargin=1.5em]
    \item \textbf{Authentication and Dispatch:} The Buyer crafts a new purchase order through the React single-page interface and submits the line item payload. The request is dispatched via an HTTP POST request carrying the bearer JWT token in the \texttt{Authorization} header.
    \item \textbf{Security and RBAC Verification:} The \texttt{authMiddleware} intercepts the incoming request, cryptographically validates the token signature using the secret key, and verifies that the client holds the \texttt{Buyer} or \texttt{Admin} role.
    \item \textbf{Financial Calculation and Persistence:} The \texttt{poController} iterates through the line items, computing item sub-totals, applying statutory 18\% GST, and deriving the gross total. The controller invokes the MongoDB driver to persist the document in the initial \texttt{Draft} state.
    \item \textbf{Approval Workflow and State Transition:} Upon submission for approval, the FSM validation guard ensures that the current state is \texttt{Draft}. Upon administrative endorsement, the status transitions to \texttt{Approved}, and an immutable entry is appended to the audit ledger.
    \item \textbf{Vendor Dispatch and Acknowledgment:} The Buyer triggers order dispatch. The server updates status to \texttt{Sent} and invokes the Nodemailer SMTP service to transmit order details to the vendor's email address.
    \item \textbf{Fulfillment and Completion:} The Vendor reviews the order via their dedicated portal, updates fulfillment milestones (\textit{Acknowledged $\rightarrow$ Delivered}), submits invoicing data, and completes the transaction under supervisory buyer sign-off.
\end{enumerate}

\clearpage

\section{SUMMARY}
Chapter 4 established the complete architectural and structural design of the VendorFlow platform. The system uses a modern four-tier client-server architecture decoupling client presentation, security filtering, business controller services, and MongoDB document persistence. 

The five core functional modules ensure clear separation of concerns across authentication, vendor onboarding, FSM order lifecycles, quantitative evaluation, and audit logging. The static relationships and dynamic operational flows were formalized through UML Class and Sequence diagrams, establishing a solid engineering foundation for system implementation.

\clearpage

% -------------------------------------------------------------
% 13. CHAPTER 5: SYSTEM IMPLEMENTATION (Pages 21-25)
% -------------------------------------------------------------
\chapter{SYSTEM IMPLEMENTATION}

\section{IMPLEMENTATION ENVIRONMENT}
The implementation of VendorFlow is realized as a full-stack, cloud-native enterprise application built on the MERN stack. The server execution environment runs on Node.js (v20.x LTS) with Express.js managing asynchronous I/O and RESTful route delegation. The presentation layer is bundled using Vite and React 18, applying Tailwind CSS for utility-first responsive rendering. Data persistence is managed using MongoDB Atlas with Mongoose (v8.x) providing schema-level validations, compound indexing, and transactional middleware.

\section{CORE IMPLEMENTATION MODULES}
To ensure maintainability, security, and computational efficiency, the system abstracts core business rules into modular controllers and middleware. The subsections below outline the primary functional implementations that govern platform security, data modeling, transaction state transitions, and supplier scoring.

\subsection{Authentication and Role-Based Access Control (RBAC)}
System security is established via stateless JSON Web Token (JWT) verification combined with role-based guard middleware. Incoming requests carry the token in the \texttt{Authorization: Bearer} header. The authentication filter decodes the cryptographically signed payload, extracts user claims, and checks them against the endpoint's permitted roles (\textit{Admin}, \textit{Buyer}, \textit{Vendor}).

\begin{lstlisting}[language=Java, caption={JWT Authentication and Role-Based Guard Middleware}]
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token missing' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = decodedUser; // { id, email, role }
    next();
  });
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: Unauthorized role' });
    }
    next();
  };
};
\end{lstlisting}

\subsection{Purchase Order Data Model and Tax Engine}
The purchase order entity enforces referential integrity through Mongoose schema references, encapsulating embedded line items with real-time tax calculation. Statutory 18\% GST is computed directly from item subtotals, guaranteeing consistent financial records across the lifecycle.

\begin{lstlisting}[language=Java, caption={Purchase Order Mongoose Schema with Embedded Line Items and Tax Model}]
const mongoose = require('mongoose');

const LineItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity:    { type: Number, required: true, min: 1 },
  unitPrice:   { type: Number, required: true, min: 0 },
  gstRate:     { type: Number, default: 0.18 }
});

const POSchema = new mongoose.Schema({
  poNumber:     { type: String, required: true, unique: true },
  vendorId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  buyerId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['Draft', 'Pending Approval', 'Approved', 'Sent',
           'Acknowledged', 'Delivered', 'Invoiced', 'Closed'],
    default: 'Draft'
  },
  items:        [LineItemSchema],
  subtotal:     { type: Number, required: true },
  taxAmount:    { type: Number, required: true },
  grandTotal:   { type: Number, required: true },
  createdAt:    { type: Date, default: Date.now }
});
\end{lstlisting}

\subsection{Deterministic State Machine (FSM) Engine}
To prevent unauthorized out-of-sequence order processing, state transitions are governed by a deterministic Finite State Machine transition lookup table. State transitions that do not match the predefined transition graph are rejected before any database updates occur.

\begin{lstlisting}[language=Java, caption={Deterministic FSM State Transition Validator and Audit Logger}]
const VALID_TRANSITIONS = {
  'Draft':            ['Pending Approval'],
  'Pending Approval': ['Approved', 'Draft'],
  'Approved':         ['Sent'],
  'Sent':             ['Acknowledged'],
  'Acknowledged':     ['Delivered'],
  'Delivered':        ['Invoiced'],
  'Invoiced':         ['Closed'],
  'Closed':           []
};

const transitionOrderStatus = async (orderId, targetStatus, userId) => {
  const order = await PurchaseOrder.findById(orderId);
  const permitted = VALID_TRANSITIONS[order.status] || [];

  if (!permitted.includes(targetStatus)) {
    throw new Error(`Illegal state transition: ${order.status} -> ${targetStatus}`);
  }

  const previousStatus = order.status;
  order.status = targetStatus;
  await order.save();

  // Record immutable audit entry
  await AuditLog.create({
    entityId: orderId,
    entityType: 'PurchaseOrder',
    userId,
    action: 'STATUS_TRANSITION',
    fromState: previousStatus,
    toState: targetStatus,
    timestamp: new Date()
  });
  return order;
};
\end{lstlisting}

\subsection{Supplier Scorecard and Performance Tiering Algorithm}
The supplier evaluation module executes a weighted linear scoring model based on four core operational pillars: Quality ($W_1 = 35\%$), Delivery ($W_2 = 30\%$), Pricing ($W_3 = 20\%$), and Compliance ($W_4 = 15\%$). The algorithm categorizes vendors into distinct operational tiers based on the resulting aggregate score:

\begin{lstlisting}[language=Java, caption={Algorithmic Supplier Performance Tier Assignment}]
function evaluateSupplier(metrics) {
  const weights = { quality: 0.35, delivery: 0.30, pricing: 0.20, compliance: 0.15 };

  const aggregateScore =
    (metrics.qualityScore    * weights.quality)  +
    (metrics.deliveryScore   * weights.delivery) +
    (metrics.pricingScore    * weights.pricing)  +
    (metrics.complianceScore * weights.compliance);

  let tier = 'Blacklisted';
  if (aggregateScore >= 85)      tier = 'Preferred';
  else if (aggregateScore >= 70) tier = 'Approved';
  else if (aggregateScore >= 50) tier = 'On-Watch';

  return { aggregateScore: Math.round(aggregateScore * 10) / 10, tier };
}
\end{lstlisting}

\section{FRONTEND USER INTERFACE REALIZATION}
The client-side single-page application is designed to give buyers and suppliers real-time feedback without page reloads. The primary interface components include:
\begin{enumerate}[leftmargin=1.5em]
    \item \textbf{Dynamic Purchase Order Builder:} Renders dynamic itemization rows where line quantities and prices recalculate subtotal, 18\% GST, and overall expenditure in real time before submission.
    \item \textbf{Vendor Lifecycle Dashboard:} Visualizes onboarding status, statutory compliance indicators (GSTIN verification badge), and historical orders with real-time status indicators.
    \item \textbf{Supplier Scorecard Visualizer:} Presents multi-criteria radar/bar metrics comparing supplier performance against organization-wide benchmarks.
\end{enumerate}

\clearpage

\section{SUMMARY}
Chapter 5 presented the essential implementation components of the VendorFlow system. By implementing stateless JWT authentication, deterministic FSM state guards, automated 18\% GST calculations, and algorithmic supplier tiering, the platform realizes the design specifications established in Chapter 4 with high maintainability, precision, and security. 

The modular architecture cleanly partitions controller logic, Mongoose schemas, and interactive single-page React interfaces. The subsequent chapter concludes the project report with an evaluation of contributions, limitations, and future scope.

\clearpage

% -------------------------------------------------------------
% 14. CHAPTER 6: CONCLUSION AND FUTURE ENHANCEMENTS (Pages 26-27)
% -------------------------------------------------------------
\chapter{CONCLUSION AND FUTURE ENHANCEMENTS}

\section{CONCLUSION}
Procurement in many growing organizations still relies heavily on fragmented spreadsheets, unorganized email exchanges, and manual paperwork. This lack of structure regularly leads to misplaced orders, delayed vendor deliveries, untracked price changes, and difficulty in verifying statutory tax compliance. The primary objective of this project was to design and build \textbf{VendorFlow}, a centralized, web-based procurement and supplier lifecycle management platform that addresses these operational bottlenecks directly.

By developing the application using the MERN stack (MongoDB, Express.js, React, and Node.js), the platform establishes a structured and auditable environment for both procurement officers and external suppliers. The core of the system enforces a strict finite state machine for purchase orders, ensuring that every order progresses logically from initial draft creation to approval, vendor acknowledgment, delivery, invoicing, and final closure. This deterministic progression eliminates unauthorized status jumps and provides an unalterable audit trail for every change made. Furthermore, automating statutory 18\% Goods and Services Tax (GST) calculations inside line items removes manual arithmetic errors, while the objective four-pillar supplier evaluation engine gives procurement teams clear, quantifiable data to assess vendor reliability instead of relying on subjective impressions.

Overall, the project demonstrates that small-to-medium enterprises can achieve high transparency, process compliance, and operational efficiency without having to invest in bloated, prohibitively expensive enterprise ERP suites.

\section{CONTRIBUTIONS OF THE PROJECT}
The key practical contributions accomplished through this project include:
\begin{enumerate}[leftmargin=1.5em]
    \item \textbf{Controlled Purchase Order Lifecycle:} Implemented an 8-stage finite state machine that guarantees purchase orders can only transition through authorized operational phases, preventing out-of-order execution and unapproved modifications.
    \item \textbf{Role-Based Security and Isolation:} Configured stateless JSON Web Token (JWT) authentication paired with server-side role validation, granting distinct, protected views and actions for Administrators, Procurement Officers (Buyers), and Vendors.
    \item \textbf{Automated Financial and Tax Calculations:} Developed an interactive purchase order builder in React that recalculates unit line totals, applies statutory 18\% GST, and updates gross expenditure figures in real time as items are adjusted.
    \item \textbf{Objective Supplier Evaluation:} Formulated a weighted scoring algorithm evaluating suppliers across Quality (35\%), Delivery Timeliness (30\%), Pricing (20\%), and Compliance (15\%), automatically categorizing them into actionable performance tiers (\textit{Preferred, Approved, On-Watch, Blacklisted}).
    \item \textbf{Complete Audit Logging:} Engineered an immutable logging mechanism that records who initiated each change, what the prior and updated values were, and the exact timestamp of execution.
\end{enumerate}

\section{LIMITATIONS}
While the platform meets its core functional objectives, a few practical limitations remain:
\begin{itemize}[leftmargin=1.5em]
    \item \textbf{Standalone Operation:} The application currently functions independently and is not yet integrated with external enterprise ERP systems (such as SAP or Tally) or external banking payment gateways for automated fund transfers.
    \item \textbf{Document Digitization:} Physical invoices and delivery challans currently require manual verification rather than being parsed automatically through optical character recognition (OCR).
    \item \textbf{Email-Only Alerts:} Workflow notifications currently rely on SMTP email delivery, with no real-time push notifications or SMS alerts implemented for mobile users.
\end{itemize}

\section{FUTURE ENHANCEMENTS}
To build upon the foundation established in this project, future development will focus on the following enhancements:
\begin{enumerate}[leftmargin=1.5em]
    \item \textbf{Automated OCR Invoice Matching:} Introducing optical character recognition (using Tesseract or cloud-based document AI) to automatically scan supplier-uploaded invoice PDFs and reconcile line items, quantities, and totals directly against the corresponding purchase order (Three-Way Matching).
    \item \textbf{Real-Time WebSocket Updates:} Replacing intermittent polling with bidirectional WebSocket connections (via Socket.io) to instantly alert buyers and vendors of order status changes, approvals, and messages without requiring manual page refreshes.
    \item \textbf{Payment Gateway and Accounting API Integration:} Integrating corporate banking APIs or accounting software interfaces to allow automated payments once goods receipt notes (GRN) and invoices are fully validated.
    \item \textbf{Predictive Spend and Demand Analytics:} Incorporating lightweight time-series forecasting models to analyze historical order trends, helping procurement teams anticipate material reorder points and negotiate better bulk contract terms with preferred suppliers.
\end{enumerate}

\clearpage

% -------------------------------------------------------------
% 15. APPENDIX: SAMPLE CODE IMPLEMENTATION (Pages 28-30)
% -------------------------------------------------------------
\chapter*{APPENDIX}
\addcontentsline{toc}{chapter}{APPENDIX: SAMPLE CODE IMPLEMENTATION}

\begin{center}
    {\large \textbf{SAMPLE CODE IMPLEMENTATION}}
\end{center}

\vspace{0.4cm}
\noindent The following Node.js, Express, and JavaScript source code snippets demonstrate the foundational backend implementation for the VendorFlow procurement platform. These modules govern the finite state machine transition validator, the weighted supplier scorecard evaluation engine, and the automated email notification pipeline.

\vspace{0.35cm}
\noindent \textbf{A.1.1 \hspace{0.2cm} FSM STATE MACHINE CONTROLLER}\\[0.1cm]
\texttt{\normalsize (purchaseOrderController.js)}

\begin{lstlisting}[language=Java, caption={FSM Purchase Order State Transition Controller}]
const PurchaseOrder = require('../models/PurchaseOrder');
const AuditLog = require('../models/AuditLog');

// Strict transition graph for the 8-stage lifecycle
const VALID_TRANSITIONS = {
  'Draft':            ['Pending Approval'],
  'Pending Approval': ['Approved', 'Draft'],
  'Approved':         ['Sent'],
  'Sent':             ['Acknowledged'],
  'Acknowledged':     ['Delivered'],
  'Delivered':        ['Invoiced'],
  'Invoiced':         ['Closed'],
  'Closed':           []
};

exports.updatePOStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status: targetStatus, comment } = req.body;
    const userId = req.user.id;

    const po = await PurchaseOrder.findById(id);
    if (!po) {
      return res.status(404).json({ message: 'Purchase order not found' });
    }

    const permittedNextStates = VALID_TRANSITIONS[po.status] || [];
    if (!permittedNextStates.includes(targetStatus)) {
      return res.status(400).json({
        message: `Illegal transition from '${po.status}' to '${targetStatus}'`
      });
    }

    const previousStatus = po.status;
    po.status = targetStatus;
    po.history.push({
      status: targetStatus,
      updatedBy: userId,
      comment: comment || `Status updated to ${targetStatus}`,
      timestamp: new Date()
    });

    await po.save();

    // Persist immutable audit log entry
    await AuditLog.create({
      entityId: po._id,
      entityType: 'PurchaseOrder',
      action: 'STATUS_TRANSITION',
      performedBy: userId,
      details: { from: previousStatus, to: targetStatus, comment }
    });

    return res.status(200).json({ success: true, order: po });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
\end{lstlisting}

\clearpage

\noindent \textbf{A.1.2 \hspace{0.2cm} SUPPLIER EVALUATION ENGINE}\\[0.1cm]
\texttt{\normalsize (evaluationController.js)}

\begin{lstlisting}[language=Java, basicstyle=\ttfamily\scriptsize, caption={Weighted Multi-Criteria Supplier Evaluation Controller}]
const Evaluation = require('../models/Evaluation');
const Vendor = require('../models/Vendor');

// Computes 4-pillar weighted evaluation and sets vendor tier
exports.createEvaluation = async (req, res) => {
  try {
    const { vendorId, quality, delivery, pricing, compliance, period } = req.body;

    // Weights: Quality=35%, Delivery=30%, Pricing=20%, Compliance=15%
    const compositeScore = Number(
      (quality * 0.35 + delivery * 0.30 + pricing * 0.20 + compliance * 0.15).toFixed(2)
    );

    let tier = 'Blacklisted';
    if (compositeScore >= 85)      tier = 'Preferred';
    else if (compositeScore >= 70) tier = 'Approved';
    else if (compositeScore >= 50) tier = 'On-Watch';

    const record = await Evaluation.create({
      vendorId,
      evaluationPeriod: period,
      qualityScore: quality,
      deliveryScore: delivery,
      pricingScore: pricing,
      complianceScore: compliance,
      compositeScore,
      tierAssigned: tier,
      evaluatedBy: req.user.id
    });

    // Update vendor aggregate score and tier
    await Vendor.findByIdAndUpdate(vendorId, {
      overallScore: compositeScore,
      tierRating: tier
    });

    return res.status(201).json({ success: true, evaluation: record });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
\end{lstlisting}

\clearpage

\noindent \textbf{A.1.3 \hspace{0.2cm} AUTOMATED NOTIFICATION SERVICE}\\[0.1cm]
\texttt{\normalsize (notificationService.js)}

\begin{lstlisting}[language=Java, caption={Automated SMTP Purchase Order Dispatch Notification Service}]
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

exports.sendPODispatchAlert = async (vendorEmail, poNumber, grandTotal) => {
  const mailOptions = {
    from: `"VendorFlow Procurement" <${process.env.SMTP_USER}>`,
    to: vendorEmail,
    subject: `New Purchase Order Issued: ${poNumber}`,
    text: `Hello,\n\nPurchase order (${poNumber}) for INR ${grandTotal} ` +
          `has been issued to your account.\n\nPlease log in to ` +
          `acknowledge receipt.\n\nRegards,\nVendorFlow Team`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[SMTP Alert] Dispatched to ${vendorEmail}: ${info.messageId}`);
    return true;
  } catch (err) {
    console.error(`[SMTP Error] Delivery failed to ${vendorEmail}: ${err.message}`);
    return false;
  }
};
\end{lstlisting}

\clearpage

% -------------------------------------------------------------
% 16. SCREENSHOTS OF THE PROJECT (Pages 31-32, Before References)
% Exactly 2 Images Per Page (Atomic Figure Environment, Never Separated)
% -------------------------------------------------------------
\chapter*{SCREENSHOTS OF THE PROJECT}
\addcontentsline{toc}{chapter}{SCREENSHOTS OF THE PROJECT}

\begin{figure}[H]
    \centering
    \includegraphics[width=0.82\textwidth,height=0.33\textheight,keepaspectratio]{figures/login_page.png}
    \caption{Login and Authentication Interface}
    \label{fig:login_page}
    
    \vspace{0.6cm}
    
    \includegraphics[width=0.82\textwidth,height=0.33\textheight,keepaspectratio]{figures/kyc_approval.png}
    \caption{Vendor KYC Verification and Approval Dashboard}
    \label{fig:kyc_approval}
\end{figure}

\clearpage

\begin{figure}[H]
    \centering
    \includegraphics[width=0.82\textwidth,height=0.33\textheight,keepaspectratio]{figures/po_calculator.png}
    \caption{Purchase Order Itemization and Statutory Tax Calculator}
    \label{fig:po_calculator}
    
    \vspace{0.6cm}
    
    \includegraphics[width=0.82\textwidth,height=0.33\textheight,keepaspectratio]{figures/supplier_scorecard.png}
    \caption{Automated Multi-Pillar Supplier Performance Scorecard}
    \label{fig:supplier_scorecard}
\end{figure}

\clearpage

% -------------------------------------------------------------
% 17. REFERENCES (Page 33, Named REFERENCES, Not Bibliography)
% -------------------------------------------------------------
\begin{thebibliography}{99}
\addcontentsline{toc}{chapter}{REFERENCES}

\bibitem{chopra2016}
Chopra, S., and Meindl, P. (2016). \textit{Supply Chain Management: Strategy, Planning, and Operation}, 6th ed., Pearson Education, Boston.

\bibitem{monczka2020}
Monczka, R. M., Handfield, R. B., Giunipero, L. C., and Patterson, J. L. (2020). \textit{Purchasing and Supply Chain Management}, 7th ed., Cengage Learning, Boston.

\bibitem{fowler2002}
Fowler, M. (2002). \textit{Patterns of Enterprise Application Architecture}, Addison-Wesley Professional, Boston.

\bibitem{vanweele2018}
Van Weele, A. J. (2018). \textit{Purchasing and Supply Chain Management: Analysis, Strategy, Planning and Practice}, 7th ed., Cengage Learning EMEA, Hampshire.

\bibitem{gstn2023}
Goods and Services Tax Network (GSTN), Government of India. (2023). \textit{Standard Operating Procedure for GST Invoicing and Input Tax Credit Verification}, Ministry of Finance, New Delhi.

\bibitem{cbic2024}
Central Board of Indirect Taxes and Customs (CBIC). (2024). \textit{Statutory Compliance Guidelines for Procurement and Invoicing}, Department of Revenue, Government of India.

\bibitem{chodorow2013}
Chodorow, K. (2013). \textit{MongoDB: The Definitive Guide: Powerful and Scalable Data Storage}, 2nd ed., O'Reilly Media, Sebastopol.

\bibitem{banks2020}
Banks, A., and Porcello, E. (2020). \textit{Learning React: Modern Patterns for Developing React Applications}, 2nd ed., O'Reilly Media, Sebastopol.

\bibitem{kumar2023}
Kumar, S., and Sharma, V. (2023). ``Automated Supplier Evaluation Frameworks using Multi-Criteria Decision Analysis,'' \textit{International Journal of Production Economics}, vol. 255, pp. 108--120.

\bibitem{bankhead2022}
Bankhead, C., et al. (2022). ``Deterministic Workflow Systems in Cloud-Native Enterprise Architectures,'' \textit{IEEE Transactions on Software Engineering}, vol. 48, no. 6, pp. 2104--2118.

\end{thebibliography}

\end{document}
"""

with open(tex_file, "w", encoding="utf-8") as f:
    f.write(content.strip())

with open(report_tex, "w", encoding="utf-8") as f:
    f.write(content.strip())

print("Written main.tex and VendorFlow_Project_Report.tex successfully!")

# Build Overleaf Project ZIP
fig_dir = os.path.join(out_dir, "figures")
with zipfile.ZipFile(zip_file, "w", zipfile.ZIP_DEFLATED) as zf:
    zf.write(tex_file, "main.tex")
    for fname in os.listdir(fig_dir):
        fpath = os.path.join(fig_dir, fname)
        if os.path.isfile(fpath):
            zf.write(fpath, os.path.join("figures", fname))

print("Built VendorFlow_Overleaf_Project.zip successfully, size:", os.path.getsize(zip_file), "bytes")
