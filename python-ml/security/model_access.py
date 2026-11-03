import os
import hashlib

def compute_model_hash(model_path):
    if not os.path.exists(model_path):
        return None
    hasher = hashlib.sha256()
    with open(model_path, 'rb') as f:
        while chunk := f.read(65536):
            hasher.update(chunk)
    return hasher.hexdigest()

def verify_model_integrity(model_path, expected_hash=None):
    current_hash = compute_model_hash(model_path)
    if not current_hash:
        return False, "Model file missing."
    if expected_hash and current_hash != expected_hash:
        return False, "Model integrity mismatch: SHA-256 differs from expected manifest."
    return True, current_hash
