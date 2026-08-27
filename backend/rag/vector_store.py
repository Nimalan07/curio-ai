import math
import re
import json
from core.database import get_knowledge_chunks
from rag.embeddings import get_ollama_embedding

def cosine_similarity(a: list[float], b: list[float]) -> float:
    dot_product = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(y * y for y in b))
    if norm_a == 0.0 or norm_b == 0.0:
        return 0.0
    return dot_product / (norm_a * norm_b)

def compute_tfidf_similarity(query: str, documents: list[str]) -> list[float]:
    def tokenize(text):
        return re.findall(r'\b\w+\b', text.lower())

    query_tokens = tokenize(query)
    if not query_tokens or not documents:
        return [0.0] * len(documents)

    doc_tokens = [tokenize(doc) for doc in documents]
    
    # Calculate Document Frequency
    df = {}
    for doc in doc_tokens:
        unique_tokens = set(doc)
        for token in unique_tokens:
            df[token] = df.get(token, 0) + 1
            
    # Calculate Inverse Document Frequency
    n_docs = len(documents)
    idf = {}
    for token, count in df.items():
        idf[token] = math.log((n_docs + 1) / (count + 0.5)) + 1
        
    # Calculate Query Vector
    query_tf = {}
    for token in query_tokens:
        query_tf[token] = query_tf.get(token, 0) + 1
    
    query_vec = {}
    query_norm = 0.0
    for token, count in query_tf.items():
        weight = count * idf.get(token, 0.0)
        query_vec[token] = weight
        query_norm += weight * weight
    query_norm = math.sqrt(query_norm)
    
    if query_norm == 0.0:
        return [0.0] * len(documents)
        
    similarities = []
    for doc in doc_tokens:
        doc_tf = {}
        for token in doc:
            doc_tf[token] = doc_tf.get(token, 0) + 1
            
        doc_norm = 0.0
        dot_product = 0.0
        for token, count in doc_tf.items():
            weight = count * idf.get(token, 0.0)
            doc_norm += weight * weight
            if token in query_vec:
                dot_product += query_vec[token] * weight
                
        doc_norm = math.sqrt(doc_norm)
        if doc_norm == 0.0:
            similarities.append(0.0)
        else:
            similarities.append(dot_product / (query_norm * doc_norm))
            
    return similarities

def query_vector_store(topic: str, query: str, top_k: int = 3) -> list[dict]:
    """
    Retrieves the top_k most relevant knowledge chunks for the topic.
    Gracefully uses neural embeddings or falls back to TF-IDF.
    """
    chunks = get_knowledge_chunks(topic)
    if not chunks:
        return []

    # Try neural search first
    query_embedding = get_ollama_embedding(query)
    if query_embedding:
        scored_chunks = []
        for chunk in chunks:
            if chunk.get("embedding"):
                try:
                    chunk_emb = json.loads(chunk["embedding"])
                    sim = cosine_similarity(query_embedding, chunk_emb)
                    scored_chunks.append((sim, chunk))
                except Exception:
                    pass
        if scored_chunks:
            scored_chunks.sort(key=lambda x: x[0], reverse=True)
            return [item[1] for item in scored_chunks[:top_k]]

    # Fallback: TF-IDF text search
    doc_contents = [chunk["content"] for chunk in chunks]
    similarities = compute_tfidf_similarity(query, doc_contents)
    
    scored_chunks = list(zip(similarities, chunks))
    # Filter out absolute zero matches if possible, but keep ranking
    scored_chunks.sort(key=lambda x: x[0], reverse=True)
    
    return [item[1] for item in scored_chunks[:top_k] if item[0] > 0.0]
