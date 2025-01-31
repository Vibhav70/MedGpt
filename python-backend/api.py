from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from pinecone import Pinecone, ServerlessSpec
import os
import time
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_pinecone import PineconeVectorStore
import google.generativeai as genai
import tiktoken  # OpenAI tokenizer

# Load environment variables from a .env file
load_dotenv()

# Pinecone configuration
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
pc = Pinecone(api_key=PINECONE_API_KEY)

# Define serverless specifications and index name
spec = ServerlessSpec(cloud="aws", region="us-east-1")
index_name = "finaltest"

# Connect to Pinecone index
index = pc.Index(index_name)
time.sleep(1)

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

# OpenAI tokenizer initialization
tokenizer = tiktoken.get_encoding("cl100k_base")  # Use the appropriate tokenizer for the embedding model

# System message for the chatbot
system_message = (
    "You are a helpful assistant specifically designed to provide comprehensive answers based on the given context "
    "from medical books and resources. If the information is not in the provided context, respond with: "
    "'The provided context does not contain sufficient information.' Be detailed and accurate in your responses."
)

# Function to calculate tokens
def count_tokens(text):
    return len(tokenizer.encode(text))

# Function to retrieve relevant context with metadata
def get_relevant_passage(query, vectorstore, max_results=3):
    results = vectorstore.similarity_search(query, k=max_results)
    if results:
        # Combine passages with essential metadata
        context = "\n".join(
            f"- Title: {result.metadata.get('book_title', 'Unknown Book')}, "
            f"Author: {result.metadata.get('author', 'Unknown Author')}, "
            f"Page: {result.metadata.get('page_number', 'Unknown')}:\n"
            f"{result.page_content.strip()}"
            for result in results if result.page_content
        )
        return context
    return "No relevant context found."

# Function to create the RAG prompt for topics or questions
def make_rag_prompt(user_input, context, is_question):
    if is_question:
        instruction = "Answer the user's question in detail using all the information from the provided context. If the context does not contain the answer, respond with: 'The provided context does not contain sufficient information.'"
    else:
        instruction = "Provide all relevant information about the given topic using the provided context. Be detailed and comprehensive."
    
    return (
        f"{instruction}\n\n"
        f"### User Input:\n{user_input}\n\n"
        f"### Context:\n{context}\n\n"
        f"### Response:"
    )

# Generate a response from Google Gemini and append metadata to the final response
def generate_answer(system_message, chat_history, prompt, relevant_text):
    model = genai.GenerativeModel("gemini-pro")

    # Combine system message and chat history
    full_prompt = f"{system_message}\n\n" + "\n".join(chat_history) + f"\nUser: {prompt}\nAssistant:"
    
    # Count input tokens
    input_tokens = count_tokens(full_prompt)
    
    # Generate the response
    response = model.generate_content(full_prompt).text
    
    # Count output tokens
    output_tokens = count_tokens(response)
    
    # Print token usage
    print(f"Input Tokens: {input_tokens}, Output Tokens: {output_tokens}, Total Tokens: {input_tokens + output_tokens}")
    
    # Append metadata for transparency
    response_with_metadata = f"{response}\n\n### Source(s):\n{relevant_text}"
    return response_with_metadata

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
    relevant_text = get_relevant_passage(user_input, vectorstore)
    prompt = make_rag_prompt(user_input, relevant_text, input_is_question)

    # Generate a response
    answer = generate_answer(system_message, request.session["chat_history"], prompt, relevant_text)

    # Update chat history
    request.session["chat_history"] = update_chat_history(
        request.session["chat_history"], user_input, answer
    )

    # Return the answer
    return {"answer": answer.strip()} 
    

# To run the FastAPI app, use the following command:
# uvicorn api:app --reload