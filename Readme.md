# 🧠 MedBookGPT

MedBookGPT is a powerful **multimodal Retrieval-Augmented Generation (RAG)** web application that allows users to query medical books and receive intelligent, context-aware responses. It supports both **textual content** and **visual content** (figures, tables, charts) extracted from medical PDFs, making it an ideal assistant for students and professionals in the medical field.

---

## 🚀 Features

- 🔍 **Text-Based Querying**: Search across large volumes of medical text using semantic similarity.
- 🖼️ **Image-Aware Retrieval**: Understands and retrieves image descriptions (figures, tables, etc.) embedded within the book PDFs.
- 📚 **Book-Level Metadata**: Each result includes contextual metadata such as the book title and page number.
- 🌐 **Vector DB Integration**: Uses Pinecone for fast and scalable vector search.
- ⚙️ **Multimodal Embedding Pipeline**: Combines text chunking with image description embeddings to enhance retrieval performance.
- 🤖 **LLM-Powered Answering**: Powered by Gemini and the `all-mpnet-base-v2` embedding model.

---

## 🧩 Project Architecture

![Project Architecture](https://github.com/user-attachments/assets/57c7ac51-de9d-4b76-9be1-41eaa6eb935f)

> The above diagram illustrates the full end-to-end pipeline from PDF ingestion to multimodal retrieval and LLM-based answer generation.

---

## 📼 Demo Video

*(https://drive.google.com/file/d/1COAF242QDSlv2GhBQtb3K62b1KZvU61a/view?usp=drive_link)*

---

## 🛠️ Tech Stack

| Layer           | Technology                      |
|----------------|----------------------------------|
| Embedding Model| `all-mpnet-base-v2`              |
| Vector Store   | Pinecone                         |
| LLM            | Gemini                           |
| PDF Parsing    | `pymupdf4llm`, `text-splitter`   |
| Image Hosting  | Cloudinary                       |
| Backend        | Python, Flask/FastAPI (or specify)|
| Frontend       | (Optional: React, Streamlit, etc.)|

---


---

## 📦 How It Works

1. **Text Extraction**: Each medical PDF is split into manageable chunks using a Recursive Character Text Splitter.
2. **Image Extraction**: Figures, tables, and visual elements are extracted using `pymupdf4llm`.
3. **Cloud Upload**: Extracted images are uploaded to Cloudinary and stored with their URLs.
4. **Embedding**:
   - Text chunks and image descriptions are embedded using `all-mpnet-base-v2`.
   - Metadata (e.g., image URLs, book title) is added during vector insertion.
5. **Vector Storage**: All embeddings are stored in Pinecone for fast retrieval.
6. **Query Handling**:
   - User submits a query → embedded → top-K similar results fetched from Pinecone.
   - Gemini LLM uses the retrieved context to generate a detailed answer.

---

## 📌 Use Cases

- 🧑‍⚕️ Medical Students preparing for exams
- 📖 Professionals looking for quick reference
- 👩‍🏫 Teachers creating content from reliable academic sources

---

## 🧪 Future Improvements

- 🔊 Add voice input and TTS for query and response
- 📱 Launch a mobile-friendly interface
- 🧬 Fine-tune model with medical QA datasets for improved accuracy
- 🧠 Expand to include more disciplines (Law, Engineering, etc.)

---

## 📥 Installation & Running Locally

```bash
git clone https://github.com/yourusername/medbookgpt.git
cd medbookgpt
pip install -r requirements.txt
python app/main.py


