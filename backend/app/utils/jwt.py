from jose import jwt
from datetime import datetime,timedelta
from dotenv import load_dotenv
import os


load_dotenv(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY environment variable is not set")

def access_token(data:dict):
    dataencode=data.copy()
    expire=datetime.utcnow() + timedelta(hours=2)
    dataencode.update({"exp" : expire,"type":"access"})
    return jwt.encode(dataencode, SECRET_KEY, algorithm="HS256")


def refresh_token(data:dict):
    dataencode=data.copy()
    expire=datetime.utcnow()+timedelta(days=7)

    dataencode.update({"exp":expire,"type":"refresh"})
    return jwt.encode(dataencode, SECRET_KEY, algorithm="HS256")
