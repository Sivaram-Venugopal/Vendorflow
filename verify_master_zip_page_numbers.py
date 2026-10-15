import zipfile
import pymupdf

z = zipfile.ZipFile(r"C:\Users\LAKSHMI\FSD\All_Students_Updated_Project_Reports.zip")
print("=== VERIFYING ALL PDF PAGE NUMBERS INSIDE MASTER ZIP ===")
for f in sorted(z.namelist()):
    if f.endswith(".pdf") and "REFERENCE" not in f:
        data = z.read(f)
        doc = pymupdf.open(stream=data, filetype="pdf")
        sample_indices = [0, 1, 8, 9, len(doc)-1]
        nums = []
        for idx in sample_indices:
            p = doc[idx]
            w = [word[4] for word in p.get_text("words") if word[1] > p.rect.height - 60]
            nums.append(f"P{idx+1}:{w}")
        print(f"{f:<55} ({len(doc):>2}p) -> {' | '.join(nums)}")
