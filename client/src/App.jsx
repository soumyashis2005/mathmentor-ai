import { useEffect, useState } from "react";
import axios from "axios";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

import "./App.css";

import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

// ========================================
// API Configuration
// ========================================

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ========================================
// App
// ========================================

function App() {
  // ========================================
  // Authentication
  // ========================================

  const [user, setUser] = useState(null);

  const [authLoading, setAuthLoading] = useState(true);

  const [authPage, setAuthPage] = useState("login");

  // ========================================
  // Solve Page States
  // ========================================

  const [question, setQuestion] = useState("");

  const [solution, setSolution] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [copied, setCopied] = useState(false);

  const [copiedLatex, setCopiedLatex] = useState(false);

  // ========================================
  // AI Tutor States
  // ========================================

  const [tutorLoading, setTutorLoading] = useState(false);

  const [tutorError, setTutorError] = useState("");

  const [tutorMode, setTutorMode] = useState("");

  const [tutorResponse, setTutorResponse] = useState(null);

  // ========================================
  // Navigation
  // ========================================

  const [page, setPage] = useState("dashboard");

  // ========================================
  // Theme
  // ========================================

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("mathmentor-theme") || "light";
  });

  // ========================================
  // History
  // ========================================

  const [history, setHistory] = useState([]);

  const [historyLoading, setHistoryLoading] = useState(false);

  const [historySearch, setHistorySearch] = useState("");

  const [historyFilter, setHistoryFilter] = useState("All");

  const [deletingId, setDeletingId] = useState(null);

  const [clearingHistory, setClearingHistory] = useState(false);

  // ========================================
  // Example Questions
  // ========================================

  const exampleQuestions = [
    "Solve x² - 5x + 6 = 0",
    "Find the derivative of x³ sin(x)",
    "Integrate x² / (x² + 1)",
    "Find the determinant of [[2,1,3],[0,4,5],[1,2,1]]",
  ];

  // ========================================
  // Get JWT Token
  // ========================================

  const getToken = () => {
    return localStorage.getItem("mathmentor-token");
  };

  // ========================================
  // Authenticated Axios Configuration
  // ========================================

  const getAuthConfig = () => {
    const token = getToken();

    if (!token) {
      return {};
    }

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // ========================================
  // Apply Theme
  // ========================================

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);

    localStorage.setItem("mathmentor-theme", theme);
  }, [theme]);

  // ========================================
  // Check Existing Login
  // ========================================

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = getToken();

      const savedUser = localStorage.getItem("mathmentor-user");

      if (!token) {
        setAuthLoading(false);
        return;
      }

      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error("Saved user parsing error:", error);
        }
      }

      try {
        const response = await axios.get(
          `${API_URL}/api/auth/me`,
          getAuthConfig(),
        );

        if (response.data?.success && response.data?.user) {
          setUser(response.data.user);

          localStorage.setItem(
            "mathmentor-user",
            JSON.stringify(response.data.user),
          );
        } else {
          handleLogout();
        }
      } catch (error) {
        console.error("Authentication check failed:", error);

        handleLogout();
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  // ========================================
  // Login
  // ========================================

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);

    setPage("dashboard");

    setError("");
  };

  // ========================================
  // Register
  // ========================================

  const handleRegister = (registeredUser) => {
    setUser(registeredUser);

    setPage("dashboard");

    setError("");
  };

  // ========================================
  // Clear Tutor
  // ========================================

  const clearTutor = () => {
    setTutorLoading(false);

    setTutorError("");

    setTutorMode("");

    setTutorResponse(null);
  };

  // ========================================
  // Logout
  // ========================================

  const handleLogout = () => {
    localStorage.removeItem("mathmentor-token");

    localStorage.removeItem("mathmentor-user");

    setUser(null);

    setHistory([]);

    setSolution(null);

    setQuestion("");

    clearTutor();

    setError("");

    setPage("dashboard");

    setAuthPage("login");
  };

  // ========================================
  // Toggle Theme
  // ========================================

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  };

  // ========================================
  // Solve Question
  // ========================================

  const solveQuestion = async () => {
    if (!question.trim()) {
      setError("Please enter a mathematics question.");

      return;
    }

    const token = getToken();

    if (!token) {
      setError("Please login before solving a problem.");

      setAuthPage("login");

      return;
    }

    setLoading(true);

    setError("");

    setSolution(null);

    clearTutor();

    setCopied(false);

    setCopiedLatex(false);

    try {
      const response = await axios.post(
        `${API_URL}/api/ai/solve`,
        {
          question: question.trim(),
        },
        getAuthConfig(),
      );

      if (!response.data?.success || !response.data?.solution) {
        throw new Error(
          response.data?.message || "The AI returned an empty solution.",
        );
      }

      setSolution(response.data.solution);

      setTimeout(() => {
        document.querySelector(".solution")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 150);
    } catch (err) {
      console.error("Solve Error:", err);

      if (err.response?.status === 401) {
        handleLogout();

        setError("Your session has expired. Please login again.");

        return;
      }

      setError(
        err.response?.data?.message ||
          err.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // AI Tutor
  // ========================================

  const askTutor = async (mode) => {
    if (!solution || !question.trim()) {
      setTutorError("Please solve a problem first.");

      return;
    }

    const token = getToken();

    if (!token) {
      handleLogout();

      return;
    }

    setTutorLoading(true);

    setTutorError("");

    setTutorMode(mode);

    setTutorResponse(null);

    try {
      const response = await axios.post(
        `${API_URL}/api/ai/tutor`,
        {
          mode,

          question: question.trim(),

          solution,
        },
        getAuthConfig(),
      );

      if (!response.data?.success || !response.data?.tutor) {
        throw new Error(
          response.data?.message || "The AI Tutor returned an empty response.",
        );
      }

      setTutorResponse(response.data.tutor);
    } catch (err) {
      console.error("Tutor Error:", err);

      if (err.response?.status === 401) {
        handleLogout();

        setError("Your session has expired. Please login again.");

        return;
      }

      setTutorError(
        err.response?.data?.message ||
          err.message ||
          "Unable to get a tutor response. Please try again.",
      );
    } finally {
      setTutorLoading(false);
    }
  };

  // ========================================
  // Keyboard Shortcut
  // ========================================

  useEffect(() => {
    if (!user) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "Enter") {
        event.preventDefault();

        if (!loading) {
          solveQuestion();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [question, loading, user]);

  // ========================================
  // Clear Question
  // ========================================

  const clearQuestion = () => {
    setQuestion("");

    setSolution(null);

    clearTutor();

    setError("");

    setCopied(false);

    setCopiedLatex(false);
  };

  // ========================================
  // Select Example
  // ========================================

  const selectExample = (example) => {
    setQuestion(example);

    setSolution(null);

    clearTutor();

    setError("");

    setCopied(false);

    setCopiedLatex(false);
  };

  // ========================================
  // Copy Answer
  // ========================================

  const copyFinalAnswer = async () => {
    if (!solution?.finalAnswer) {
      return;
    }

    try {
      await navigator.clipboard.writeText(solution.finalAnswer);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Copy Answer Error:", err);

      setError("Unable to copy the answer.");
    }
  };

  // ========================================
  // Copy LaTeX
  // ========================================

  const copyFinalLatex = async () => {
    if (!solution?.finalAnswer) {
      return;
    }

    try {
      await navigator.clipboard.writeText(solution.finalAnswer);

      setCopiedLatex(true);

      setTimeout(() => {
        setCopiedLatex(false);
      }, 2000);
    } catch (err) {
      console.error("Copy LaTeX Error:", err);

      setError("Unable to copy LaTeX.");
    }
  };

  // ========================================
  // Load History
  // ========================================

  const loadHistory = async () => {
    const token = getToken();

    if (!token) {
      setError("Please login to view your history.");

      return;
    }

    setHistoryLoading(true);

    setError("");

    try {
      const response = await axios.get(
        `${API_URL}/api/questions`,
        getAuthConfig(),
      );

      setHistory(response.data.questions || []);
    } catch (err) {
      console.error("History Error:", err);

      if (err.response?.status === 401) {
        handleLogout();

        setError("Your session has expired. Please login again.");

        return;
      }

      setError(
        err.response?.data?.message || "Failed to load solution history.",
      );
    } finally {
      setHistoryLoading(false);
    }
  };

  // ========================================
  // Open History Solution
  // ========================================

  const openHistorySolution = async (item) => {
    try {
      setError("");

      const response = await axios.get(
        `${API_URL}/api/questions/${item._id}`,
        getAuthConfig(),
      );

      const data = response.data.question;

      setQuestion(data.questionText || "");

      setSolution(data.solution || null);

      clearTutor();

      setCopied(false);

      setCopiedLatex(false);

      setPage("solve");

      setTimeout(() => {
        document.querySelector(".solution")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 150);
    } catch (err) {
      console.error("Open Solution Error:", err);

      if (err.response?.status === 401) {
        handleLogout();

        setError("Your session has expired. Please login again.");

        return;
      }

      setError(err.response?.data?.message || "Failed to load the solution.");
    }
  };

  // ========================================
  // Delete History Item
  // ========================================

  const deleteHistoryItem = async (event, id) => {
    event.stopPropagation();

    const confirmed = window.confirm(
      "Are you sure you want to delete this solution?",
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(id);

    setError("");

    try {
      await axios.delete(`${API_URL}/api/questions/${id}`, getAuthConfig());

      setHistory((previous) => previous.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Delete History Error:", err);

      if (err.response?.status === 401) {
        handleLogout();

        setError("Your session has expired. Please login again.");

        return;
      }

      setError(
        err.response?.data?.message || "Failed to delete this solution.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ========================================
  // Clear All History
  // ========================================

  const clearAllHistory = async () => {
    if (history.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete ALL solution history? This cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    setClearingHistory(true);

    setError("");

    try {
      await axios.delete(`${API_URL}/api/questions`, getAuthConfig());

      setHistory([]);
    } catch (err) {
      console.error("Clear History Error:", err);

      if (err.response?.status === 401) {
        handleLogout();

        setError("Your session has expired. Please login again.");

        return;
      }

      setError(
        err.response?.data?.message || "Failed to clear solution history.",
      );
    } finally {
      setClearingHistory(false);
    }
  };

  // ========================================
  // Navigation
  // ========================================

  const openDashboardPage = () => {
    setPage("dashboard");

    setError("");
  };

  const openSolvePage = () => {
    setPage("solve");

    setError("");
  };

  const openHistoryPage = () => {
    setPage("history");

    setHistorySearch("");

    setHistoryFilter("All");

    loadHistory();
  };

  // ========================================
  // History Filters
  // ========================================

  const problemTypes = [
    "All",
    ...new Set(history.map((item) => item.problemType).filter(Boolean)),
  ];

  const filteredHistory = history.filter((item) => {
    const search = historySearch.trim().toLowerCase();

    const matchesSearch =
      !search ||
      item.questionText?.toLowerCase().includes(search) ||
      item.problemType?.toLowerCase().includes(search) ||
      item.concept?.toLowerCase().includes(search);

    const matchesFilter =
      historyFilter === "All" || item.problemType === historyFilter;

    return matchesSearch && matchesFilter;
  });

  // ========================================
  // Format Date
  // ========================================

  const formatHistoryDate = (createdAt) => {
    if (!createdAt) {
      return "Date unavailable";
    }

    const date = new Date(createdAt);

    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();

    const yesterday = new Date(now);

    yesterday.setDate(now.getDate() - 1);

    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
      return `Today, ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    if (isYesterday) {
      return `Yesterday, ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    return date.toLocaleDateString([], {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // ========================================
  // Authentication Loading Screen
  // ========================================

  if (authLoading) {
    return (
      <div className="auth-loading-screen">
        <div className="auth-loading-card">
          <div className="large-spinner"></div>

          <h2>Loading MathMentor AI...</h2>

          <p>Checking your session</p>
        </div>
      </div>
    );
  }

  // ========================================
  // Login / Register Screen
  // ========================================

  if (!user) {
    if (authPage === "register") {
      return (
        <Register
          onRegister={handleRegister}
          onSwitchToLogin={() => setAuthPage("login")}
        />
      );
    }

    return (
      <Login
        onLogin={handleLogin}
        onSwitchToRegister={() => setAuthPage("register")}
      />
    );
  }

  // ========================================
  // Main Application
  // ========================================

  return (
    <div className="app">
      {/* ======================================
          HEADER
          ====================================== */}

      <header className="header">
        <div className="logo" onClick={openDashboardPage}>
          <span className="logo-icon">🧠</span>

          <span>MathMentor AI</span>
        </div>

        <div className="header-actions">
          <nav className="nav">
            <button
              className={
                page === "dashboard" ? "nav-button active" : "nav-button"
              }
              onClick={openDashboardPage}
              type="button"
            >
              Dashboard
            </button>

            <button
              className={page === "solve" ? "nav-button active" : "nav-button"}
              onClick={openSolvePage}
              type="button"
            >
              Solve
            </button>

            <button
              className={
                page === "history" ? "nav-button active" : "nav-button"
              }
              onClick={openHistoryPage}
              type="button"
            >
              History
            </button>
          </nav>

          {/* User */}

          <div className="user-menu">
            <span className="user-name">👤 {user.name}</span>

            <button
              className="logout-button"
              onClick={handleLogout}
              type="button"
            >
              Logout
            </button>
          </div>

          {/* Theme */}

          <button
            className="theme-toggle"
            onClick={toggleTheme}
            type="button"
            title={
              theme === "light" ? "Switch to dark mode" : "Switch to light mode"
            }
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </header>

      {/* ======================================
          MAIN
          ====================================== */}

      <main className="main">
        {/* ====================================
            DASHBOARD PAGE
            ==================================== */}

        {page === "dashboard" && (
          <Dashboard
            user={user}
            onSolve={openSolvePage}
            onHistory={openHistoryPage}
          />
        )}

        {/* ====================================
            SOLVE PAGE
            ==================================== */}

        {page === "solve" && (
          <>
            {/* HERO */}

            <section className="hero">
              <div className="hero-badge">🧮 AI Mathematics Teacher</div>

              <h1>
                Learn Mathematics,
                <span>Don't Just Get Answers.</span>
              </h1>

              <p>
                Ask any mathematics question and get a clear, step-by-step
                explanation from MathMentor AI.
              </p>
            </section>

            {/* QUESTION */}

            <section className="question-section">
              <div className="input-header">
                <div>
                  <h2>Ask your question</h2>

                  <p>
                    Enter anything from basic algebra to advanced mathematics.
                  </p>
                </div>

                {question && (
                  <button
                    className="clear-button"
                    onClick={clearQuestion}
                    type="button"
                  >
                    ✕ Clear
                  </button>
                )}
              </div>

              <div className="textarea-wrapper">
                <textarea
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.ctrlKey && event.key === "Enter") {
                      event.preventDefault();

                      if (!loading) {
                        solveQuestion();
                      }
                    }
                  }}
                  placeholder="Example: Solve x² - 5x + 6 = 0"
                  rows="6"
                />

                <div className="keyboard-hint">
                  <span>Ctrl</span>

                  <span>+</span>

                  <span>Enter</span>

                  <small>to solve</small>
                </div>
              </div>

              <button
                className="solve-button"
                onClick={solveQuestion}
                disabled={loading || !question.trim()}
                type="button"
              >
                {loading ? (
                  <span className="loading-content">
                    <span className="spinner"></span>
                    Solving your problem...
                  </span>
                ) : (
                  <span>🧠 Solve Problem</span>
                )}
              </button>

              {error && (
                <div className="error">
                  <span>⚠️</span>

                  <p>{error}</p>
                </div>
              )}

              {/* EXAMPLES */}

              <div className="examples">
                <div className="examples-title">💡 Try an example</div>

                <div className="example-list">
                  {exampleQuestions.map((example, index) => (
                    <button
                      key={index}
                      className="example-button"
                      onClick={() => selectExample(example)}
                      type="button"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* ====================================
                SOLUTION
                ==================================== */}

            {solution && (
              <section className="solution">
                <div className="solution-header">
                  <div>
                    <span className="solution-label">YOUR SOLUTION</span>

                    <h2>🧮 Solution</h2>
                  </div>

                  <button
                    className="new-question-button"
                    onClick={clearQuestion}
                    type="button"
                  >
                    + New Question
                  </button>
                </div>

                {/* INFO */}

                <div className="info-card">
                  <div className="info-item">
                    <h3>Problem Type</h3>

                    <p>{solution.problemType || "Mathematics"}</p>
                  </div>

                  <div className="info-item">
                    <h3>Concept</h3>

                    <p>{solution.concept || "General Mathematics"}</p>
                  </div>

                  <div className="info-item">
                    <h3>Given</h3>

                    <div className="math-expression">
                      <BlockMath math={solution.given || ""} />
                    </div>
                  </div>
                </div>

                {/* STEPS */}

                <div className="section-heading">
                  <span>STEP-BY-STEP</span>

                  <h2>Explanation</h2>
                </div>

                <div className="steps">
                  {solution.steps?.map((step) => (
                    <div className="step-card" key={step.step}>
                      <div className="step-number">{step.step}</div>

                      <div className="step-content">
                        <h3>{step.title}</h3>

                        <p>{step.explanation}</p>

                        {step.result && (
                          <div className="result">
                            <BlockMath math={step.result} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* FINAL ANSWER */}

                <div className="final-answer">
                  <div className="final-answer-header">
                    <div>
                      <span className="answer-label">FINAL RESULT</span>

                      <h2>✅ Final Answer</h2>
                    </div>

                    <div className="answer-actions">
                      <button
                        className="copy-button"
                        onClick={copyFinalAnswer}
                        type="button"
                      >
                        {copied ? "✓ Copied" : "📋 Copy Answer"}
                      </button>

                      <button
                        className="copy-latex-button"
                        onClick={copyFinalLatex}
                        type="button"
                      >
                        {copiedLatex ? "✓ Copied" : "</> Copy LaTeX"}
                      </button>
                    </div>
                  </div>

                  <div className="math-answer">
                    <BlockMath math={solution.finalAnswer || ""} />
                  </div>
                </div>

                {/* SIMPLE EXPLANATION */}

                {solution.shortExplanation && (
                  <div className="explanation">
                    <div className="explanation-title">
                      <span>💡</span>

                      <h2>In Simple Words</h2>
                    </div>

                    <p>{solution.shortExplanation}</p>
                  </div>
                )}

                {/* ====================================
                    AI TUTOR
                    ==================================== */}

                <div className="ai-tutor">
                  <div className="ai-tutor-header">
                    <span className="solution-label">
                      AI LEARNING ASSISTANT
                    </span>

                    <h2>🧠 Learn More</h2>

                    <p>
                      Go beyond the answer and understand the mathematics behind
                      the solution.
                    </p>
                  </div>

                  {/* TUTOR BUTTONS */}

                  <div className="tutor-actions">
                    <button
                      className="tutor-button"
                      onClick={() => askTutor("explain")}
                      disabled={tutorLoading}
                      type="button"
                    >
                      {tutorLoading && tutorMode === "explain"
                        ? "⏳ Explaining..."
                        : "💡 Explain More"}
                    </button>

                    <button
                      className="tutor-button"
                      onClick={() => askTutor("example")}
                      disabled={tutorLoading}
                      type="button"
                    >
                      {tutorLoading && tutorMode === "example"
                        ? "⏳ Generating..."
                        : "📝 Another Example"}
                    </button>

                    <button
                      className="tutor-button"
                      onClick={() => askTutor("similar")}
                      disabled={tutorLoading}
                      type="button"
                    >
                      {tutorLoading && tutorMode === "similar"
                        ? "⏳ Creating..."
                        : "🎯 Similar Problem"}
                    </button>

                    <button
                      className="tutor-button"
                      onClick={() => askTutor("quiz")}
                      disabled={tutorLoading}
                      type="button"
                    >
                      {tutorLoading && tutorMode === "quiz"
                        ? "⏳ Preparing..."
                        : "🧠 Quiz Me"}
                    </button>
                  </div>

                  {/* TUTOR ERROR */}

                  {tutorError && (
                    <div className="error tutor-error">
                      <span>⚠️</span>

                      <p>{tutorError}</p>

                      <button type="button" onClick={() => setTutorError("")}>
                        ✕
                      </button>
                    </div>
                  )}

                  {/* TUTOR RESPONSE */}

                  {tutorResponse && (
                    <div className="tutor-response">
                      <div className="tutor-response-header">
                        <div>
                          <span className="answer-label">
                            {tutorMode === "explain"
                              ? "EXPLANATION"
                              : tutorMode === "example"
                                ? "NEW EXAMPLE"
                                : tutorMode === "similar"
                                  ? "PRACTICE"
                                  : "QUIZ"}
                          </span>

                          <h3>
                            {tutorResponse.title || "MathMentor AI Tutor"}
                          </h3>
                        </div>

                        <button
                          className="tutor-close"
                          type="button"
                          onClick={clearTutor}
                        >
                          ✕
                        </button>
                      </div>

                      {/* Content */}

                      {tutorResponse.content && (
                        <div className="tutor-content">
                          <p>{tutorResponse.content}</p>
                        </div>
                      )}

                      {/* Question */}

                      {tutorResponse.question && (
                        <div className="tutor-question-card">
                          <span>QUESTION</span>

                          <h4>{tutorResponse.question}</h4>
                        </div>
                      )}

                      {/* Hint */}

                      {tutorResponse.hint && (
                        <div className="tutor-hint">
                          <strong>💡 Hint:</strong> {tutorResponse.hint}
                        </div>
                      )}

                      {/* Steps */}

                      {Array.isArray(tutorResponse.steps) &&
                        tutorResponse.steps.length > 0 && (
                          <div className="tutor-steps">
                            {tutorResponse.steps.map((step, index) => (
                              <div
                                className="tutor-step"
                                key={step.step || index}
                              >
                                <div className="tutor-step-number">
                                  {step.step || index + 1}
                                </div>

                                <div>
                                  <h4>
                                    {step.title ||
                                      `Step ${step.step || index + 1}`}
                                  </h4>

                                  {step.explanation && (
                                    <p>{step.explanation}</p>
                                  )}

                                  {step.result && (
                                    <div className="tutor-result">
                                      <BlockMath math={step.result} />
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                      {/* Key Points */}

                      {Array.isArray(tutorResponse.keyPoints) &&
                        tutorResponse.keyPoints.length > 0 && (
                          <div className="tutor-key-points">
                            <h4>📌 Key Points</h4>

                            <ul>
                              {tutorResponse.keyPoints.map((point, index) => (
                                <li key={index}>{point}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                      {/* Answer */}

                      {tutorResponse.answer && (
                        <div className="tutor-answer-card">
                          <span>ANSWER</span>

                          <div className="tutor-answer-text">
                            {String(tutorResponse.answer)}
                          </div>
                        </div>
                      )}

                      {/* Final Answer */}

                      {tutorResponse.finalAnswer && (
                        <div className="tutor-answer-card">
                          <span>FINAL ANSWER</span>

                          <div className="tutor-answer-text">
                            {String(tutorResponse.finalAnswer)}
                          </div>
                        </div>
                      )}

                      {/* Explanation */}

                      {tutorResponse.explanation && (
                        <div className="tutor-explanation">
                          <h4>📖 Explanation</h4>

                          <p>{tutorResponse.explanation}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </section>
            )}
          </>
        )}

        {/* ====================================
            HISTORY PAGE
            ==================================== */}

        {page === "history" && (
          <section className="history-page">
            <div className="history-header">
              <div>
                <span className="solution-label">YOUR ACTIVITY</span>

                <h1>📚 Solution History</h1>

                <p>Review and manage your mathematics solutions.</p>
              </div>

              <button
                className="history-solve-button"
                onClick={openSolvePage}
                type="button"
              >
                + Solve New Problem
              </button>
            </div>

            {/* HISTORY CONTROLS */}

            {history.length > 0 && (
              <div className="history-controls">
                <div className="history-search">
                  <span>🔎</span>

                  <input
                    type="text"
                    value={historySearch}
                    onChange={(event) => setHistorySearch(event.target.value)}
                    placeholder="Search your solved problems..."
                  />

                  {historySearch && (
                    <button
                      className="search-clear"
                      onClick={() => setHistorySearch("")}
                      type="button"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="history-filter">
                  <label>Filter</label>

                  <select
                    value={historyFilter}
                    onChange={(event) => setHistoryFilter(event.target.value)}
                  >
                    {problemTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  className="clear-history-button"
                  onClick={clearAllHistory}
                  disabled={clearingHistory}
                  type="button"
                >
                  {clearingHistory ? "Clearing..." : "🗑️ Clear All"}
                </button>
              </div>
            )}

            {/* ERROR */}

            {error && (
              <div className="error">
                <span>⚠️</span>

                <p>{error}</p>
              </div>
            )}

            {/* LOADING */}

            {historyLoading ? (
              <div className="history-loading">
                <span className="large-spinner"></span>

                <p>Loading your solutions...</p>
              </div>
            ) : history.length === 0 ? (
              <div className="empty-history">
                <div className="empty-icon">📚</div>

                <h2>No solved problems yet</h2>

                <p>
                  Solve your first mathematics problem and it will appear here.
                </p>

                <button onClick={openSolvePage} type="button">
                  Solve a Problem
                </button>
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="empty-history">
                <div className="empty-icon">🔎</div>

                <h2>No matching solutions</h2>

                <p>Try a different search term or change the filter.</p>

                <button
                  onClick={() => {
                    setHistorySearch("");

                    setHistoryFilter("All");
                  }}
                  type="button"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="history-list">
                {filteredHistory.map((item) => (
                  <div
                    className="history-card"
                    key={item._id}
                    onClick={() => openHistorySolution(item)}
                  >
                    <div className="history-card-top">
                      <div className="history-icon">🧮</div>

                      <div className="history-main">
                        <h3>{item.problemType || "Mathematics Problem"}</h3>

                        <p className="history-concept">
                          {item.concept || "General Mathematics"}
                        </p>
                      </div>

                      <button
                        className="delete-history-button"
                        onClick={(event) => deleteHistoryItem(event, item._id)}
                        disabled={deletingId === item._id}
                        title="Delete solution"
                        type="button"
                      >
                        {deletingId === item._id ? "..." : "🗑️"}
                      </button>

                      <span className="history-arrow">→</span>
                    </div>

                    <div className="history-question">{item.questionText}</div>

                    {item.finalAnswer && (
                      <div className="history-answer">
                        <strong>Answer:</strong> {item.finalAnswer}
                      </div>
                    )}

                    <div className="history-footer">
                      <div className="history-date">
                        {formatHistoryDate(item.createdAt)}
                      </div>

                      <div className="history-view">View Solution →</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
