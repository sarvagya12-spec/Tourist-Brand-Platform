from fastapi import FastAPI
from app.routes import user

app = FastAPI(title="User Context Service")

app.include_router(user.router, prefix="/users", tags=["Users"])

@app.get("/health")
async def health_check():
    return {"status": "User Service is up and running"}
