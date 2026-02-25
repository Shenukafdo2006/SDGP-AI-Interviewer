import "./Quiz.css";
import React, { useState, useMemo } from "react";

const quizzes = [
  {
    id: 1,
    title: "JavaScript Fundamentals",
    description: "Introduction to JavaScript",
    questions: [
      {
        q: "What is a closure?",
        a: [
          "A function with preserved scope",
          "A CSS property",
          "A type of loop",
          "An object",
        ],
        correct: 0,
      },
      {
        q: "Which keyword declares a variable?",
        a: ["var", "let", "const", "all of the above"],
        correct: 3,
      },
      {
        q: "What does === mean?",
        a: [
          "Equal value",
          "Equal value and type",
          "Assignment operator",
          "Comparison only",
        ],
        correct: 1,
      },
      {
        q: "Which method converts JSON to object?",
        a: [
          "JSON.parse()",
          "JSON.stringify()",
          "JSON.convert()",
          "JSON.toObject()",
        ],
        correct: 0,
      },
      {
        q: "Which array method adds element to end?",
        a: ["push()", "pop()", "shift()", "unshift()"],
        correct: 0,
      },
      {
        q: "Which keyword is used for asynchronous handling?",
        a: ["async/await", "delay", "promiseOnly", "wait()"],
        correct: 0,
      },
      {
        q: "What is typeof null?",
        a: ["null", "object", "undefined", "string"],
        correct: 1,
      },
      {
        q: "Which loop runs at least once?",
        a: ["for", "while", "do...while", "foreach"],
        correct: 2,
      },
      {
        q: "Which symbol is used for single-line comments?",
        a: ["//", "/* */", "#", "<!-- -->"],
        correct: 0,
      },
      {
        q: "Which method removes last array element?",
        a: ["pop()", "push()", "shift()", "remove()"],
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
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const startQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQ(0);
    setAnswers([]);
    setShowResult(false);
  };

  const answerQuestion = (idx) => {
    if (isAnswered) return;

    setSelectedAnswer(idx);
    setIsAnswered(true);
    setAnswers((prev) => [...prev, idx]);

    setTimeout(() => {
      if (currentQ + 1 < selectedQuiz.questions.length) {
        setCurrentQ((prev) => prev + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  const score = useMemo(() => {
    if (!selectedQuiz) return 0;
    return answers.filter(
      (a, i) => a === selectedQuiz.questions[i]?.correct
    ).length;
  }, [answers, selectedQuiz]);

  const totalQuestions = selectedQuiz?.questions.length || 0;

  const progress =
    selectedQuiz && totalQuestions > 0
      ? Math.round(((currentQ + 1) / totalQuestions) * 100)
      : 0;

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setCurrentQ(0);
    setAnswers([]);
    setShowResult(false);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  const restartQuiz = () => {
    setCurrentQ(0);
    setAnswers([]);
    setShowResult(false);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

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
              Your Score: {score} / {totalQuestions}
            </p>
            <p>
              Accuracy: {Math.round((score / totalQuestions) * 100)}%
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
                {selectedQuiz.questions[currentQ].a.map((ans, idx) => {
                  const correctIndex =
                    selectedQuiz.questions[currentQ].correct;

                  let className = "answer-btn";

                  if (isAnswered) {
                    if (idx === correctIndex) {
                      className += " correct";
                    } else if (idx === selectedAnswer) {
                      className += " wrong";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      className={className}
                      onClick={() => answerQuestion(idx)}
                      disabled={isAnswered}
                    >
                      {ans}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;