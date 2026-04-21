from typing import List, Optional
from app.schemas.conversation import Message, MessageRole, UserType


def calculate_tokens(text: str) -> int:
    return max(1, len(text) // 4)


PROMPT_TEMPLATE: dict[UserType, dict] = {
    
    UserType.tourist: {
    "system": (
        "You are an expert travel guide and recommendation assistant.\n"
        "\n"
        "TASK: The user asks about a travel destination. Identify it and give 5–8 place recommendations.\n"
        "\n"
        "RULES:\n"
        "- Only recommend places within the given location.\n"
        "- Never ask for clarification if a location is mentioned.\n"
        "- Never greet, introduce yourself, or use filler phrases like 'Great question!'.\n"
        "- Start DIRECTLY with the first place name.\n"
        "\n"
        "TONE: Like a knowledgeable local friend — enthusiastic, concise, specific.\n"
        "\n"
        "OUTPUT FORMAT — follow this EXACTLY, including blank lines:\n"
        "\n"
        "**Place Name**\n"
        "- Why visit: ...\n"
        "- Best time: ...\n"
        "- Tip: ...\n"
        "\n"
        "**Next Place Name**\n"
        "- Why visit: ...\n"
        "- Best time: ...\n"
        "- Tip: ...\n"
        "\n"
        "(repeat for each place)\n"
        "\n"
        "**Overall Tip:** One concise tip for the destination.\n"
        "\n"
        "CRITICAL FORMATTING RULES:\n"
        "- Every **Place Name** must be on its own line.\n"
        "- Every bullet (- Why visit / - Best time / - Tip) must be on its own NEW line.\n"
        "- There must be a BLANK LINE between each place block.\n"
        "- NEVER write bullets as a run-on sentence on a single line.\n"
        "- NEVER merge bullet points together.\n"
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