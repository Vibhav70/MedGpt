from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
import os

# Initialize embeddings
embeddings = HuggingFaceEmbeddings(model_name="all-mpnet-base-v2")

def read_pdf(directory):
    """Read PDF files from a directory."""
    file_loader = PyPDFDirectoryLoader(directory)
    documents = file_loader.load()
    return documents

def chunk_data(docs, chunk_size=400, chunk_overlap=10):
    """Split documents into chunks."""
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    chunks = text_splitter.split_documents(docs)
    return chunks

def process_and_upsert_pdf(pdf_path, index):
    """Process a PDF file and upsert its chunks into the specified Pinecone index."""
    # Read the PDF
    documents = read_pdf(pdf_path)
    
    # Split into chunks
    chunks = chunk_data(documents)
    
    # Generate embeddings and upsert into Pinecone
    vectors = []
    for i, chunk in enumerate(chunks):
        try:
            # Extract metadata
            source = chunk.metadata.get("source", "unknown")
            filename = os.path.basename(source)
            book_name, book_author = filename.replace(".pdf", "").split("-")
            
            # Generate embedding
            embedding = embeddings.embed_query(chunk.page_content)
            
            # Create metadata
            metadata = {
                "chunk_index": i,
                "text": chunk.page_content,
                "source": source,
                "author": book_author,
                "page_number": chunk.metadata.get("page_number", "unknown"),
                "book_title": book_name,
            }
            
            # Create a unique ID
            unique_id = f"{book_name}_{i}"
            
            # Append to vectors
            vectors.append((unique_id, embedding, metadata))
        except Exception as e:
            print(f"Error processing chunk {i}: {e}")
    
    # Upsert vectors into Pinecone in batches
    batch_size = 100
    total_batches = (len(vectors) + batch_size - 1) // batch_size
    for batch_index in range(total_batches):
        try:
            batch_start = batch_index * batch_size
            batch_end = min(batch_start + batch_size, len(vectors))
            batch_vectors = vectors[batch_start:batch_end]
            
            # Upsert the batch
            index.upsert(batch_vectors)
            print(f"Batch {batch_index + 1}/{total_batches} upserted successfully.")
        except Exception as e:
            print(f"Error upserting batch {batch_index + 1}: {e}")
    
    print(f"Successfully indexed {len(vectors)} chunks into Pinecone.")