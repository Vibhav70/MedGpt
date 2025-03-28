from pydantic import BaseModel
from typing import List, Optional

class ChatInput(BaseModel):
    user_input: str


class UploadRequest(BaseModel):
    pinecone_index: str
    pinecone_api_key: str

class ImageResult(BaseModel):
    image_url: str
    description: str
    score: float

class TextResponse(BaseModel):
    book_title: str
    author: str
    response: str

class PremiumChatResponse(BaseModel):
    success: bool
    query: str
    images: List[ImageResult]
    text_responses: List[TextResponse]