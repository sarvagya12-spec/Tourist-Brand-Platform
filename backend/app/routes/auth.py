from fastapi import APIRouter, HTTPException
from app.schemas.user_schema import RegisterUser, LoginUser
from app.database import user_collection
from app.utils.hashing import hash_password, verify_password
from app.utils.jwt import access_token

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
        "password": hashed_pw
    })

    return {"message": "User registered successfully"}



@router.post("/login")
async def login(user: LoginUser):
    db_user = await user_collection.find_one({"email": user.email})

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid password")

    token = access_token({"email": user.email})

    return {"access_token": token}