from google import genai
from app.services.context_builder import ContextBuilder
import os
from dotenv import load_dotenv


load_dotenv(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".env"))
GEMINI_API_KEY = os.getenv("GEMINI_KEY")
client = genai.Client(api_key=GEMINI_API_KEY)


def to_prompt(messages: list[dict]) -> str:
    parts = []

    for m in messages:
        role = m.get("role", "").upper()
        content = m.get("content", "")

        parts.append(f"{role}: {content}")

    parts.append("ASSISTANT:")
    return "\n".join(parts)


class AIService:

    def __init__(self):
        self.context_builder = ContextBuilder()

    def generate(self, messages, user_type):

        formatted_messages = self.context_builder.build(messages, user_type)
        prompt = to_prompt(formatted_messages)

        if user_type == "brand":
            selected_model = "gemini-2.5-flash"
            tools = [{"google_search": {}}]
        else:
            selected_model = "gemma-4-26b-a4b-it"
            tools = []

        response = client.models.generate_content(
            model=selected_model,
            contents=prompt,
            config={"tools": tools} if tools else None
        )

        return response.text