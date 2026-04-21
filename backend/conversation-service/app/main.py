from fastapi import FastAPI
from app.routes import convroute ,chatroute
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(convroute.router, tags=["Conversations"])
app.include_router(chatroute.router, tags=["LLMtest"])