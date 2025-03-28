from fastapi import APIRouter, HTTPException
from app.models.schemas import ChatInput, PremiumChatResponse
from app.services.premium_chatservice import PremiumChatService

router = APIRouter()
premium_service = PremiumChatService()

@router.post("/chat_premium", response_model=PremiumChatResponse)
async def premium_chat_endpoint(chat_input: ChatInput):
    try:
        return await premium_service.process_premium_query(chat_input.user_input)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing premium query: {str(e)}"
        )