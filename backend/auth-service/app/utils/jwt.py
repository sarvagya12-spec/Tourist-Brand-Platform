from jose import jwt
from datetime import datetime,timedelta
from dotenv import load_dotenv
import os


<<<<<<< HEAD:backend/app/utils/jwt.py
load_dotenv(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".env"))

=======
load_dotenv("../.env")
>>>>>>> 082b6edb796e4cf84e3fd724f3d29146af874307:backend/auth-service/app/utils/jwt.py
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
