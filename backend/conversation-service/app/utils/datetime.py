from datetime import datetime

def safe_serialize(obj):
    if isinstance(obj, dict):
        return {k: safe_serialize(v) for k, v in obj.items()}

    if isinstance(obj, list):
        return [safe_serialize(i) for i in obj]

    if isinstance(obj, datetime):
        return obj.isoformat()

    return obj