import os
import re

ALLOWED_EXTENSIONS = {'.csv', '.xlsx', '.xls', '.pdf', '.png', '.jpg', '.jpeg'}
MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024  # 15 MB

def validate_dataset_file(file_path):
    """
    Validates uploaded dataset files before ML processing or model training.
    Rejects oversized files, malicious macros, and directory traversal characters.
    """
    if not os.path.exists(file_path):
        return False, "File does not exist on disk."

    size = os.path.getsize(file_path)
    if size > MAX_FILE_SIZE_BYTES:
        return False, f"File size ({size / (1024*1024):.1f} MB) exceeds maximum permitted limit (15 MB)."

    ext = os.path.splitext(file_path)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        return False, f"Extension '{ext}' is not authorized. Permitted: {', '.join(ALLOWED_EXTENSIONS)}"

    # Check for Excel Macro (.xlsm / VBA binaries)
    if ext == '.xlsm':
        return False, "Macro-enabled workbooks (.xlsm) are blocked by ARTHIQ security policy."

    return True, "Valid dataset file."

def sanitize_csv_cells(value):
    """
    Neutralizes spreadsheet formula injection (CSV Injection / DDE).
    Strips leading =, +, -, @, or tab characters that spreadsheets execute as commands.
    """
    if not isinstance(value, str):
        return value
    s = value.strip()
    if s.startswith(('=', '+', '-', '@', '\t', '\r')):
        return "'" + s  # Prepend apostrophe to force plain text
    return value
