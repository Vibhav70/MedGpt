from pinecone import Pinecone
from langchain_pinecone import PineconeVectorStore
from app.services.embeddings import embeddings
from app.config.settings import settings

pc = Pinecone(api_key=settings.pinecone_api_key)
index = pc.Index(settings.pinecone_index_name)

vectorstore = PineconeVectorStore(
    index=index,
    embedding=embeddings,
    text_key="text"
)