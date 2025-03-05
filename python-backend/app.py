from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from pydantic import BaseModel
from pinecone import Pinecone
import os
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_pinecone import PineconeVectorStore
import google.generativeai as genai

# Load environment variables from a .env file
load_dotenv()

# Pinecone configuration
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
pc = Pinecone(api_key=PINECONE_API_KEY)

<<<<<<< HEAD
# Define serverless specifications and index name
spec = ServerlessSpec(cloud="aws", region="us-east-1")
index_name = "testing"  #old finaltest
=======
# Pinecone index name
index_name = "testing2"
>>>>>>> 2b45df6dc11bce123f1bb63dd12cabde7856f364

# Connect to Pinecone index
index = pc.Index(index_name)

# Google API configuration
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)

# Initialize embeddings and vector store
embeddings = HuggingFaceEmbeddings(model_name="all-mpnet-base-v2")
vectorstore = PineconeVectorStore(
    index=index,
    embedding=embeddings,
    text_key="text"  # Ensure this matches your Pinecone schema
)

# System message for the chatbot
system_message = (
    "You are a helpful assistant specifically designed to provide comprehensive answers based on the given context "
    "from medical books and resources. If the information is not in the provided context, respond with: "
    "'The provided context does not contain sufficient information.' Be detailed and accurate in your responses."
)

# Function to retrieve relevant context with metadata
def get_relevant_passage(query, vectorstore, max_results=4):
    results = vectorstore.similarity_search(query, k=max_results)
    print(f"Retrieved {len(results)} results from Pinecone.")  # Log number of results
    
    # Organize results by book and author
    grouped_results = {}
    for result in results:
        book_title = result.metadata.get("book_title", "Unknown Book")
        author = result.metadata.get("author", "Unknown Author")
        key = (book_title, author)
        
        if key not in grouped_results:
            grouped_results[key] = []
        
        grouped_results[key].append(result)
        print(f"Added result from Book: {book_title}, Author: {author}")  # Log each result
    
    return grouped_results

# Function to create the RAG prompt for topics or questions
def make_rag_prompt(user_input, context, is_question):
    if is_question:
        instruction = (
            "Answer the user's question in detail using ONLY the provided context. "
            "If the context does not contain enough information, respond with: 'The provided context does not contain sufficient information.' "
            "Do not make up information or use external knowledge. "
            "Be concise and accurate."
        )
    else:
        instruction = (
            "Provide a detailed explanation of the topic using ONLY the provided context. "
            "If the context does not contain enough information, respond with: 'The provided context does not contain sufficient information.' "
            "Do not make up information or use external knowledge. "
            "Be concise and accurate."
        )
    
    return (
        f"{instruction}\n\n"
        f"### User Input:\n{user_input}\n\n"
        f"### Context:\n{context}\n\n"
        f"### Response:"
    )

# Generate a response from Google Gemini and append metadata to the final response
def generate_answer(system_message, chat_history, prompt, grouped_results):
    model = genai.GenerativeModel("gemini-2.0-flash")
    
    responses = []
    
    for (book_title, author), results in grouped_results.items():
        # Combine passages for this book and author
        context = "\n".join(
            f"- Page: {result.metadata.get('page_number', 'Unknown')}:\n"
            f"{result.page_content.strip()}"
            for result in results if result.page_content
        )
        print(f"Context for Book: {book_title}, Author: {author}:\n{context}")  # Log context
        
        # Create a RAG prompt for this book and author
        book_prompt = make_rag_prompt(prompt, context, is_question=True)
        print(f"Prompt for Book: {book_title}, Author: {author}:\n{book_prompt}")  # Log prompt
        
        # Combine system message and chat history
        full_prompt = f"{system_message}\n\n" + "\n".join(chat_history) + f"\n{book_prompt}"
        
        # Generate the response
        response = model.generate_content(full_prompt).text
        print(f"Response for Book: {book_title}, Author: {author}:\n{response}")  # Log response
        
        # Append the response with book and author information
        responses.append({
            "book_title": book_title,
            "author": author,
            "response": response.strip()
        })
    
    return responses

# Function to detect if the input is a question
def is_question(input_text):
    question_words = ["what", "why", "how", "when", "where", "who", "is", "are", "does", "do", "can", "should"]
    return any(input_text.lower().startswith(word) for word in question_words)

# Function to manage chat history length
def update_chat_history(history, user_input, assistant_response, max_history=5):
    history.append(f"User: {user_input}")
    history.append(f"Assistant: {assistant_response}")
    return history[-2 * max_history:]  # Retain only the last max_history exchanges

# FastAPI app
app = FastAPI()

class ChatInput(BaseModel):
    user_input: str

app.add_middleware(SessionMiddleware, secret_key=os.getenv("SESSION_SECRET", "your_secret_key"))

# Add CORS Middleware (Optional but helpful for frontend interaction)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to specific domains if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/chat")
async def chat(chat_input: ChatInput, request: Request):
    user_input = chat_input.user_input.strip()
    if not user_input:
        raise HTTPException(status_code=400, detail="Please enter a valid query or topic.")

    # Initialize chat history if not present
    if "chat_history" not in request.session:
        request.session["chat_history"] = []

    # Detect if the input is a question or a topic
    input_is_question = is_question(user_input)

    # Retrieve relevant context and create a RAG prompt
    grouped_results = get_relevant_passage(user_input, vectorstore)
    print(f"Grouped Results: {grouped_results}")  # Log grouped results

    prompt = make_rag_prompt(user_input, "", input_is_question)  # Context is now handled in generate_answer
    print(f"Constructed Prompt: {prompt}")  # Log constructed prompt

    # Generate a response
    answer = generate_answer(system_message, request.session["chat_history"], prompt, grouped_results)
    print(f"Generated Answer: {answer}")  # Log generated answer

    # Update chat history
    request.session["chat_history"] = update_chat_history(
        request.session["chat_history"], user_input, answer
    )

    # Return the answer in JSON format
    return {"answers": answer}

# To run the FastAPI app, use the following command:
# uvicorn app:app --reload