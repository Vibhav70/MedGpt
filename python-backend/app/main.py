from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from app.config.settings import settings
from app.api.endpoints.chat import router as chat_router
from app.api.endpoints.upload import router as upload_router

app = FastAPI()

app.add_middleware(SessionMiddleware, secret_key=settings.session_secret)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router, prefix="/api")
app.include_router(upload_router, prefix="/api")  # Add the upload router