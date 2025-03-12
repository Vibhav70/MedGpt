from pydantic import BaseModel

class ChatInput(BaseModel):
    user_input: str


class UploadRequest(BaseModel):
    pinecone_index: str
    pinecone_api_key: str