Welcome to Ace.AI!

“Ace” your interviews with an AI-powered voice simulation.

Ace.AI is what you wish you had when preparing for interviews, both technical and behavioral. It helps users practice interviews in a realistic, conversational setting. Using AI for voice interaction and intelligent feedback, Ace.AI simulates realistic pressures encountered in interviews, and evaluates users on their performance with actionable insights.

--Features--
Voice Based Interviews: Practice interviews using real-time AI voice interaction powered by ElevenLabs.
Behavioral vs. Technical Mode: Simulates both behavioral and technical communication-style interviews.
Dynamic Questioning: AI adapts to your responses and asks relevant follow-ups like a real interviewer.
Automated Feedback and Scoring:
Get structured feedback on:
  - Clarity
  - Technical Accuracy
  - Communication
  - Overall Performance
Quick Performance and Fast, Real Time Experience: Low latency conversation with natural voice responses.

Tech Stack
Frontend:
React
Tailwind CSS
VAPI Voice API

Backend:
Node.js
Express
OpenAI API


APIs
VAPI (Voice agent, text to speech)
OpenAI (evaluation and feedback)

Setup Instructions

1. Clone the repository

git clone https://github.com/YOUR_USERNAME/ai-interviewer.git
cd ai-interviewer

Backend Setup
cd backend
npm install

Create a backend `.env` file (or set the following environment variables in your host):

OPENAI_API_KEY=your_openai_api_key
# OR (alternative) OPENROUTER_API_KEY=your_openrouter_api_key

# Optional / recommended server vars
OPENAI_MODEL=gpt-4o-mini
OPENAI_API_BASE=
OPENROUTER_BASE_URL=https://api.openrouter.ai/v1
VAPI_PRIVATE_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE=
PORT=3001
ALLOWED_ORIGINS=http://localhost:5173

You can use the included `.env.example` as a template — copy it to the repo root or to `backend/.env` and fill in your secrets.

Run the backend:

npm run dev

OpenRouter (optional)
If you prefer to use OpenRouter instead of OpenAI, set `OPENROUTER_API_KEY` in your backend environment (or in the repo `env.env`). The backend maps `OPENROUTER_API_KEY` → `OPENAI_API_KEY` automatically. Optionally override the base URL with `OPENROUTER_BASE_URL` (default: `https://api.openrouter.ai/v1`).

To run the backend with the debugger attached, the provided VS Code launch config sets `NODE_OPTIONS=--inspect=9229` for the backend run configuration. See the **VS Code Launch** section below.

Frontend Setup
cd frontend
npm install

Create a .env.local file:

NEXT_PUBLIC_ELEVENLABS_API_KEY=your_elevenlabs_api_key
Run the frontend:

npm run dev
Running the App
Frontend: http://localhost:3000
Backend: http://localhost:3001
 
VS Code Launch
This repo includes a `.vscode/launch.json` with three helpful configurations:
- `Backend: Run (dev)` — starts the backend dev server (`npm run dev`) with the Node inspector enabled on port 9229.
- `Backend: Attach` — attach the VS Code debugger to a backend process listening on port 9229.
- `Frontend: Run (Vite)` — starts the frontend dev server (`npm run dev`).

You can also use the compound `Start Full Stack (Backend + Frontend)` to start both dev servers from the Run view.
How It Works
User starts a mock interview
ElevenLabs agent conducts a voice-based interview
User responds via microphone
Transcript is processed
Backend evaluates responses using OpenAI
Structured feedback is returned and displayed
MVP Scope
Voice-based interview flow
5-question interview session
Basic feedback scoring system
Clean UI for interaction
Future Improvements
Advanced analytics dashboard
Role-specific interview tracks
Resume-based personalization
Live coding interview mode
Video + body language analysis

Team:
George Alenchery
Andriana Slisko
Lorenna Solis Rivera
Jackson Bryant

Built in under 48 hours as part of a hackathon challenge using ElevenLabs.


