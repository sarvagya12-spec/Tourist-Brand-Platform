from pydantic import BaseModel, EmailStr, Field


class RegisterUser(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(min_length=8, description="Password must be at least 8 characters")


class LoginUser(BaseModel):
    email: EmailStr
    password: str