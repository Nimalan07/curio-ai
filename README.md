# Curio — Teach the AI

Curio is an educational active learning platform where students learn by explaining concepts to an AI student. 

Instead of quizzing you, Curio asks you to teach.

## Features
- **Aether-Inspired Premium SaaS UI**: A clean, editorial-style navy/white interface with green/blue accents, smooth hover animations, and elegant card sections.
- **Secure Google Authentication & User Accounts**: Support for traditional credentials and seamless Google Sign-In with persistent JWT authentication.
- **Adaptive Difficulty Control**: Curio dynamically adjusts question complexity across 5 cognitive levels (Basic, Clarifying, Application, Deep Reasoning, Transfer) based on answer quality and confidence. Users can also manually override the level using the visual tracker.
- **Speech-to-Text Voice Input**: Explain concepts hands-free. Built-in microphone support transcripts your explanation in real-time using the native Web Speech API.
- **"Why I Asked This" Transparency**: Collapsible reasoning blocks showing exactly what gap, contradiction, or pattern in the student's explanation prompted Curio's response.
- **Understanding Radar Chart & Metrics**: Recharts-based radar visualization and progress bars mapping four core dimensions of understanding: Clarity, Completeness, Accuracy, and Depth.
- **AI Misconception Detection**: Automatically flags incorrect assumptions, provides direct evidence from what you said, assigns severity ratings, and links suggested concepts to review.
- **Interactive Teach-Back Analysis**: Compare your explanation directly with an ideal concept explanation to see what you covered well and what was missing.
- **Telemetry & Growth Dashboard**: An interactive Line Chart tracking your overall understanding score trends over consecutive sessions to visualize your growth.
- **Offline Report Card Download**: Instantly render and download your personalized report card as a high-quality PNG with one click.

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
│   ├── auth.py
│   ├── config.py
│   │
│   ├── core/
│   │   ├── __init__.py
│   │   ├── adaptive_engine.py
│   │   ├── database.py
│   │   ├── knowledge_gate.py
│   │   ├── knowledge_retriever.py
│   │   ├── misconception_detector.py
│   │   ├── ollama_client.py
│   │   ├── report_generator.py
│   │   ├── session_manager.py
│   │   ├── student_agent.py
│   │   └── teach_back.py
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
│       │   ├── AdaptiveDifficulty.jsx
│       │   ├── ChatInput.jsx
│       │   ├── ChatMessage.jsx
│       │   ├── ChatWindow.jsx
│       │   ├── ConfidenceSlider.jsx
│       │   ├── GrowthDashboard.jsx
│       │   ├── Loading.jsx
│       │   ├── MisconceptionPatterns.jsx
│       │   ├── Navbar.jsx
│       │   ├── ProgressBar.jsx
│       │   ├── RadarChart.jsx
│       │   ├── ReportDownload.jsx
│       │   ├── TeachBack.jsx
│       │   ├── ThinkingIndicator.jsx
│       │   └── VoiceInput.jsx
│       │
│       └── pages/
│           ├── Dashboard.jsx
│           ├── Home.jsx
│           ├── Login.jsx
│           ├── Login.css
│           ├── Results.jsx
│           ├── Teach.jsx
│           └── TopicSelector.jsx
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
