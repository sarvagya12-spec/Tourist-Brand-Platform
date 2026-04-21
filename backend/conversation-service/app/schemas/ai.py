from pydantic import BaseModel
from app.schemas.conversation import UserType

class Generaterequest(BaseModel):
    conv_id : str
    user_type: UserType
    content:str
    