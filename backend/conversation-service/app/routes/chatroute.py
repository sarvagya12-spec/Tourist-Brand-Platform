from fastapi import APIRouter, Depends
from app.services.message_pipeline import AIService
from app.utils.dependencies import get_current_user

router = APIRouter()

ai_service = AIService()


@router.post("/ai/generate")
async def test_ai(message: str, current_user: dict = Depends(get_current_user)):
    
    user_type = current_user.get("role", "tourist") 

    messages = [
        {
            "role": "user",
            "content": message
        }
    ]

    response = ai_service.generate(
        messages=messages,
        user_type=user_type
    )

    return {
        "user_email": current_user.get("email"),
        "detected_role": user_type,
        "response": response
    }