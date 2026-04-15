from fastapi import APIRouter, HTTPException
from app.services.conversation_service import ConversationService
from app.utils.id import generate_id
conversation_service = ConversationService()

router = APIRouter()

@router.post("/conversations/start")

async def start_conversation(user_id: str):

    return await conversation_service.create_conversation(user_id)


@router.post("/conversations/{conv_id}/message")
async def send_message(conv_id: str, message: str):
    return await conversation_service.send_message(conv_id, message)