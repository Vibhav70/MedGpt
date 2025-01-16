import streamlit as st
from pinecone import Pinecone, ServerlessSpec
import os
import time
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEmbeddings
# from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_pinecone import PineconeVectorStore
import google.generativeai as genai
# from langchain_huggingface import HuggingFaceEmbeddings

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
# embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
embeddings = HuggingFaceEmbeddings(model_name="all-mpnet-base-v2")
vectorstore = PineconeVectorStore(
    index=index,
    embedding=embeddings,
    text_key="text"  # Ensure this matches your Pinecone schema
)

# Chat session state initialization
if "chat_history" not in st.session_state:
    st.session_state.chat_history = []

# System message for the chatbot
system_message = (
    "You are a helpful assistant specifically designed to answer questions based on medical books and resources. "
    "If the information is not in the given context, respond with 'I don't know' or suggest consulting additional sources. "
    "Maintain a professional and concise tone in all responses."
)

# Function to generate a response from Google Gemini
def generate_answer(system_message, chat_history, prompt):
    model = genai.GenerativeModel("gemini-pro")

    # Append user query to the chat history
    chat_history.append(f"User: {prompt}")

    # Combine system message and chat history
    full_prompt = f"{system_message}\n\n" + "\n".join(chat_history) + "\nAssistant:"
    
    # Generate the response
    response = model.generate_content(full_prompt).text
    chat_history.append(f"Assistant: {response}")

    return response

# Function to retrieve relevant context from vectorstore
def get_relevant_passage(query, vectorstore):
    results = vectorstore.similarity_search(query, k=3)
    if results:
        # Combine passages with metadata from top results
        context = "\n".join(
            f"- {result.metadata.get('book_title', 'Unknown Book')} by {result.metadata.get('author', 'Unknown Author')} "
            f"(Page {result.metadata.get('page_number', 'Unknown')}):\n{result.page_content.strip()}"
            for result in results if result.page_content
        )
        return context
    return "No relevant context found."

# Function to create the RAG prompt
def make_rag_prompt(query, context):
    return f"Query: {query}\n\nContext:\n{context}\n\nAnswer:"

# Streamlit interface
st.title("Medical Assistant Chatbot")

query = st.text_input("Ask your question about medical topics:")

if st.button("Get Answer"):
    if query.strip():
        # Retrieve relevant context and create a RAG prompt
        relevant_text = get_relevant_passage(query, vectorstore)
        prompt = make_rag_prompt(query, relevant_text)

        # Generate a response
        answer = generate_answer(system_message, st.session_state.chat_history, prompt)
        st.write("Answer:", answer)

        # Display chat history
        with st.expander("Chat History"):
            for chat in st.session_state.chat_history:
                st.write(chat)

        # Display retrieved context for transparency
        with st.expander("Retrieved Context"):
            st.write(relevant_text)
    else:
        st.error("Please enter a valid query.")
