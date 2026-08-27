from rag.vector_store import query_vector_store

def retrieve_knowledge_context(topic: str, query: str, top_k: int = 2) -> str:
    """
    Searches the knowledge base for relevant facts and formats them as system context.
    """
    matched_chunks = query_vector_store(topic, query, top_k)
    
    if not matched_chunks:
        return ""
        
    context_lines = []
    for idx, chunk in enumerate(matched_chunks):
        context_lines.append(f"- {chunk['content']}")
        
    context_block = "\n".join(context_lines)
    return (
        "\n--- RETRIEVED GROUND-TRUTH KNOWLEDGE ---\n"
        "Here are verified facts about the topic. Use these internally to verify the student's "
        "statements and guide your questioning, but do not lecture or output these directly:\n"
        f"{context_block}\n"
        "-----------------------------------------\n"
    )
