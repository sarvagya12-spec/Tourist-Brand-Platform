from datetime import datetime
from typing import List, Dict, Any
from app.db.mongo import conversation_collection
from app.utils.id import generate_id
from app.schemas.conversation import ConversationState, MessageRole, UserType
from app.services.message_pipeline import AIService
from fastapi import HTTPException


class ConversationService:


    def __init__(self):
        self.ai_service = AIService()
    
  
    async def create_conversation(self, user_id: str) -> Dict[str, Any]:
        conv_id = generate_id("conv")

        conversation = {
            "conv_id": conv_id,
            "user_id": user_id,
            "messages": [],
            "state": ConversationState.active.value,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }

        await conversation_collection.insert_one(conversation)
        conversation.pop("_id", None)  
        return conversation

    async def get_conversation(self, conv_id: str):
        conv = await conversation_collection.find_one({"conv_id": conv_id})
        if conv:
            conv.pop("_id", None) 
        return conv

    async def send_message(self, conv_id: str, content: str, user_id: str):

        conv = await conversation_collection.find_one({
            "conv_id": conv_id,
            "user_id": user_id
        })

        if not conv:
            raise HTTPException(status_code=403, detail="Unauthorized")

        user_msg = {
            "msg_id": generate_id("msg"),
            "conv_id": conv_id,
            "role": "user",
            "user_type": "tourist",
            "content": content,
            "timestamp": datetime.utcnow(),
        }

        await conversation_collection.update_one(
            {"conv_id": conv_id},
            {
                "$push": {"messages": user_msg},
                "$set": {"updated_at": datetime.utcnow()},
            },
        )

        messages = conv.get("messages", []) + [user_msg]

        ai_response = self.ai_service.generate(
            messages=messages,
            user_type="tourist"
        )

        ai_msg = {
            "msg_id": generate_id("msg"),
            "conv_id": conv_id,
            "role": "assistant",
            "user_type": "system",
            "content": ai_response,
            "timestamp": datetime.utcnow(),
        }

        await conversation_collection.update_one(
            {"conv_id": conv_id},
            {
                "$push": {"messages": ai_msg},
                "$set": {"updated_at": datetime.utcnow()},
            },
        )

        return {
            "user_message": user_msg,
            "ai_response": ai_msg
        }
        

            
