
import React, { useState } from 'react';

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

  if (!selectedQuiz) {
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
        <h2>Quizzes</h2>
        <div className="quiz-list">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="quiz-card">
              <h3>{quiz.title}</h3>
              <p>{quiz.description}</p>
              <p>{quiz.questions.length} Questions</p>
              <button onClick={() => startQuiz(quiz)}>Start</button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (showResult) {
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
        <h2>{selectedQuiz.title} - Results</h2>
        <p>Your Score: {getScore()} / {selectedQuiz.questions.length}</p>
        <button onClick={() => setSelectedQuiz(null)}>Back to Quizzes</button>
      </div>
    );
  }

  const q = selectedQuiz.questions[currentQ];
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
      <h2>{selectedQuiz.title}</h2>
      <p>{q.q}</p>
      <div className="answers">
        {q.a.map((ans, idx) => (
          <button key={idx} onClick={() => answerQuestion(idx)}>{ans}</button>
        ))}
      </div>
      <p>Question {currentQ + 1} of {selectedQuiz.questions.length}</p>
    </div>
  );
};

export default Quiz;
