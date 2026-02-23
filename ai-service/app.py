from fastapi import FastAPI
import random

app = FastAPI()

questions = [
    "Explain OOP.",
    "What is polymorphism?",
    "Difference between REST and GraphQL?",
    "Explain database normalization."
]

@app.get("/")
def home():
    return {"message": "AI Service Running"}

@app.post("/generate-question")
def generate_question():
    return {"question": random.choice(questions)}

@app.post("/evaluate-answer")
def evaluate_answer(data: dict):
    answer = data.get("answer", "")
    score = min(len(answer)/20, 10)

    return {
        "score": round(score,1),
        "feedback": "Good answer" if score > 5 else "Try adding more detail"
    }