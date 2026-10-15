import os
import pymupdf
from stamper import stamp_pdf_with_page_numbers

target_reports = [
    ("Balaji", r"C:\Users\LAKSHMI\FSD\Balaji\SwachhtaCompliance_Project_Report.pdf"),
    ("Sudharshan", r"C:\Users\LAKSHMI\FSD\Sudharshan\Semimatrix_Project_Report.pdf"),
    ("Tamil", r"C:\Users\LAKSHMI\FSD\Tamil\StemTrack_Project_Report.pdf"),
    ("Vishwa", r"C:\Users\LAKSHMI\FSD\Vishwa\VesselFleet_Project_Report.pdf"),
    ("Shweta", r"C:\Users\LAKSHMI\FSD\Shweta\SecondLook_Project_Report.pdf"),
    ("Eashwar", r"C:\Users\LAKSHMI\FSD\Eashwar\SmartMaint_Project_Report.pdf"),
    ("Yuva", r"C:\Users\LAKSHMI\FSD\Yuva\INVOXA_Project_Report.pdf"),
    ("Sivaram", r"C:\Users\LAKSHMI\FSD\VendorFlow_Project_Report.pdf")
]

for name, path in target_reports:
    if not os.path.exists(path):
        print(f"Skipping {name}: file does not exist ({path})")
        continue
    print(f"\nProcessing {name}...")
    stamp_pdf_with_page_numbers(path, chap1_page_1based=10)
    
    # Verification
    doc = pymupdf.open(path)
    sample_indices = [0, 1, 2, 8, 9, 10, len(doc)-1]
    res = []
    for idx in sample_indices:
        p = doc[idx]
        w = [word[4] for word in p.get_text("words") if word[1] > p.rect.height - 60]
        res.append(f"P{idx+1}:{w}")
    print(f"Verified {name} ({len(doc)} pages): {' | '.join(res)}")
