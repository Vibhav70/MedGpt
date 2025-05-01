from sentence_transformers import SentenceTransformer
from pinecone import Pinecone
from typing import List
from app.config.settings import settings
from app.models.schemas import ImageResult

class ImageSearchService:
    def __init__(self):
        self.model = SentenceTransformer('sentence-transformers/all-mpnet-base-v2')
        self.pc = Pinecone(api_key=settings.pinecone_api_key)
        self.image_index = self.pc.Index("test")  # Your image index name
    
    async def search_images(self, query: str, top_k: int = 3) -> List[ImageResult]:
        query_embedding = self.model.encode(query).tolist()
        results = self.image_index.query(
            vector=query_embedding,
            top_k=top_k,
            include_metadata=True
        )
        
        return [
            ImageResult(
                image_url=match.metadata.get("image_url"),
                description=match.metadata.get("text", ""),
                score=match.score
            )
            for match in results.matches
            if match.metadata.get("image_url")
        ]