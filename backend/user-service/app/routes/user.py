from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.database import user_collection
from typing import List, Optional, Union

router = APIRouter()

class TouristPreferences(BaseModel):
    travel_style: str = "Adventure" # e.g. "Relaxing", "Adventure", "Culture"
    budget_range: str = "Mid-range" # e.g. "Budget", "Luxury"
    interests: List[str] = []

class BrandPreferences(BaseModel):
    industry_type: str = "Hotel" # e.g. "Agency", "Hotel", "Airline"
    target_market: List[str] = [] # e.g. "Backpackers", "Families"
    business_goals: str = "Growth"

class UpdatePreferences(BaseModel):
    settings: Union[TouristPreferences, BrandPreferences]

class UserMetadata(BaseModel):
    display_name: Optional[str] = None
    bio: str = "I love exploring the world!"
    location: str = "Earth"
    website_url: Optional[str] = None 
    is_verified: bool = False

@router.get("/{email}")
async def get_user_context(email: str):
    user = await user_collection.find_one({"email": email}, {"_id": 0, "password": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/{email}/preferences")
async def update_preferences(email: str, update: UpdatePreferences):
    db_user = await user_collection.find_one({"email": email})
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_role = db_user.get("role")
    
    new_settings = update.settings.model_dump()
    
    await user_collection.update_one(
        {"email": email}, 
        {"$set": {"preferences": new_settings}}
    )
    
    return {
        "message": f"Updated settings for {user_role} profile successfully",
        "saved_data": new_settings
    }

@router.put("/{email}/metadata")
async def update_metadata(email: str, meta: UserMetadata):
    result = await user_collection.update_one(
        {"email": email}, 
        {"$set": {"metadata": meta.model_dump()}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "Profile metadata updated successfully"}
