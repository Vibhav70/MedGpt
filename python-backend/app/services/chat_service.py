from app.services.pinecone_service import vectorstore
from app.services.gemini_service import generate_gemini_response
from app.config.settings import settings

system_message = (
    "You are a helpful assistant specifically designed to provide comprehensive answers based on the given context "
    "from medical books and resources. If the information is not in the provided context, respond with: "
    "'The provided context does not contain sufficient information.' Be detailed and accurate in your responses."
)

def get_relevant_passage(query, max_results=4):
    results = vectorstore.similarity_search(query, k=max_results)
    grouped_results = {}
    for result in results:
        book_title = result.metadata.get("book_title", "Unknown Book")
        author = result.metadata.get("author", "Unknown Author")
        key = (book_title, author)
        if key not in grouped_results:
            grouped_results[key] = []
        grouped_results[key].append(result)
    return grouped_results

def make_rag_prompt(user_input, context, is_question):
    instruction = (
        "Answer the user's question in detail using ONLY the provided context. "
        "If the context does not contain enough information, respond with: 'The provided context does not contain sufficient information.' "
        "Do not make up information or use external knowledge. "
        "Be concise and accurate."
    ) if is_question else (
        "Provide a detailed explanation of the topic using ONLY the provided context. "
        "If the context does not contain enough information, respond with: 'The provided context does not contain sufficient information.' "
        "Do not make up information or use external knowledge. "
        "Be concise and accurate."
    )
    return f"{instruction}\n\n### User Input:\n{user_input}\n\n### Context:\n{context}\n\n### Response:"

def generate_answer(chat_history, prompt, grouped_results):
    responses = []
    for (book_title, author), results in grouped_results.items():
        context = "\n".join(
            f"- Page: {result.metadata.get('page_number', 'Unknown')}:\n"
            f"{result.page_content.strip()}"
            for result in results if result.page_content
        )
        book_prompt = make_rag_prompt(prompt, context, is_question=True)
        full_prompt = f"{system_message}\n\n" + "\n".join(chat_history) + f"\n{book_prompt}"
        response = generate_gemini_response(full_prompt)
        responses.append({
            "book_title": book_title,
            "author": author,
            "response": response.strip()
        })
    return responses

def is_question(input_text):
    question_words = ["what", "why", "how", "when", "where", "who", "is", "are", "does", "do", "can", "should"]
    return any(input_text.lower().startswith(word) for word in question_words)

def update_chat_history(history, user_input, assistant_response, max_history=5):
    history.append(f"User: {user_input}")
    history.append(f"Assistant: {assistant_response}")
    return history[-2 * max_history:]