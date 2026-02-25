import "./Quiz.css";
import React, { useState, useMemo, useEffect } from "react";

const quizzes = [
  {
    id: 1,
    title: "JavaScript Fundamentals",
    description: "Core JavaScript Concepts",
    difficulty: "Beginner",
    questions: [
      { q: "What is a closure?", a: ["Function with preserved scope", "CSS property", "Loop", "Object"], correct: 0 },
      { q: "Which declares a variable?", a: ["var", "let", "const", "All"], correct: 3 },
      { q: "=== means?", a: ["Equal value", "Equal value & type", "Assign", "Compare"], correct: 1 },
      { q: "Convert JSON to object?", a: ["JSON.parse()", "JSON.stringify()", "JSON.toObj()", "JSON.convert()"], correct: 0 },
      { q: "Add element to end?", a: ["push()", "pop()", "shift()", "unshift()"], correct: 0 },
      { q: "Remove last element?", a: ["pop()", "push()", "shift()", "delete()"], correct: 0 },
      { q: "typeof null?", a: ["null", "object", "undefined", "string"], correct: 1 },
      { q: "Loop runs at least once?", a: ["for", "while", "do...while", "foreach"], correct: 2 },
      { q: "Single line comment?", a: ["//", "/* */", "#", "<!-- -->"], correct: 0 },
      { q: "Async handling keyword?", a: ["async/await", "delay", "wait()", "promiseOnly"], correct: 0 },
    ],
  },
   {
    id: 2,
    title: "Java",
    description: "Core Java Concepts",
    difficulty: "Beginner",
    questions: [
      { q: "Which keyword is used to create a class?", a: ["class", "struct", "function", "object"], correct: 0 },
      { q: "Java is ___ language?", a: ["Compiled", "Interpreted", "Both", "None"], correct: 2 },
      { q: "Which method starts execution?", a: ["start()", "main()", "run()", "execute()"], correct: 1 },
      { q: "Primitive type for decimal?", a: ["int", "double", "String", "float"], correct: 1 },
      { q: "Inheritance keyword?", a: ["extend", "extends", "implements", "inherit"], correct: 1 },
      { q: "Java supports multiple inheritance via?", a: ["Class", "Interface", "Abstract", "Package"], correct: 1 },
      { q: "Access modifier for everything?", a: ["private", "public", "protected", "default"], correct: 1 },
      { q: "Default value of boolean?", a: ["true", "false", "0", "null"], correct: 1 },
      { q: "Loop until condition false?", a: ["for", "while", "do...while", "loop"], correct: 1 },
      { q: "Keyword for exception handling?", a: ["try", "catch", "throw", "All"], correct: 3 },
    ],
  },
  {
    id: 3,
    title: "HTML Basics",
    description: "Core HTML Concepts",
    difficulty: "Beginner",
    questions: [
      { q: "HTML stands for?", a: ["HyperText Markup Language", "HighText ML", "Home Tool ML", "Hyperlinks ML"], correct: 0 },
      { q: "Hyperlink tag?", a: ["<a>", "<link>", "<href>", "<h1>"], correct: 0 },
      { q: "Image tag?", a: ["<img>", "<image>", "<src>", "<pic>"], correct: 0 },
      { q: "Largest heading?", a: ["<h6>", "<h1>", "<head>", "<title>"], correct: 1 },
      { q: "Paragraph tag?", a: ["<para>", "<p>", "<text>", "<pg>"], correct: 1 },
      { q: "Line break tag?", a: ["<br>", "<lb>", "<break>", "<hr>"], correct: 0 },
      { q: "Table row?", a: ["<td>", "<tr>", "<th>", "<table>"], correct: 1 },
      { q: "List tag?", a: ["<ul>", "<li>", "<ol>", "All"], correct: 3 },
      { q: "Meta tag inside?", a: ["body", "footer", "head", "title"], correct: 2 },
      { q: "Form tag?", a: ["<form>", "<input>", "<label>", "<submit>"], correct: 0 },
    ],
  },
  {
    id: 4,
    title: "React Fundamentals",
    description: "React Core Concepts",
    difficulty: "Intermediate",
    questions: [
      { q: "React is a?", a: ["Library", "Framework", "Language", "Database"], correct: 0 },
      { q: "Hook for state?", a: ["useEffect", "useState", "useMemo", "useRef"], correct: 1 },
      { q: "JSX stands for?", a: ["JavaScript XML", "Java Syntax X", "JSON XML", "None"], correct: 0 },
      { q: "Props are?", a: ["Data passed to components", "State", "Hooks", "CSS"], correct: 0 },
      { q: "Virtual DOM is?", a: ["Copy of real DOM", "Database", "Hook", "Server"], correct: 0 },
      { q: "Side effects hook?", a: ["useState", "useEffect", "useMemo", "useHook"], correct: 1 },
      { q: "Component must return?", a: ["HTML", "JSX", "CSS", "JSON"], correct: 1 },
      { q: "Key prop is for?", a: ["Performance", "List rendering", "Styling", "API"], correct: 1 },
      { q: "React created by?", a: ["Google", "Facebook", "Microsoft", "Amazon"], correct: 1 },
      { q: "Fragment syntax?", a: ["<> </>", "<div>", "<frag>", "<React>"], correct: 0 },
    ],
  },
  
  {
    id: 5,
    title: "CSS Fundamentals",
    description: "Styling the Web",
    difficulty: "Advanced",
    questions: [
      { q: "CSS stands for?", a: ["Cascading Style Sheets", "Creative Style", "Color Style", "None"], correct: 0 },
      { q: "Text color property?", a: ["font-color", "color", "text-style", "fg"], correct: 1 },
      { q: "Inside spacing?", a: ["margin", "padding", "border", "space"], correct: 1 },
      { q: "Outside spacing?", a: ["margin", "padding", "gap", "border"], correct: 0 },
      { q: "Flexbox property?", a: ["display:flex", "flexbox:true", "align:flex", "box:flex"], correct: 0 },
      { q: "Center text?", a: ["align:center", "text-align:center", "center:true", "justify:center"], correct: 1 },
      { q: "Background color?", a: ["bgcolor", "background-color", "color-bg", "fill"], correct: 1 },
      { q: "Border radius?", a: ["corner", "border-radius", "round", "radius"], correct: 1 },
      { q: "Grid layout?", a: ["display:grid", "layout:grid", "grid:true", "use:grid"], correct: 0 },
      { q: "Hover effect?", a: [":hover", "::hover", ".hover", "#hover"], correct: 0 },
    ],
  },
];

const Quiz = () => {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timer, setTimer] = useState(60);
  const [activeTab, setActiveTab] = useState("Beginner");

  const startQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQ(0);
    setAnswers([]);
    setShowResult(false);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setTimer(60);
  };

  useEffect(() => {
    if (!selectedQuiz || showResult) return;
    if (timer <= 0) {
      setShowResult(true);
      return;
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer, selectedQuiz, showResult]);

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
    }, 800);
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
    setTimer(60);
  };

  const restartQuiz = () => {
    setCurrentQ(0);
    setAnswers([]);
    setShowResult(false);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setTimer(60);
  };

  const filteredQuizzes = quizzes.filter(q => q.difficulty === activeTab);

  return (
    <div className="quiz-page">
      <header className="header">
        <div className="menu-icon" onClick={resetQuiz}>←</div>
        <div className="logo">📝 Skills Quiz</div>
      </header>

      <div className="quiz-container">
        {!selectedQuiz && (
          <>
            <div className="dashboard-tabs">
              {["Beginner", "Intermediate", "Advanced"].map(tab => (
                <button
                  key={tab}
                  className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="quiz-grid">
              {filteredQuizzes.map((quiz) => (
                <div key={quiz.id} className="quiz-card">
                  <h3>{quiz.title}</h3>
                  <p>{quiz.description}</p>
                  <span className="quiz-count">{quiz.questions.length} Questions</span>
                  <button className="primary-btn" onClick={() => startQuiz(quiz)}>Start Quiz</button>
                </div>
              ))}
            </div>
          </>
        )}

        {selectedQuiz && showResult && (
          <div className="result-box">
            <h2>{selectedQuiz.title}</h2>
            <p>Your Score: {score} / {totalQuestions}</p>
            <p>Accuracy: {Math.round((score / totalQuestions) * 100)}%</p>
            <div className="result-actions">
              <button className="primary-btn" onClick={restartQuiz}>Try Again</button>
              <button className="ghost-btn" onClick={resetQuiz}>Browse Quizzes</button>
            </div>
          </div>
        )}

        {selectedQuiz && !showResult && (
          <div className="quiz-player">
            <div className="timer">⏱ {timer}s left</div>
            <h2>{selectedQuiz.title}</h2>
            <p>Question {currentQ + 1} of {totalQuestions}</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>

            <div className="question-card">
              <h3>{selectedQuiz.questions[currentQ].q}</h3>
              <div className="answers">
                {selectedQuiz.questions[currentQ].a.map((ans, idx) => {
                  const correctIndex = selectedQuiz.questions[currentQ].correct;
                  let className = "answer-btn";
                  if (isAnswered) {
                    if (idx === correctIndex) className += " correct";
                    else if (idx === selectedAnswer) className += " wrong";
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