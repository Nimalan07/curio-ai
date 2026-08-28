# Curio — Teach the AI

Curio is an educational active learning platform where students learn by explaining concepts to an AI student. 

Instead of quizzing you, Curio asks you to teach.

## Features
- **Aether-Inspired Premium SaaS UI**: A clean, editorial-style navy/white interface with green/blue accents, smooth hover animations, and elegant card sections.
- **Confidence Gap Evaluation**: Before a session, students rate their confidence (1-10). Curio compares this rating with the demonstrated clarity, completeness, accuracy, and depth to map the *Confidence Gap*.
- **"Why I Asked This" Transparency**: Collapsible reasoning blocks showing exactly what gap or contradiction in the student's explanation triggered the AI's question.
- **AI Thinking Animation**: Dynamic bouncing indicator rendering active typing states.
- **Understanding Radar Chart**: Interactive recharts visualization mapping cognitive structures.
- **Offline Report Card Download**: Instant canvas rendering to download your report card as a PNG with a single click.

---

## Directory Structure

```text
curio/
│
├── README.md
├── requirements.txt
├── .gitignore
│
├── backend/
│   ├── main.py
│   ├── config.py
│   │
│   ├── core/
│   │   ├── __init__.py
│   │   ├── ollama_client.py
│   │   ├── student_agent.py
│   │   ├── report_generator.py
│   │   └── session_manager.py
│   │
│   ├── prompts/
│   │   ├── student_persona.txt
│   │   └── report_analysis.txt
│   │
│   └── utils/
│       ├── json_parser.py
│       └── validators.py
│
├── frontend/
│   ├── package.json
│   ├── index.html
│   │
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── App.css
│       │
│       ├── api/
│       │   └── curioApi.js
│       │
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── ThinkingIndicator.jsx
│       │   ├── ConfidenceSlider.jsx
│       │   ├── ChatMessage.jsx
│       │   ├── ChatInput.jsx
│       │   ├── ProgressBar.jsx
│       │   ├── RadarChart.jsx
│       │   └── ReportDownload.jsx
│       │
│       └── pages/
│           ├── Home.jsx
│           ├── TopicSelector.jsx
│           ├── Teach.jsx
│           └── Results.jsx
│
└── data/
    └── sample_sessions/
        └── photosynthesis_demo.json
```

---

## Getting Started

### 1. Start Ollama
Ensure Ollama is running and Llama 3.1 8B is installed:
```bash
ollama serve
ollama pull llama3.1:8b
```

### 2. Start the Backend API
From the root directory:
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
Test that the backend is alive: [http://localhost:8000/api/health](http://localhost:8000/api/health)

### 3. Start the Frontend
From the root directory, open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.
