# 🚀 Quick Start Checklist

## Phase 1: Initial Setup (5 min)

- [ ] Get Gemini API Key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- [ ] Extract the API key and keep it handy

## Phase 2: Configure AI Service (3 min)

```bash
# Navigate to ai-service
cd ai-service

# Create .env file
cp .env.example .env

# Edit .env and add your key
# Open .env and set: GEMINI_API_KEY=your_api_key_here
```

## Phase 3: Run AI Service (2 min)

```bash
# Option A: Automatic (Recommended)
cd ai-service
chmod +x start.sh
./start.sh

# Option B: Manual
cd ai-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --port 8000 --reload
```

✅ Should see: `Uvicorn running on http://127.0.0.1:8000`

Test it: `curl http://localhost:8000/`

## Phase 4: Configure & Run Backend (2 min)

```bash
# Open new terminal
cd backend

# Create .env (just copy or verify defaults)
cp .env.example .env

# Install dependencies (if not done)
npm install

# Start backend
npm run dev
```

✅ Should see: `Server running on http://localhost:5001`

## Phase 5: Run Frontend (1 min)

```bash
# Open new terminal
cd frontend

# Install dependencies (if not done)
npm install

# Start frontend
npm run dev
```

✅ Should see: `Local: http://localhost:5173/`

## Phase 6: Test Full Flow (5 min)

1. Open http://localhost:5173 in browser
2. Click "Interview Training"
3. Select:
   - Role: "Software Engineer"
   - Interview Type: "Technical"
   - Level: "Mid Level"
4. Click "Start Interview"
5. You should see an **AI-generated question** (not hardcoded!)
6. Type an answer in the text box
7. Click "Submit" or next
8. You should see a **score and feedback from Gemini**

## Phase 7: Fix LiveInterview (Next)

See [GEMINI_INTEGRATION.md](GEMINI_INTEGRATION.md) - "Still Need to Complete" section

---

## Troubleshooting

### AI Service won't start
```bash
# Check Python version
python3 --version  # Should be 3.9+

# Try fresh venv
rm -rf ai-service/venv
cd ai-service
source venv/bin/activate
pip install -r requirements.txt
```

### "ModuleNotFoundError: No module named 'google'"
```bash
cd ai-service
source venv/bin/activate
pip install google-generativeai
```

### Backend can't connect to AI Service
- Check AI Service is running on port 8000
- Run: `curl http://localhost:8000/`
- If fails, check `.env` in ai-service has valid GEMINI_API_KEY

### Frontend shows errors
- Open browser dev console (F12)
- Check network tab
- Make sure backend on 5001, AI service on 8000
- Check proxy in vite.config.js points to 5001

### Port already in use
```bash
# Kill process on port
macOS/Linux: lsof -ti:8000 | xargs kill -9
Windows: netstat -ano | findstr :8000
```

---

## Files to Keep Ready

1. **Gemini API Key** - Copy from Google AI Studio
2. **SETUP_GUIDE.md** - Full documentation
3. **GEMINI_INTEGRATION.md** - Technical details
4. **This file** - Quick reference

---

## Next Steps After Testing

1. ✅ Basic interview flow working (read GEMINI_INTEGRATION.md)
2. Update `InterviewTraining.jsx` to pass `interviewType`
3. Connect `LiveInterview.jsx` to API + facial recognition
4. Create `InterviewResults.jsx` component
5. Add facial analysis proxy endpoint
6. Save results to Firebase/Database

See **GEMINI_INTEGRATION.md** for detailed implementation guides.

---

**Estimated time to basic working demo: 15-20 minutes**
