from fastapi import APIRouter, HTTPException
from app.schemas.user_schema import RegisterUser, LoginUser, RoleUpdate
from app.database import user_collection
from app.utils.hashing import hash_password, verify_password
from app.utils.jwt import access_token, SECRET_KEY
from jose import jwt, JWTError

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
    token = access_token({"email": user.email, "role": db_user["role"]})
    return {"access_token": token, "role": db_user["role"]}

@router.put("/select-role")
async def select_role(update: RoleUpdate, email: str):
    result = await user_collection.update_one(
        {"email": email}, 
        {"$set": {"role": update.role}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
        
    return {"message": f"Successfully switched to {update.role} role"}