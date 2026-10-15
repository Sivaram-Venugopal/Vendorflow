import os
import zipfile
import shutil

zip_path = r"C:\Users\LAKSHMI\FSD\All_Students_Updated_Project_Reports.zip"
temp_zip = r"C:\Users\LAKSHMI\FSD\temp_master.zip"

tamil_dir = r"C:\Users\LAKSHMI\FSD\Tamil"
prasandh_dir = r"C:\Users\LAKSHMI\FSD\Prasandh"
sudharshan_dir = r"C:\Users\LAKSHMI\FSD\Sudharshan"

# Read existing entries except 6_Tamil_Kumaran, which we will replace with the fixed files
with zipfile.ZipFile(zip_path, 'r') as zin, zipfile.ZipFile(temp_zip, 'w', zipfile.ZIP_DEFLATED) as zout:
    for item in zin.infolist():
        if not item.filename.startswith('6_Tamil_Kumaran'):
            zout.writestr(item, zin.read(item.filename))
            
    # Add updated Tamil Kumaran files
    tamil_files = [
        ("StemTrack_Project_Report.pdf", os.path.join(tamil_dir, "StemTrack_Project_Report.pdf")),
        ("StemTrack_Project_Report.docx", os.path.join(tamil_dir, "StemTrack_Project_Report.docx")),
        ("StemTrack_Project_Report.tex", os.path.join(tamil_dir, "StemTrack_Project_Report.tex")),
        ("StemTrack_Overleaf_Project.zip", os.path.join(tamil_dir, "StemTrack_Overleaf_Project.zip")),
    ]
    for arcname, fpath in tamil_files:
        if os.path.exists(fpath):
            zout.write(fpath, f"6_Tamil_Kumaran/{arcname}")
            print(f"Added to zip: 6_Tamil_Kumaran/{arcname}")

    # Add Prasandh files
    prasandh_files = [
        ("InduPulse_Project_Report.tex", os.path.join(prasandh_dir, "InduPulse_Project_Report.tex")),
        ("main.tex", os.path.join(prasandh_dir, "main.tex")),
        ("InduPulse_Overleaf_Project.zip", os.path.join(prasandh_dir, "InduPulse_Overleaf_Project.zip")),
    ]
    for arcname, fpath in prasandh_files:
        if os.path.exists(fpath):
            zout.write(fpath, f"8_Shreeprasandh/{arcname}")
            print(f"Added to zip: 8_Shreeprasandh/{arcname}")

    # Add Sudharshan files
    sudharshan_files = [
        ("Semimatrix_Project_Report.tex", os.path.join(sudharshan_dir, "Semimatrix_Project_Report.tex")),
        ("main.tex", os.path.join(sudharshan_dir, "main.tex")),
        ("Semimatrix_Overleaf_Project.zip", os.path.join(sudharshan_dir, "Semimatrix_Overleaf_Project.zip")),
    ]
    for arcname, fpath in sudharshan_files:
        if os.path.exists(fpath):
            zout.write(fpath, f"9_Sudharshan/{arcname}")
            print(f"Added to zip: 9_Sudharshan/{arcname}")

# Replace original master zip
shutil.move(temp_zip, zip_path)
print(f"Successfully updated {zip_path}. New size: {os.path.getsize(zip_path):,} bytes")
