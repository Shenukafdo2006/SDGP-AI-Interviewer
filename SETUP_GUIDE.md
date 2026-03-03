# SDGP AI Interviewer - Setup Guide

## Overview
This is a full-stack AI interview platform using Gemini API with facial recognition capabilities.

**Architecture:**
- **Frontend**: React + Vite (port 5173)
- **Backend**: Node.js + Express (port 5001)
- **AI Service**: Python + FastAPI with Gemini API (port 8000)

---

## Prerequisites

### 1. Get Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy your API key

### 2. Install Required Software
- **Node.js** 18+ (check: `node --version`)
- **Python** 3.9+ (check: `python3 --version`)
- **Git** (already done)

---

## Installation & Setup

### Step 1: AI Service (Python + Gemini)

```bash
# Navigate to ai-service
cd ai-service

# Create .env file
cp .env.example .env

# Edit .env and add your Gemini API key
# GEMINI_API_KEY=your_api_key_here
nano .env  # or use your editor
```

**Start AI Service:**
```bash
# Option 1: Using start script (recommended)
chmod +x start.sh
./start.sh

# Option 2: Manual
python3 -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

✅ Server running at: http://localhost:8000

---

### Step 2: Backend (Node.js)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env if needed (set FASTAPI_BASE_URL correctly)
# FASTAPI_BASE_URL=http://localhost:8000
```

**Start Backend:**
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

✅ Server running at: http://localhost:5001

---

### Step 3: Frontend (React)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ App running at: http://localhost:5173

---

## Running All Services

### Option 1: Separate Terminals

**Terminal 1 - AI Service:**
```bash
cd ai-service
./start.sh
# or: source venv/bin/activate && uvicorn app:app --port 8000 --reload
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm run dev
```

### Option 2: One Terminal (Background Processes - macOS/Linux)

```bash
# Start all in background
(cd ai-service && source venv/bin/activate && uvicorn app:app --port 8000) &
(cd backend && npm run dev) &
(cd frontend && npm run dev) &

# View running processes
jobs

# Kill all processes
pkill -f "uvicorn\|node"
```

---

## API Endpoints

### AI Service (http://localhost:8000)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/` | GET | Health check |
| `/generate-question` | POST | Generate AI interview question |
| `/evaluate-answer` | POST | Evaluate and score answer |
| `/analyze-facial-expression` | POST | Analyze facial expressions & engagement |
| `/get-interview-feedback` | POST | Generate comprehensive feedback |

### Backend (http://localhost:5001)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/interview/start` | POST | Start interview session |
| `/api/interview/answer` | POST | Submit answer to question |
| `/api/interview/:sessionId` | GET | Get session details |
| `/api/user/:userId` | GET | Get user stats & achievements |

---

## Environment Variables

### AI Service (.env)
```
GEMINI_API_KEY=your_gemini_api_key
FASTAPI_PORT=8000
FASTAPI_HOST=0.0.0.0
```

### Backend (.env)
```
PORT=5001
FASTAPI_BASE_URL=http://localhost:8000
FIREBASE_SERVICE_ACCOUNT_PATH=../serviceAccountKey.json
```

---

## Troubleshooting

### "GEMINI_API_KEY environment variable not set"
- Check `.env` file exists in `ai-service/`
- Verify API key is correctly set
- Restart AI service after updating .env

### Backend can't connect to AI service
- Verify AI service is running on port 8000
- Check `FASTAPI_BASE_URL` in backend `.env`
- Try: `curl http://localhost:8000/` to test

### Frontend API calls failing
- Check vite.config.js proxy settings
- Backend should be running on port 5001
- Check browser console for CORS errors

### Python/Node dependencies issues
- Delete `venv/` or `node_modules/` and reinstall
- `pip install --upgrade -r requirements.txt`
- `npm install --force` (if needed)

---

## Next Steps

1. ✅ Set up all services
2. ✅ Get Gemini API key
3. ✅ Test each service independently
4. 🎯 Integrate facial recognition in LiveInterview component
5. 🎯 Connect aiInterviewController to AI service
6. 🎯 Add interview results display

---

## Key Features to Implement

- [ ] Real AI question generation (using Gemini)
- [ ] Answer evaluation with scoring
- [ ] Facial expression analysis during interview
- [ ] Interview feedback report
- [ ] Session persistence to database
- [ ] User progress tracking
