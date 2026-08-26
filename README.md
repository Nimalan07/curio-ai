# ExplainBack Backend

ExplainBack is an educational AI prototype designed to learn by being taught. The backend is built using FastAPI, Pydantic, and Ollama (running Llama 3.1 8B).

## Features
- **Curious Student Persona**: The AI plays the role of a curious learner who asks probing questions to expose gaps/misconceptions in the student's explanations.
- **Strict JSON Reports**: At the end of the session (min 3 turns), the transcript is analyzed by a separate assessment engine that generates a structured JSON report mapping clarity, completeness, accuracy, and depth.
- **In-Memory Session Manager**: Keeps track of active transcripts and turns without requiring state on the client side.
- **Correction Retry Flow**: Includes a validation and retry agent that automatically catches invalid JSON responses from Ollama and requests corrections.

## Directory Structure
```text
explainback/
└── backend/
    ├── main.py                # FastAPI server and endpoints
    ├── config.py              # Server configurations
    ├── ollama_client.py       # Ollama low-level client
    ├── student_agent.py       # Conversational agent wrapper
    ├── report_generator.py    # Report agent coordinator
    ├── session_manager.py     # Memory state manager
    ├── requirements.txt       # Requirements file
    │
    ├── prompts/
    │   ├── student_persona.txt
    │   └── report_analysis.txt
    │
    └── utils/
        └── json_parser.py
```

## Getting Started

1. Ensure Ollama is running and Llama 3.1 8B is pulled:
   ```bash
   ollama serve
   ollama pull llama3.1:8b
   ```

2. Run the FastAPI development server:
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload --port 8000
   ```

3. Open Swagger UI to test:
   [http://localhost:8000/docs](http://localhost:8000/docs)
