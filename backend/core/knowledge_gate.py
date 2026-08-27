def should_retrieve_knowledge(topic: str, message: str) -> bool:
    """
    Knowledge Gate: Determines whether we should perform a knowledge base search.
    Prevents search for simple greetings, short confirmations, or conversational filler.
    """
    cleaned = message.lower().strip()
    
    # Conversational filler words
    fillers = {
        "hi", "hello", "hey", "yes", "no", "ok", "okay", "sure", 
        "thanks", "thank you", "help", "ready", "start", "agree"
    }
    
    # Do not retrieve for short answers or basic fillers
    if len(cleaned) < 15 or cleaned in fillers:
        return False
        
    return True
