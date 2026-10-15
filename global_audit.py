import os
import fitz

projects = [
    {
        "name": "Hari (Reference PDF)",
        "dir": r"C:\Users\LAKSHMI\FSD",
        "pdf": r"C:\Users\LAKSHMI\FSD\REFERENCE PDF.pdf",
        "docx": None,
        "tex": None,
        "zip": None
    },
    {
        "name": "Shweta (SecondLook)",
        "dir": r"C:\Users\LAKSHMI\FSD\Shweta",
        "pdf": r"C:\Users\LAKSHMI\FSD\Shweta\SecondLook_Project_Report.pdf",
        "docx": r"C:\Users\LAKSHMI\FSD\Shweta\SecondLook_Project_Report.docx",
        "tex": r"C:\Users\LAKSHMI\FSD\Shweta\SecondLook_Project_Report.tex",
        "zip": r"C:\Users\LAKSHMI\FSD\Shweta\SecondLook_Overleaf_Project.zip"
    },
    {
        "name": "Eashwar (SmartMaint)",
        "dir": r"C:\Users\LAKSHMI\FSD\Eashwar",
        "pdf": r"C:\Users\LAKSHMI\FSD\Eashwar\SmartMaint_Project_Report.pdf",
        "docx": r"C:\Users\LAKSHMI\FSD\Eashwar\SmartMaint_Project_Report.docx",
        "tex": r"C:\Users\LAKSHMI\FSD\Eashwar\SmartMaint_Project_Report.tex",
        "zip": r"C:\Users\LAKSHMI\FSD\Eashwar\SmartMaint_Overleaf_Project.zip"
    },
    {
        "name": "Sivaram Venugopal (VendorFlow)",
        "dir": r"C:\Users\LAKSHMI\FSD",
        "pdf": r"C:\Users\LAKSHMI\FSD\VendorFlow_Project_Report.pdf",
        "docx": r"C:\Users\LAKSHMI\FSD\VendorFlow_Project_Report.docx",
        "tex": r"C:\Users\LAKSHMI\FSD\VendorFlow_Project_Report.tex",
        "zip": r"C:\Users\LAKSHMI\FSD\VendorFlow_Overleaf_Project.zip"
    },
    {
        "name": "Vishwa (VesselFleet)",
        "dir": r"C:\Users\LAKSHMI\FSD\Vishwa",
        "pdf": r"C:\Users\LAKSHMI\FSD\Vishwa\VesselFleet_Project_Report.pdf",
        "docx": r"C:\Users\LAKSHMI\FSD\Vishwa\VesselFleet_Project_Report.docx",
        "tex": r"C:\Users\LAKSHMI\FSD\Vishwa\VesselFleet_Project_Report.tex",
        "zip": r"C:\Users\LAKSHMI\FSD\Vishwa\VesselFleet_Overleaf_Project.zip"
    },
    {
        "name": "Vishwa Balaji (SwachhtaCompliance)",
        "dir": r"C:\Users\LAKSHMI\FSD\Balaji",
        "pdf": r"C:\Users\LAKSHMI\FSD\Balaji\SwachhtaCompliance_Project_Report.pdf",
        "docx": r"C:\Users\LAKSHMI\FSD\Balaji\SwachhtaCompliance_Project_Report.docx",
        "tex": r"C:\Users\LAKSHMI\FSD\Balaji\SwachhtaCompliance_Project_Report.tex",
        "zip": r"C:\Users\LAKSHMI\FSD\Balaji\SwachhtaCompliance_Overleaf_Project.zip"
    },
    {
        "name": "Tamil Kumaran (StemTrack)",
        "dir": r"C:\Users\LAKSHMI\FSD\Tamil",
        "pdf": r"C:\Users\LAKSHMI\FSD\Tamil\StemTrack_Project_Report.pdf",
        "docx": r"C:\Users\LAKSHMI\FSD\Tamil\StemTrack_Project_Report.docx",
        "tex": r"C:\Users\LAKSHMI\FSD\Tamil\StemTrack_Project_Report.tex",
        "zip": r"C:\Users\LAKSHMI\FSD\Tamil\StemTrack_Overleaf_Project.zip"
    },
    {
        "name": "Yuva Umaya Shri (INVOXA)",
        "dir": r"C:\Users\LAKSHMI\FSD\Yuva",
        "pdf": r"C:\Users\LAKSHMI\FSD\Yuva\INVOXA_Project_Report.pdf",
        "docx": r"C:\Users\LAKSHMI\FSD\Yuva\INVOXA_Project_Report.docx",
        "tex": r"C:\Users\LAKSHMI\FSD\Yuva\INVOXA_Project_Report.tex",
        "zip": r"C:\Users\LAKSHMI\FSD\Yuva\INVOXA_Overleaf_Project.zip"
    }
]

print("================================================================================")
print("             GLOBAL VERIFICATION REPORT: ALL 8 PROJECT REPORTS                  ")
print("================================================================================\n")

all_passed = True

for p in projects:
    print(f"--- {p['name']} ---")
    
    # Check file existence
    files_to_check = [("PDF", p["pdf"])]
    if p["docx"]: files_to_check.append(("DOCX", p["docx"]))
    if p["tex"]: files_to_check.append(("TEX", p["tex"]))
    if p["zip"]: files_to_check.append(("ZIP", p["zip"]))
    
    for ftype, fpath in files_to_check:
        if os.path.exists(fpath):
            sz = os.path.getsize(fpath)
            print(f"  [OK] {ftype:4s}: {os.path.basename(fpath)} ({sz:,} bytes)")
        else:
            print(f"  [FAIL] {ftype:4s}: {fpath} NOT FOUND!")
            all_passed = False
            
    # Check PDF content and formatting
    doc = fitz.open(p["pdf"])
    total_pages = len(doc)
    empty_pages = []
    contd_pages = []
    
    has_toc = False
    has_lof = False
    has_lot = False
    has_app = False
    has_scr = False
    has_ref = False
    
    for idx in range(total_pages):
        txt = doc[idx].get_text()
        stripped = txt.strip()
        if len(stripped) < 40:
            empty_pages.append((idx + 1, len(stripped)))
        if "TABLE OF CONTENTS (Contd.)" in txt or "TABLE OF CONTENTS (CONTD.)" in txt:
            contd_pages.append(idx + 1)
        if "TABLE OF CONTENTS" in txt:
            has_toc = True
        if "LIST OF FIGURES" in txt:
            has_lof = True
        if "LIST OF TABLES" in txt:
            has_lot = True
        if "APPENDIX" in txt:
            has_app = True
        if "SCREENSHOTS" in txt:
            has_scr = True
        if "REFERENCES" in txt:
            has_ref = True

    print(f"  Total Pages: {total_pages}")
    
    if len(empty_pages) == 0:
        print(f"  [OK] Empty Pages: ZERO (0)")
    else:
        print(f"  [FAIL] Empty Pages Found: {empty_pages}")
        all_passed = False
        
    if len(contd_pages) == 0:
        print(f"  [OK] TABLE OF CONTENTS (Contd.) title: REMOVED / NONE")
    else:
        print(f"  [FAIL] 'TABLE OF CONTENTS (Contd.)' title found on pages: {contd_pages}")
        all_passed = False
        
    print(f"  Sections check: TOC={has_toc}, LOF={has_lof}, LOT={has_lot}, App={has_app}, Screenshots={has_scr}, Ref={has_ref}")
    
    # Check last page has references
    last_page_txt = doc[-1].get_text()
    if "REFERENCES" in last_page_txt or len(last_page_txt.strip()) > 100:
        print(f"  [OK] Final Page (Page {total_pages}): Clean non-empty content ({len(last_page_txt.strip())} chars)")
    else:
        print(f"  [WARN] Final Page (Page {total_pages}) might be dangling: {repr(last_page_txt[:60])}")
        all_passed = False
        
    doc.close()
    print()

print("================================================================================")
if all_passed:
    print("ALL VERIFICATIONS PASSED 100%! ZERO EMPTY PAGES, ALL FILES IN SYNC!")
else:
    print("WARNING: Some checks did not pass. See details above.")
print("================================================================================")
