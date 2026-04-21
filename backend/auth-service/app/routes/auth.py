from fastapi import APIRouter, HTTPException
from app.schemas.user_schema import RegisterUser, LoginUser, RoleUpdate
from app.database import user_collection
from app.utils.hashing import hash_password, verify_password
from app.utils.jwt import access_token, SECRET_KEY ,refresh_token
from jose import jwt, JWTError
from fastapi import Depends
from app.utils.dependencies import get_current_user

router = APIRouter()

@router.post("/register")
async def register(user: RegisterUser):
    existing = await user_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_pw = hash_password(user.password)

    await user_collection.insert_one({
        "name": user.name,
        "email": user.email,
        "password": hashed_pw,
        "role": user.role,
    })

    return {"message": f"User registered successfully as a {user.role}"}



@router.post("/login")
async def login(user: LoginUser):
    db_user = await user_collection.find_one({"email": user.email})

    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Token now contains the confirmed role
    token = access_token({"user_id": str(db_user["_id"]),"email": user.email, "role": db_user["role"]})
    refresh = refresh_token({"user_id": str(db_user["_id"])})
    return {"message": "Login successful", "access_token": token, "refresh_token": refresh, "role": db_user["role"]}



@router.put("/select-role")
async def select_role(update: RoleUpdate, user=Depends(get_current_user)):
    email = user["email"]

    result = await user_collection.update_one(
        {"email": email},
        {"$set": {"role": update.role}}
    )

    return {"message": f"Switched to {update.role}"}