import json
import sys
import os
from pathlib import Path

# Adjust path to import core files
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.database import save_knowledge_chunk, clear_knowledge_chunks
from rag.embeddings import get_ollama_embedding

KNOWLEDGE_FOLDER = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "knowledge")

FILENAME_TO_TOPIC = {
    "photosynthesis": "photosynthesis",
    "newtons_laws": "newton's laws",
    "machine_learning": "machine learning",
    "data_structures": "data structures",
    "world_war_2": "world war ii",
    "calculus": "calculus",
    "probability": "probability"
}

def load_documents(folder: str):
    documents = []
    folder_path = Path(folder)
    if not folder_path.exists():
        print(f"Knowledge folder {folder} does not exist!")
        return documents
        
    for file in folder_path.rglob("*"):
        if file.is_file() and file.suffix.lower() in [".txt", ".md"]:
            try:
                text = file.read_text(encoding="utf-8")
                documents.append({
                    "source": str(file),
                    "filename": file.stem,
                    "text": text
                })
            except Exception as e:
                print(f"Error reading file {file}: {e}")
    return documents

def chunk_text(text: str, chunk_size: int = 800, overlap: int = 100) -> list[str]:
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        if chunk.strip():
            chunks.append(chunk.strip())
        start += chunk_size - overlap
    return chunks

def run_ingestion():
    print("Clearing old knowledge base...")
    clear_knowledge_chunks()
    
    print(f"Loading documents from {KNOWLEDGE_FOLDER}...")
    documents = load_documents(KNOWLEDGE_FOLDER)
    if not documents:
        print("No documents found to ingest!")
        return

    total_chunks = 0
    for doc in documents:
        filename = doc["filename"]
        # Map filename to a standard topic name or deduce it
        topic = FILENAME_TO_TOPIC.get(filename.lower(), filename.replace("_", " ").lower())
        
        print(f"Processing '{doc['source']}' under topic '{topic}'...")
        chunks = chunk_text(doc["text"])
        
        for chunk in chunks:
            # Try to fetch neural embedding
            emb = get_ollama_embedding(chunk)
            emb_json = json.dumps(emb) if emb else None
            
            save_knowledge_chunk(topic, chunk, emb_json)
            total_chunks += 1
            
    print(f"Success! Ingested {total_chunks} chunks from knowledge files into SQLite.")

if __name__ == "__main__":
    run_ingestion()
