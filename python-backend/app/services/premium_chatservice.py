from typing import List, Dict
import asyncio
from app.services.chat_service import get_relevant_passage, generate_answer
from app.services.image_service import ImageSearchService
from app.models.schemas import PremiumChatResponse, TextResponse

class PremiumChatService:
    def __init__(self):
        self.image_service = ImageSearchService()
    
    async def process_premium_query(self, user_input: str) -> PremiumChatResponse:
        try:
            # Concurrently fetch images and text passages
            image_task = self.image_service.search_images(user_input)
            text_task = asyncio.to_thread(get_relevant_passage, user_input)
            image_results, grouped_results = await asyncio.gather(image_task, text_task)
            
            text_responses = []
            for (book_title, author), results in grouped_results.items():
                # Prepare context with page numbers and content
                context_pages = [
                    f"Page {result.metadata.get('page_number', 'N/A')}: {result.page_content.strip()}"
                    for result in results if result.page_content
                ]
                context = "\n".join(context_pages)
                
                # Enhanced prompt template
                prompt = f"""**Medical Concept Explanation Request**
                
                **User Query:** {user_input}
                
                **Context from {book_title} by {author}:**
                {context}
                
                **Instructions:**
                1. Provide a concise, point-wise explanation using ONLY the given context
                2. Each point should be clear and factual
                3. Include relevant numbers/dates if available in context
                4. If context is insufficient, state: "The context doesn't contain complete information about this topic"
                5. Format as bullet points with maximum 5-7 key points
                6. Never speculate beyond the provided context
                
                **Required Response Format:**
                - Point 1: [Concise fact]
                - Point 2: [Concise fact]
                ..."""
                
                response = generate_answer([], prompt, {(book_title, author): results})
                text_responses.extend(response)
            
            return PremiumChatResponse(
                success=True,
                query=user_input,
                images=image_results,
                text_responses=[
                    TextResponse(
                        book_title=resp["book_title"],
                        author=resp["author"],
                        response=self._format_response(resp["response"])
                    )
                    for resp in text_responses
                ]
            )
            
        except Exception as e:
            raise e

    def _format_response(self, raw_response: str) -> str:
        """Post-process the response to ensure consistent formatting"""
        # Remove any redundant headers or footers
        response = raw_response.strip()
        
        # Ensure bullet point formatting
        if not response.startswith(('- ', '* ', '• ')):
            lines = response.split('\n')
            response = '\n'.join(f"- {line.strip()}" for line in lines if line.strip())
        
        # Limit to 7 points maximum
        points = [p for p in response.split('\n') if p.startswith(('-', '*', '•'))]
        if len(points) > 7:
            response = '\n'.join(points[:7]) + "\n[...]"
        
        return response