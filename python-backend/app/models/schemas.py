from pydantic import BaseModel

class ChatInput(BaseModel):
    user_input: str