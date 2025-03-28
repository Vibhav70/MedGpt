from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pinecone import Pinecone
import os
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
import google.generativeai as genai
from typing import List, Dict, Any
import asyncio

# Load environment variables
load_dotenv()

# Initialize models and connections
model = SentenceTransformer('sentence-transformers/all-mpnet-base-v2')
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
pc = Pinecone(api_key=PINECONE_API_KEY)

# Pinecone indexes
IMAGE_INDEX_NAME = "testing2"  # Your image index name
TEXT_INDEX_NAME = "testing2"   # Your text content index name

image_index = pc.Index(IMAGE_INDEX_NAME)
text_index = pc.Index(TEXT_INDEX_NAME)

# Google Gemini setup
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=GOOGLE_API_KEY)

# System message for the chatbot
system_message = (
    "You are a helpful assistant that provides comprehensive answers based on the given context. "
    "If the information is not in the provided context, respond with: "
    "'The provided context does not contain sufficient information.' "
    "Be detailed and accurate in your responses."
)

app = FastAPI()

class QueryRequest(BaseModel):
    query: str
    image_top_k: int = 3  # Number of image results to return
    text_top_k: int = 5   # Number of text chunks to use for generation

async def query_image_index(query: str, top_k: int) -> List[Dict[str, Any]]:
    """Query the image index and return relevant images with metadata"""
    query_embedding = model.encode(query).tolist()
    results = image_index.query(
        vector=query_embedding,
        top_k=top_k,
        include_metadata=True
    )
    
    return [
        {
            "image_url": match.metadata.get("cloudinary_url"),
            "description": match.metadata.get("text", ""),
            "score": match.score
        }
        for match in results.matches
        if match.metadata.get("cloudinary_url")
    ]

async def query_text_index(query: str, top_k: int) -> List[Dict[str, Any]]:
    """Query the text index and return relevant text chunks"""
    query_embedding = model.encode(query).tolist()
    results = text_index.query(
        vector=query_embedding,
        top_k=top_k,
        include_metadata=True
    )
    
    return [
        {
            "text": match.metadata.get("text"),
            "page": match.metadata.get("page_number", "N/A"),
            "source": match.metadata.get("book_title", "Unknown Source"),
            "score": match.score
        }
        for match in results.matches
        if match.metadata.get("text")
    ]

def generate_answer(query: str, text_chunks: List[Dict[str, Any]]) -> str:
    """Generate an answer using Gemini with the retrieved text chunks"""
    model = genai.GenerativeModel("gemini-1.5-pro")
    
    # Prepare context
    context = "\n\n".join(
        f"Source: {chunk['source']}\n"
        f"Page: {chunk['page']}\n"
        f"Content: {chunk['text']}"
        for chunk in text_chunks
    )
    
    prompt = f"""System: {system_message}
    
    Context:
    {context}
    
    Question: {query}
    
    Answer the question using ONLY the provided context. Be detailed and accurate.
    If the context doesn't contain enough information, say "The provided context does not contain sufficient information."
    
    Answer:"""
    
    response = model.generate_content(prompt)
    return response.text

@app.post("/query")
async def query_both_indexes(request: QueryRequest):
    try:
        # Query both indexes concurrently
        image_task = query_image_index(request.query, request.image_top_k)
        text_task = query_text_index(request.query, request.text_top_k)
        image_results, text_chunks = await asyncio.gather(image_task, text_task)
        
        # Generate answer from text chunks
        answer = generate_answer(request.query, text_chunks)
        
        return {
            "success": True,
            "query": request.query,
            "images": image_results,
            "answer": answer,
            "sources": [
                {
                    "source": chunk["source"],
                    "page": chunk["page"],
                    "relevance_score": chunk["score"]
                }
                for chunk in text_chunks
            ]
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing query: {str(e)}"
        )

# Add CORS middleware if needed
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)