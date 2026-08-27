import os
from rag.vector_store import search_knowledge

# Can be customized in .env
KNOWLEDGE_THRESHOLD = float(os.getenv("CURIO_KNOWLEDGE_THRESHOLD", "0.55"))

def check_knowledge_relevance(topic: str, student_message: str, top_k: int = 5) -> dict:
    """
    Semantic Knowledge Gate: Determines if the local database has relevant ground-truth context.
    Returns:
        dict: {
            "should_retrieve": bool,
            "similarity": float,
            "results": list[dict]
        }
    """
    if not student_message.strip():
        return {
            "should_retrieve": False,
            "similarity": 0.0,
            "results": []
        }

    # Search local database for match
    results = search_knowledge(topic, student_message, top_k=top_k)
    
    if not results:
        return {
            "should_retrieve": False,
            "similarity": 0.0,
            "results": []
        }

    # Extract similarity scores
    similarities = [item["similarity"] for item in results]
    best_similarity = max(similarities) if similarities else 0.0

    # Gate Decision
    should_retrieve = best_similarity >= KNOWLEDGE_THRESHOLD

    retrieved_results = []
    if should_retrieve:
        for item in results:
            if item["similarity"] >= KNOWLEDGE_THRESHOLD:
                retrieved_results.append({
                    "document": item["content"],
                    "similarity": round(item["similarity"], 4)
                })

    # Logger for developer testing
    print(
        f"[Curio Knowledge Gate] topic={topic} "
        f"similarity={round(best_similarity, 4)} "
        f"used={should_retrieve}"
    )

    return {
        "should_retrieve": should_retrieve,
        "similarity": round(best_similarity, 4),
        "results": retrieved_results
    }
