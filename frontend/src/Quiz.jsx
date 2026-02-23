
import "./Quiz.css";
import React, { useState } from "react";

const quizzes = [
  {
    id: 1,
    title: 'JavaScript Fundamentals',
    description: 'Introduction to javascript',
    questions: [
      { q: 'What is a closure?', a: ['A function with preserved scope', 'A CSS property', 'A type of loop'], correct: 0 },
      { q: 'Which keyword declares a variable?', a: ['var', 'let', 'const', 'all of the above'], correct: 3 },
    ],
  },
  {
    id: 2,
    title: 'React Fundamentals',
    description: 'Introduction to React',
    questions: [
      { q: 'What is a React hook?', a: ['A lifecycle method', 'A function for state/side effects', 'A CSS selector'], correct: 1 },
      { q: 'JSX stands for?', a: ['JavaScript XML', 'Java Syntax Extension', 'Just Simple X'], correct: 0 },
    ],
  },
  // ...add more quizzes as needed
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

  const getScore = () => {
    return answers.filter((a, i) => a === selectedQuiz.questions[i].correct).length;
  };

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

  const totalQuestions = selectedQuiz ? selectedQuiz.questions.length : 0;
  const progress = selectedQuiz
    ? Math.round((currentQ / totalQuestions) * 100)
    : 0;

  return (
    <div className="quiz-page">
      <header className="header">
        <div
          className="menu-icon"
          onClick={onBack}
          style={{ cursor: onBack ? "pointer" : "default" }}
        >
          ←
        </div>
        <div className="logo">📝</div>
      </header>

      <div className="quiz-container">
        <div className="quiz-hero">
          <h1 className="title">Skills Quiz</h1>
          <p className="subtitle">
            Challenge your knowledge with focused, career-ready questions
          </p>
          <div className="hero-stats">
            <div className="stat-chip">
              <span className="stat-label">Tracks</span>
              <span className="stat-value">6+</span>
            </div>
            <div className="stat-chip">
              <span className="stat-label">Avg Time</span>
              <span className="stat-value">5 min</span>
            </div>
            <div className="stat-chip">
              <span className="stat-label">Level</span>
              <span className="stat-value">Beginner</span>
            </div>
          </div>
        </div>

        {!selectedQuiz && (
          <section className="quiz-grid">
            {quizzes.map((quiz) => (
              <article key={quiz.id} className="quiz-card">
                <div className="quiz-card-top">
                  <h3>{quiz.title}</h3>
                  <span className="quiz-count">
                    {quiz.questions.length} Questions
                  </span>
                </div>
                <p className="quiz-desc">{quiz.description}</p>
                <div className="quiz-actions">
                  <button className="primary-btn" onClick={() => startQuiz(quiz)}>
                    Start Quiz
                  </button>
                  <button className="ghost-btn">Preview</button>
                </div>
              </article>
            ))}
          </section>
        )}

        {selectedQuiz && showResult && (
          <section className="quiz-result card">
            <div className="result-header">
              <h2>{selectedQuiz.title}</h2>
              <span className="result-badge">Completed</span>
            </div>
            <p className="result-score">
              Your Score: {getScore()} / {selectedQuiz.questions.length}
            </p>
            <div className="result-grid">
              <div className="result-item">
                <span className="result-label">Accuracy</span>
                <span className="result-value">
                  {Math.round((getScore() / selectedQuiz.questions.length) * 100)}%
                </span>
              </div>
              <div className="result-item">
                <span className="result-label">Questions</span>
                <span className="result-value">{selectedQuiz.questions.length}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Level</span>
                <span className="result-value">Foundational</span>
              </div>
            </div>
            <div className="result-actions">
              <button className="primary-btn" onClick={restartQuiz}>
                Try Again
              </button>
              <button className="ghost-btn" onClick={resetQuiz}>
                Browse Quizzes
              </button>
            </div>
          </section>
        )}

        {selectedQuiz && !showResult && (
          <section className="quiz-player card">
            <div className="player-header">
              <div>
                <h2>{selectedQuiz.title}</h2>
                <p className="player-subtitle">
                  Question {currentQ + 1} of {totalQuestions}
                </p>
              </div>
              <div className="player-meta">
                <span className="meta-pill">⚡ Fast Mode</span>
                <span className="meta-pill">🎯 Focused</span>
              </div>
            </div>

            <div className="progress-track" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>

            <div className="question-card">
              <h3>{selectedQuiz.questions[currentQ].q}</h3>
              <div className="answers-grid">
                {selectedQuiz.questions[currentQ].a.map((ans, idx) => (
                  <button key={idx} className="answer-btn" onClick={() => answerQuestion(idx)}>
                    {ans}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Quiz;
