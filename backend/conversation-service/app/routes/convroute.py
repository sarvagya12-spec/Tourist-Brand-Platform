from fastapi import APIRouter, HTTPException, Depends , WebSocket, WebSocketDisconnect
from jose import jwt, JWTError
from app.services.conversation_service import ConversationService
from app.utils.dependencies import get_current_user
from app.utils.datetime import safe_serialize
from dotenv import load_dotenv
import os
from datetime import datetime

load_dotenv(os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", ".env"))

SECRET_KEY = os.getenv("SECRET_KEY")

conversation_service = ConversationService()
router = APIRouter()


@router.post("/conversations/start")
async def start_conversation(user=Depends(get_current_user)):
    user_id = user["user_id"]
    return await conversation_service.create_conversation(user_id)


@router.post("/conversations/{conv_id}/message")
async def send_message(conv_id: str, message: str, user=Depends(get_current_user)):
    user_id = user["user_id"]
    return await conversation_service.send_message(conv_id, message, user_id)


@router.websocket("/ws/chat/{conv_id}")
async def chat_websocket(websocket: WebSocket, conv_id: str):
    await websocket.accept()

    token = websocket.query_params.get("token")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload["user_id"]
    except JWTError:
        await websocket.close(code=1008)
        return

    try:
        while True:
            data = await websocket.receive_text()

            result = await conversation_service.send_message(
                conv_id, data, user_id
            )

            await websocket.send_json(safe_serialize(result))

    except WebSocketDisconnect:
        print("Client disconnected")