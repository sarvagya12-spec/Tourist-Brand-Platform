from pydantic import BaseModel
from datetime import datetime


class ConversationState(str,Enum):
    created = "created"
    active = "active"
    closed = "closed"

class Conversation(BaseModel):
    conv_id : str
    user_id:str
    state:ConversationState
    created_at:datetime
    last_update:datetime
    metadata: Optional[dict] = {}

class MessageRole(str,Enum):
    user = "user"
    assistant = "assistant"

class UserType(str, Enum):
    tourist = "tourist"
    brand = "brand"

class Message(BaseModel):
    msg_id:str
    conv_id:str
    role: MessageRole
    user_type:UserType
    content:str