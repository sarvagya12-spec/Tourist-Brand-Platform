from fastapi import APIRouter
from app.services.message_pipeline import AIService

router = APIRouter()

ai_service = AIService()


@router.post("/ai/generate")
async def test_ai(message: str):

    messages = [
        {
            "role": "user",
            "content": message
        }
    ]

    response = ai_service.generate(
        messages=messages,
        user_type="tourist"
    )

    return {
        "input": message,
        "response": response
    }