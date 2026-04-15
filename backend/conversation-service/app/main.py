from fastapi import FastAPI
from app.routes import convroute  

app = FastAPI()

app.include_router(convroute.router, tags=["Conversations"])