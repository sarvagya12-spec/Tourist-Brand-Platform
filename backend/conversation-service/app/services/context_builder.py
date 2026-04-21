from typing import List, Optional
from app.schemas.conversation import Message, MessageRole, UserType


def calculate_tokens(text: str) -> int:
    return max(1, len(text) // 4)


PROMPT_TEMPLATE: dict[UserType, dict] = {
    
    UserType.tourist: {
    "system": (
        "You are an expert travel guide and recommendation assistant.\n"
        "\n"
        "TASK:\n"
        "- The user will ask about travel destinations — a city, state, region, or country.\n"
        "- Identify the location and provide rich, helpful travel recommendations.\n"
        "\n"
        "FOR EACH PLACE YOU RECOMMEND, INCLUDE:\n"
        "- What makes it special or unique\n"
        "- Best time to visit (if relevant)\n"
        "- One practical tip (what to do, see, or experience there)\n"
        "\n"
        "RULES:\n"
        "- ONLY recommend places within the given location.\n"
        "- Recommend 5 to 8 places per response.\n"
        "- Do NOT ask for clarification if a location is clearly mentioned.\n"
        "- Do NOT include places from other cities, states, or countries.\n"
        "- Do NOT introduce yourself, greet the user, or add filler phrases.\n"
        "- Do NOT say things like 'Great question!' or 'Sure, here are...'.\n"
        "- Start your response directly with the first recommendation.\n"
        "\n"
        "TONE:\n"
        "- Conversational but informative — like a knowledgeable local friend.\n"
        "- Enthusiastic about the destination without being generic.\n"
        "\n"
        "FORMAT:\n"
        "For each place, follow EXACTLY this structure:\n"
        "\n"
        "**Place Name**\n"
        "- Why visit: <short description of what makes it special>\n"
        "- Best time: <best time to visit>\n"
        "- Tip: <one practical tip>\n"
        "\n"
        "Repeat for each place.\n"
        "\n"
        "After all places, add:\n"
        "**Overall Tip:** <one concise travel tip for the destination>\n"
        "\n"
        "IMPORTANT:\n"
        "- Use bullet points (-) exactly as shown\n"
        "- Each point must be on a new line\n"
        "- Do NOT merge everything into one paragraph\n"
        "- Do NOT skip line breaks\n"
    ),
    "input_prefix": "User:",
    "output_prefix": "Assistant:",
    "fallback_reply": "I can help you discover amazing places to visit, local experiences, and travel tips.",
},
}


class ContextBuilder:

    def __init__(self, max_tokens: int = 6000, max_history: int = 20):
        self.max_tokens = max_tokens
        self.max_history = max_history

    def build(
        self,
        messages: List[Message],
        user_type: UserType,
    ) -> List[dict]:

        config = PROMPT_TEMPLATE.get(user_type)
        if not config:
            raise ValueError(f"No prompt config for user_type: {user_type}")

        result = [{"role": "system", "content": config["system"]}]

        previous_chats = messages[-self.max_history:]

        for msg in previous_chats:
            if isinstance(msg, dict):
                role = msg.get("role")
                content = msg.get("content")
            else:
                role = msg.role.value
                content = msg.content

            if role == MessageRole.user.value:
                content = f"{config['input_prefix']} {content}"
            elif role == MessageRole.assistant.value:
                content = f"{config['output_prefix']} {content}"

            result.append({"role": role, "content": content})  

        return result