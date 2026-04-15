from pydantic import BaseModel, EmailStr, Field, field_validator
import re
from typing import Literal

class RegisterUser(BaseModel):
    name: str
    email: EmailStr
    role: Literal["tourist", "brand"]
    password: str = Field(min_length=8)
    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if not re.match(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$", v):
            raise ValueError(
                "Password must contain at least one uppercase letter, "
                "one lowercase letter, one number, and one special character."
            )
        return v



class LoginUser(BaseModel):
    email: EmailStr
    password: str

class RoleUpdate(BaseModel):
    role: Literal["tourist", "brand"]