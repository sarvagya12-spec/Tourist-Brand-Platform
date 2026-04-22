from google import genai
import os
from dotenv import load_dotenv

load_dotenv(".env")
client = genai.Client(api_key=os.getenv("GEMINI_KEY"))

for model in client.models.list():
    print(f"AVAILABLE MODEL: {model.name}")