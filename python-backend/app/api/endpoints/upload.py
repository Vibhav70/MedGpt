from fastapi import APIRouter, File, UploadFile, HTTPException, Form
from fastapi.responses import JSONResponse
import os
import json
from app.services.pdf_service import process_and_upsert_pdf
from app.models.schemas import UploadRequest
from pinecone import Pinecone

router = APIRouter()

@router.post("/upload")
async def upload_pdf(
    request: str = Form(...),  # Accept the request payload as a JSON string
    file: UploadFile = File(...)
):
    # Ensure the uploads directory exists
    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)
    
    # Save the uploaded file
    file_path = os.path.join(upload_dir, file.filename)
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())
    
    try:
        # Parse the JSON string into a dictionary
        request_data = json.loads(request)
        
        # Validate the request data using the Pydantic model
        upload_request = UploadRequest(**request_data)
        
        # Initialize Pinecone with the provided API key
        pc = Pinecone(api_key=upload_request.pinecone_api_key)
        index = pc.Index(upload_request.pinecone_index)
        
        # Process the PDF and upsert into the specified Pinecone index
        process_and_upsert_pdf(upload_dir, index)
        return JSONResponse(content={"message": "PDF processed and upserted successfully."})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")
    finally:
        # Clean up the uploaded file
        os.remove(file_path)