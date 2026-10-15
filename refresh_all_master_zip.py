import os
import zipfile
import shutil

zip_path = r"C:\Users\LAKSHMI\FSD\All_Students_Updated_Project_Reports.zip"
temp_zip = r"C:\Users\LAKSHMI\FSD\temp_master_refresh.zip"

base_dir = r"C:\Users\LAKSHMI\FSD"

updates = {
    "1_Shweta": {
        "dir": os.path.join(base_dir, "Shweta"),
        "files": ["SecondLook_Project_Report.pdf", "SecondLook_Project_Report.docx", "SecondLook_Project_Report.tex", "SecondLook_Overleaf_Project.zip"]
    },
    "2_Eashwar": {
        "dir": os.path.join(base_dir, "Eashwar"),
        "files": ["SmartMaint_Project_Report.pdf", "SmartMaint_Project_Report.docx", "SmartMaint_Project_Report.tex", "SmartMaint_Overleaf_Project.zip"]
    },
    "3_Sivaram_Venugopal": {
        "dir": base_dir,
        "files": ["VendorFlow_Project_Report.pdf", "VendorFlow_Project_Report.docx", "VendorFlow_Project_Report.tex", "VendorFlow_Overleaf_Project.zip"]
    },
    "4_Vishwa": {
        "dir": os.path.join(base_dir, "Vishwa"),
        "files": ["VesselFleet_Project_Report.pdf", "VesselFleet_Project_Report.docx", "VesselFleet_Project_Report.tex", "VesselFleet_Overleaf_Project.zip"]
    },
    "5_Vishwa_Balaji": {
        "dir": os.path.join(base_dir, "Balaji"),
        "files": ["SwachhtaCompliance_Project_Report.pdf", "SwachhtaCompliance_Project_Report.docx", "SwachhtaCompliance_Project_Report.tex", "SwachhtaCompliance_Overleaf_Project.zip"]
    },
    "6_Tamil_Kumaran": {
        "dir": os.path.join(base_dir, "Tamil"),
        "files": ["StemTrack_Project_Report.pdf", "StemTrack_Project_Report.docx", "StemTrack_Project_Report.tex", "StemTrack_Overleaf_Project.zip"]
    },
    "7_Yuva_Umaya_Shri": {
        "dir": os.path.join(base_dir, "Yuva"),
        "files": ["INVOXA_Project_Report.pdf", "INVOXA_Project_Report.docx", "INVOXA_Project_Report.tex", "INVOXA_Overleaf_Project.zip"]
    },
    "8_Shreeprasandh": {
        "dir": os.path.join(base_dir, "Prasandh"),
        "files": ["InduPulse_Project_Report.tex", "main.tex", "InduPulse_Overleaf_Project.zip"]
    },
    "9_Sudharshan": {
        "dir": os.path.join(base_dir, "Sudharshan"),
        "files": ["Semimatrix_Project_Report.pdf", "Semimatrix_Project_Report.docx", "Semimatrix_Project_Report.tex", "main.tex", "Semimatrix_Overleaf_Project.zip"]
    }
}

prefixes_to_replace = list(updates.keys())

with zipfile.ZipFile(zip_path, 'r') as zin, zipfile.ZipFile(temp_zip, 'w', zipfile.ZIP_DEFLATED) as zout:
    for item in zin.infolist():
        skip = False
        for prefix in prefixes_to_replace:
            if item.filename.startswith(prefix + "/"):
                skip = True
                break
        if not skip:
            zout.writestr(item, zin.read(item.filename))

    for prefix, data in updates.items():
        src_dir = data["dir"]
        for fname in data["files"]:
            fpath = os.path.join(src_dir, fname)
            if os.path.exists(fpath):
                arcname = f"{prefix}/{fname}"
                zout.write(fpath, arcname)
                print(f"Added {arcname} ({os.path.getsize(fpath):,} bytes)")
            else:
                print(f"WARNING: File {fpath} does not exist!")

shutil.move(temp_zip, zip_path)
print(f"Master zip updated successfully: {zip_path} ({os.path.getsize(zip_path):,} bytes)")
