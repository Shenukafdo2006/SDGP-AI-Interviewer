from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import os
from dotenv import load_dotenv
import base64
import json
import re

# Load environment variables
load_dotenv()

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable not set")

genai.configure(api_key=GEMINI_API_KEY)

TEXT_MODEL = os.getenv("GEMINI_TEXT_MODEL", "gemini-1.5-flash")
VISION_MODEL = os.getenv("GEMINI_VISION_MODEL", TEXT_MODEL)

app = FastAPI(title="AI Interview Service", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class QuestionRequest(BaseModel):
    role: str
    level: str
    interview_type: str
    session_context: dict = {}

class AnswerRequest(BaseModel):
    question: str
    answer: str
    role: str
    level: str

class FacialAnalysisRequest(BaseModel):
    frame_base64: str  # Base64 encoded image frame
    question: str = None

class CVAnalysisRequest(BaseModel):
    cv_content: str

# System prompts for different interview types
SYSTEM_PROMPTS = {
    "Technical": """You are an expert technical interviewer. Generate challenging technical questions 
    appropriate for the candidate's level. Focus on core concepts, problem-solving, and system design.""",
    
    "Behavioural": """You are an expert behavioral interviewer. Generate questions that assess 
    communication skills, teamwork, conflict resolution, and professional growth.""",
    
    "Soft Skills": """You are an expert in soft skills assessment. Generate questions to evaluate 
    communication, leadership, time management, and interpersonal skills.""",
    
    "Mixed": """You are a comprehensive interviewer. Generate a mix of technical and behavioral questions 
    appropriate for the candidate's level and target role."""
}

def _extract_json_object(response_text: str, fallback: dict):
    """
    Gemini may return plain JSON, fenced JSON, or explanatory text around JSON.
    Extract and parse the first JSON object safely.
    """
    text = (response_text or "").strip()

    if text.startswith("```"):
        text = re.sub(r"^```[a-zA-Z]*\n?", "", text)
        text = re.sub(r"\n?```$", "", text).strip()

    try:
        parsed = json.loads(text)
        if isinstance(parsed, dict):
            return parsed
    except json.JSONDecodeError:
        pass

    match = re.search(r"\{[\s\S]*\}", text)
    if match:
        try:
            parsed = json.loads(match.group(0))
            if isinstance(parsed, dict):
                return parsed
        except json.JSONDecodeError:
            pass

    return fallback

def _parse_engagement_level(value, default=5):
    try:
        numeric = int(value)
    except (TypeError, ValueError):
        numeric = default
    return min(max(numeric, 1), 10)

def _parse_percentage(value, default=0):
    try:
        numeric = int(round(float(value)))
    except (TypeError, ValueError):
        numeric = default
    return min(max(numeric, 0), 100)

@app.get("/")
def home():
    return {
        "message": "AI Interview Service Running",
        "version": "1.0.0",
        "capabilities": ["question-generation", "answer-evaluation", "facial-recognition"],
        "models": {
            "text": TEXT_MODEL,
            "vision": VISION_MODEL,
        },
    }

@app.post("/generate-question")
async def generate_question(request: QuestionRequest):
    """Generate AI-powered interview questions using Gemini"""
    try:
        model = genai.GenerativeModel(TEXT_MODEL)
        
        system_prompt = SYSTEM_PROMPTS.get(request.interview_type, SYSTEM_PROMPTS["Mixed"])
        
        context = request.session_context or {}
        previous_questions = context.get("previousQuestions", [])
        user_prompt = f"""
        Generate a single interview question for the following:
        - Target Role: {request.role}
        - Experience Level: {request.level}
        - Interview Type: {request.interview_type}
        
        Requirements:
        1. Question should be specific and challenging for this level
        2. Should take 2-3 minutes to answer
        3. Should assess relevant skills
        4. It MUST be different from all previous questions
        5. Return ONLY the question, no numbering, labels, quotes, or extra text
        
        Context: {json.dumps(context) if context else "First question of the interview"}
        Previously asked questions (do not repeat or paraphrase too closely): {json.dumps(previous_questions)}
        """
        
        response = model.generate_content(f"{system_prompt}\n\n{user_prompt}")
        question = response.text.strip().strip('"').strip("'")
        question = re.sub(r"^\s*\d+[\).\s-]+", "", question).strip()
        
        return {
            "question": question,
            "role": request.role,
            "level": request.level,
            "interview_type": request.interview_type
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating question: {str(e)}")

@app.post("/evaluate-answer")
async def evaluate_answer(request: AnswerRequest):
    """Evaluate candidate answer using Gemini with detailed feedback"""
    try:
        model = genai.GenerativeModel(TEXT_MODEL)
        
        eval_prompt = f"""
        You are an expert interviewer evaluating a candidate's response.
        
        Question: {request.question}
        Candidate's Answer: {request.answer}
        Role: {request.role}
        Level: {request.level}
        
        Please evaluate this answer and provide:
        1. Score (0-10)
        2. Strengths (2-3 points)
        3. Areas for improvement (2-3 points)
        4. Brief constructive feedback
        
        Format your response as JSON with keys: score, strengths, improvements, feedback
        """
        
        response = model.generate_content(eval_prompt)
        response_text = response.text.strip()
        evaluation = _extract_json_object(
            response_text,
            {
                "score": 7,
                "strengths": ["Clear response"],
                "improvements": ["More detail could help"],
                "feedback": response_text,
            },
        )
        
        return {
            "score": min(max(evaluation.get("score", 7), 0), 10),
            "strengths": evaluation.get("strengths", []),
            "improvements": evaluation.get("improvements", []),
            "feedback": evaluation.get("feedback", ""),
            "question": request.question
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error evaluating answer: {str(e)}")

@app.post("/analyze-cv")
async def analyze_cv(request: CVAnalysisRequest):
    """Analyze CV/resume content using Gemini and return structured scoring"""
    try:
        cv_content = (request.cv_content or "").strip()
        if not cv_content:
            raise HTTPException(status_code=400, detail="cv_content is required")

        model = genai.GenerativeModel(TEXT_MODEL)

        prompt = f"""
        You are an expert CV and resume reviewer.
        Analyze the following CV and return ONLY a JSON object with this exact structure:
        {{
          "overall": <number 0-100>,
          "completeness": <number 0-100>,
          "formatting": <number 0-100>,
          "readability": <number 0-100>,
          "skillsScore": <number 0-100>,
          "atsScore": <number 0-100>,
          "keywordDensity": <number 0-100>,
          "experienceImpact": <number 0-100>,
          "personalization": <number 0-100>,
          "sectionHealth": [
            {{"section": "Contact Info", "score": <number>, "status": "good"|"warning"|"poor"}},
            {{"section": "Summary", "score": <number>, "status": "good"|"warning"|"poor"}},
            {{"section": "Experience", "score": <number>, "status": "good"|"warning"|"poor"}},
            {{"section": "Education", "score": <number>, "status": "good"|"warning"|"poor"}},
            {{"section": "Skills", "score": <number>, "status": "good"|"warning"|"poor"}},
            {{"section": "Projects", "score": <number>, "status": "good"|"warning"|"poor"}}
          ],
          "feedback": [
            {{"type": "success"|"warning"|"info", "message": "<specific feedback>"}},
            {{"type": "success"|"warning"|"info", "message": "<specific feedback>"}},
            {{"type": "success"|"warning"|"info", "message": "<specific feedback>"}},
            {{"type": "success"|"warning"|"info", "message": "<specific feedback>"}},
            {{"type": "success"|"warning"|"info", "message": "<specific feedback>"}}
          ],
          "topStrengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
          "topImprovements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"]
        }}

        Important rules:
        - Return JSON only
        - Keep scores realistic and internally consistent
        - Use concise, actionable feedback
        - If a section is missing, score it lower instead of inventing content

        CV:
        {cv_content[:3000]}
        """

        response = model.generate_content(prompt)
        parsed = _extract_json_object(
            response.text.strip(),
            {
                "overall": 70,
                "completeness": 70,
                "formatting": 70,
                "readability": 70,
                "skillsScore": 70,
                "atsScore": 70,
                "keywordDensity": 70,
                "experienceImpact": 70,
                "personalization": 70,
                "sectionHealth": [],
                "feedback": [],
                "topStrengths": [],
                "topImprovements": [],
            },
        )

        for field in [
            "overall",
            "completeness",
            "formatting",
            "readability",
            "skillsScore",
            "atsScore",
            "keywordDensity",
            "experienceImpact",
            "personalization",
        ]:
            parsed[field] = _parse_percentage(parsed.get(field, 70), 70)

        section_health = parsed.get("sectionHealth", [])
        if not isinstance(section_health, list):
            section_health = []
        parsed["sectionHealth"] = [
            {
                "section": str(item.get("section", "Unknown")),
                "score": _parse_percentage(item.get("score", 0), 0),
                "status": item.get("status", "warning") if item.get("status") in ["good", "warning", "poor"] else "warning",
            }
            for item in section_health
            if isinstance(item, dict)
        ]

        feedback = parsed.get("feedback", [])
        if not isinstance(feedback, list):
            feedback = []
        parsed["feedback"] = [
            {
                "type": item.get("type", "info") if item.get("type") in ["success", "warning", "info"] else "info",
                "message": str(item.get("message", "")).strip(),
            }
            for item in feedback
            if isinstance(item, dict) and str(item.get("message", "")).strip()
        ]

        for field in ["topStrengths", "topImprovements"]:
            values = parsed.get(field, [])
            if not isinstance(values, list):
                values = []
            parsed[field] = [str(item).strip() for item in values if str(item).strip()]

        return parsed
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing CV: {str(e)}")

@app.post("/analyze-facial-expression")
async def analyze_facial_expression(request: FacialAnalysisRequest):
    """Analyze facial expressions and engagement during interview using Gemini Vision"""
    try:
        # Validate base64 input early
        base64.b64decode(request.frame_base64, validate=True)
        
        # Use Gemini Vision to analyze the image
        model = genai.GenerativeModel(VISION_MODEL)
        
        analysis_prompt = f"""
        Analyze this image of an interview candidate and provide:
        1. Detected facial expression (e.g., focused, confused, stressed, confident)
        2. Eye contact assessment (looking at camera/away)
        3. Engagement level (1-10)
        4. Any concerns or observations
        5. Posture/body language observations
        
        Format as JSON with keys: expression, eye_contact, engagement_level, concerns, posture
        
        {f"Current question: {request.question}" if request.question else ""}
        """
        
        image_part = {
            "mime_type": "image/jpeg",
            "data": request.frame_base64
        }
        
        response = model.generate_content([analysis_prompt, image_part])
        response_text = response.text.strip()
        analysis = _extract_json_object(
            response_text,
            {
                "expression": "neutral",
                "eye_contact": "unknown",
                "engagement_level": 5,
                "concerns": [],
                "posture": "normal",
            },
        )
        
        return {
            "expression": analysis.get("expression", "neutral"),
            "eye_contact": analysis.get("eye_contact", "unknown"),
            "engagement_level": _parse_engagement_level(analysis.get("engagement_level", 5)),
            "concerns": analysis.get("concerns", []),
            "posture": analysis.get("posture", "normal"),
            "timestamp": None
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing facial expression: {str(e)}")

@app.post("/get-interview-feedback")
async def get_interview_feedback(session_data: dict):
    """Generate comprehensive interview feedback using Gemini"""
    try:
        model = genai.GenerativeModel(TEXT_MODEL)
        
        feedback_prompt = f"""
        Provide comprehensive interview feedback based on this session:
        
        Role: {session_data.get('role')}
        Level: {session_data.get('level')}
        Interview Type: {session_data.get('interview_type')}
        
        Q&A Summary:
        {json.dumps(session_data.get('qa_pairs', []), indent=2)}
        
        Overall Assessment:
        Average Score: {session_data.get('average_score', 0)}/10
        
        Please provide:
        1. Overall performance summary
        2. Key strengths demonstrated
        3. Areas needing improvement
        4. 3-5 specific action items for improvement
        5. Recommended next steps
        
        Format as JSON with keys: summary, strengths, improvements, action_items, next_steps
        """
        
        response = model.generate_content(feedback_prompt)
        response_text = response.text.strip()
        feedback = _extract_json_object(response_text, {"summary": response_text})
        
        return feedback
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating feedback: {str(e)}")
