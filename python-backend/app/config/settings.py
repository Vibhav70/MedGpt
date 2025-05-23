from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    pinecone_api_key: str
    google_api_key: str
    session_secret: str = "your_secret_key"
    pinecone_index_name: str = "test"  
    pinecone_image_index_name: str = "test"
    embedding_model_name: str = "all-mpnet-base-v2"

    class Config:
        env_file = ".env"

settings = Settings()