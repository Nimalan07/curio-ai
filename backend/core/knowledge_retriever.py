from core.knowledge_gate import check_knowledge_relevance

def build_retrieval_query(messages: list[dict], latest_message: str) -> str:
    """
    Compiles recent conversation logs with the student's latest message
    to form a rich, context-aware query for similarity matching.
    """
    recent_messages = messages[-6:] if messages else []
    
    # Exclude system/assistant metadata to focus on learning statements
    user_context = [
        f"{m['role']}: {m['content']}" 
        for m in recent_messages 
        if m.get("role") in ["user", "assistant"]
    ]
    
    conversation_context = "\n".join(user_context)
    
    return (
        f"Topic conversation context:\n{conversation_context}\n\n"
        f"Latest student statement:\n{latest_message}\n\n"
        "Retrieve factual knowledge matching this discussion."
    )

def get_relevant_knowledge(topic: str, student_message: str, messages: list[dict] = None, top_k: int = 3) -> dict:
    """
    Checks the semantic knowledge gate and retrieves matching chunks.
    """
    if messages is None:
        messages = []
        
    retrieval_query = build_retrieval_query(messages, student_message)
    
    gate_result = check_knowledge_relevance(topic, retrieval_query, top_k=top_k)
    
    if not gate_result["should_retrieve"]:
        return {
            "used": False,
            "similarity": gate_result["similarity"],
            "context": "",
            "sources": []
        }
        
    context_parts = []
    sources = []
    
    for result in gate_result["results"]:
        document = result["document"]
        similarity = result["similarity"]
        
        context_parts.append(
            f"[Knowledge relevance: {similarity}]\n{document}"
        )
        sources.append({
            "similarity": similarity,
            "document": document
        })
        
    context = "\n\n".join(context_parts)
    
    return {
        "used": True,
        "similarity": gate_result["similarity"],
        "context": context,
        "sources": sources
    }
