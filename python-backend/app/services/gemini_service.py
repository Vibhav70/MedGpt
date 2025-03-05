import google.generativeai as genai
from app.config.settings import settings

genai.configure(api_key=settings.google_api_key)

def generate_gemini_response(prompt):
    model = genai.GenerativeModel("gemini-2.0-flash")
    response = model.generate_content(prompt)
    return response.text