import "./Quiz.css";
import React, { useState } from "react";

const quizzes = [
  {
    id: 1,
    title: "JavaScript Fundamentals",
    description: "Introduction to JavaScript",
    questions: [
      {
        q: "What is a closure?",
        a: ["A function with preserved scope", "A CSS property", "A type of loop"],
        correct: 0,
      },
      {
        q: "Which keyword declares a variable?",
        a: ["var", "let", "const", "all of the above"],
        correct: 3,
      },
    ],
  },
  {
    id: 2,
    title: "React Fundamentals",
    description: "Introduction to React",
    questions: [
      {
        q: "What is a React hook?",
        a: [
          "A lifecycle method",
          "A function for state/side effects",
          "A CSS selector",
        ],
        correct: 1,
      },
      {
        q: "JSX stands for?",
        a: ["JavaScript XML", "Java Syntax Extension", "Just Simple X"],
        correct: 0,
      },
    ],
  },
];

const Quiz = ({ onBack }) => {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);

  const startQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQ(0);
    setAnswers([]);
    setShowResult(false);
  };

  const answerQuestion = (idx) => {
    setAnswers([...answers, idx]);
    if (currentQ + 1 < selectedQuiz.questions.length) {
      setCurrentQ(currentQ + 1);
    } else {
      setShowResult(true);
    }
  };

  const getScore = () =>
    answers.filter((a, i) => a === selectedQuiz.questions[i].correct).length;

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setCurrentQ(0);
    setAnswers([]);
    setShowResult(false);
  };

  const restartQuiz = () => {
    setCurrentQ(0);
    setAnswers([]);
    setShowResult(false);
  };

  const totalQuestions = selectedQuiz?.questions.length || 0;
  const progress = selectedQuiz
    ? Math.round((currentQ / totalQuestions) * 100)
    : 0;

  return (
    <div className="quiz-page">
      <header className="header">
        <div className="menu-icon" onClick={onBack}>
          ←
        </div>
        <div className="logo">📝 Skills Quiz</div>
      </header>

      <div className="quiz-container">
        {!selectedQuiz && (
          <div className="quiz-grid">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="quiz-card">
                <h3>{quiz.title}</h3>
                <p>{quiz.description}</p>
                <span className="quiz-count">
                  {quiz.questions.length} Questions
                </span>
                <button
                  className="primary-btn"
                  onClick={() => startQuiz(quiz)}
                >
                  Start Quiz
                </button>
              </div>
            ))}
          </div>
        )}

        {selectedQuiz && showResult && (
          <div className="result-box">
            <h2>{selectedQuiz.title}</h2>
            <p>
              Your Score: {getScore()} / {selectedQuiz.questions.length}
            </p>
            <p>
              Accuracy:{" "}
              {Math.round(
                (getScore() / selectedQuiz.questions.length) * 100
              )}
              %
            </p>

            <div className="result-actions">
              <button className="primary-btn" onClick={restartQuiz}>
                Try Again
              </button>
              <button className="ghost-btn" onClick={resetQuiz}>
                Browse Quizzes
              </button>
            </div>
          </div>
        )}

        {selectedQuiz && !showResult && (
          <div className="quiz-player">
            <h2>{selectedQuiz.title}</h2>
            <p>
              Question {currentQ + 1} of {totalQuestions}
            </p>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="question-card">
              <h3>{selectedQuiz.questions[currentQ].q}</h3>
              <div className="answers">
                {selectedQuiz.questions[currentQ].a.map((ans, idx) => (
                  <button
                    key={idx}
                    className="answer-btn"
                    onClick={() => answerQuestion(idx)}
                  >
                    {ans}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;