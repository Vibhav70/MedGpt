from fastapi import APIRouter, HTTPException, Request
from app.models.schemas import ChatInput
from app.services.chat_service import (
    get_relevant_passage,
    make_rag_prompt,
    generate_answer,
    is_question,
    update_chat_history
)

router = APIRouter()

@router.post("/chat")
async def chat(chat_input: ChatInput, request: Request):
    user_input = chat_input.user_input.strip()
    if not user_input:
        raise HTTPException(status_code=400, detail="Please enter a valid query or topic.")

    if "chat_history" not in request.session:
        request.session["chat_history"] = []

    input_is_question = is_question(user_input)
    grouped_results = get_relevant_passage(user_input)
    prompt = make_rag_prompt(user_input, "", input_is_question)
    answer = generate_answer(request.session["chat_history"], prompt, grouped_results)
    request.session["chat_history"] = update_chat_history(
        request.session["chat_history"], user_input, answer
    )
    return {"answers": answer}