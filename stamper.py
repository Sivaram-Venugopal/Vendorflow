import os
import shutil
import ctypes
from ctypes import wintypes
import pymupdf

def unlock_file(filepath):
    if not os.path.exists(filepath):
        return
    rstrtmgr = ctypes.windll.rstrtmgr
    handle = wintypes.DWORD()
    key = (wintypes.WCHAR * 33)()
    if rstrtmgr.RmStartSession(ctypes.byref(handle), 0, key) != 0:
        return
    try:
        files = (wintypes.LPCWSTR * 1)(filepath)
        if rstrtmgr.RmRegisterResources(handle, 1, files, 0, None, 0, None) != 0:
            return
        needed = wintypes.UINT()
        proc_info = wintypes.UINT(10)
        class RM_UNIQUE_PROCESS(ctypes.Structure):
            _fields_ = [('dwProcessId', wintypes.DWORD), ('ProcessStartTime', wintypes.FILETIME)]
        class RM_PROCESS_INFO(ctypes.Structure):
            _fields_ = [('Process', RM_UNIQUE_PROCESS), ('strAppName', wintypes.WCHAR * 256), ('strServiceShortName', wintypes.WCHAR * 64), ('ApplicationType', wintypes.UINT), ('AppStatus', wintypes.UINT), ('TSSessionId', wintypes.DWORD), ('bRestartable', wintypes.BOOL)]
        apps = (RM_PROCESS_INFO * 10)()
        reboot = wintypes.DWORD()
        res = rstrtmgr.RmGetList(handle, ctypes.byref(needed), ctypes.byref(proc_info), apps, ctypes.byref(reboot))
        if res == 0:
            for i in range(proc_info.value):
                pid = apps[i].Process.dwProcessId
                os.system(f'taskkill /F /PID {pid} >nul 2>&1')
    finally:
        rstrtmgr.RmEndSession(handle)

def stamp_pdf_with_page_numbers(input_pdf, output_pdf=None, chap1_page_1based=10):
    if output_pdf is None:
        output_pdf = input_pdf
        
    temp_path = output_pdf + ".tmp.pdf"
    doc = pymupdf.open(input_pdf)
    
    roman_map = {
        1: "i", 2: "ii", 3: "iii", 4: "iv", 5: "v",
        6: "vi", 7: "vii", 8: "viii", 9: "ix", 10: "x",
        11: "xi", 12: "xii", 13: "xiii", 14: "xiv", 15: "xv"
    }
    
    chap1_idx = chap1_page_1based - 1
    
    for idx in range(len(doc)):
        page = doc[idx]
        rect = page.rect
        width = rect.width
        height = rect.height
        
        # Redact existing footer zone to ensure clean slate
        page.add_redact_annot(pymupdf.Rect(0, height - 55, width, height), fill=(1, 1, 1))
        page.apply_redactions()
        
        if idx == 0:
            # Title page: NO page number
            continue
            
        if idx < chap1_idx:
            num_val = idx
            page_str = roman_map.get(num_val, str(num_val))
        else:
            num_val = (idx - chap1_idx) + 1
            page_str = str(num_val)
            
        font_size = 11.0
        tw = pymupdf.get_text_length(page_str, fontname="times-roman", fontsize=font_size)
        x = (width - tw) / 2.0
        y = height - 38.0
        
        page.insert_text(
            (x, y),
            page_str,
            fontname="times-roman",
            fontsize=font_size,
            color=(0, 0, 0)
        )
        
    page_count = len(doc)
    doc.save(temp_path)
    doc.close()
    
    unlock_file(output_pdf)
    if os.path.exists(output_pdf):
        os.remove(output_pdf)
    shutil.move(temp_path, output_pdf)
    print(f"SUCCESS: Cleanly stamped {page_count} pages in {output_pdf}")
