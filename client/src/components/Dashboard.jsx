import React, { useCallback, useEffect, useState } from "react";

// ========================================
// Dashboard
// ========================================

const Dashboard = ({ user, onSolve, onHistory }) => {
  const [stats, setStats] = useState({
    totalProblems: 0,
    recentProblems: [],
  });

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ========================================
  // API URL
  // ========================================

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // ========================================
  // Load Dashboard Data
  // ========================================

  const fetchDashboardStats = useCallback(async () => {
    try {
      setLoading(true);

      setError("");

      // IMPORTANT:
      // Same JWT key used by App.jsx
      const token = localStorage.getItem("mathmentor-token");

      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/api/questions`, {
        method: "GET",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load dashboard data.");
      }

      if (data.success) {
        const questions = data.questions || [];

        setStats({
          totalProblems: data.count ?? questions.length,

          recentProblems: questions.slice(0, 3),
        });
      }
    } catch (error) {
      console.error("Dashboard Error:", error);

      setError(error.message || "Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  // ========================================
  // Fetch When Dashboard Opens
  // ========================================

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  // ========================================
  // User Name
  // ========================================

  const displayName =
    user?.name || user?.username || user?.email?.split("@")[0] || "Student";

  // ========================================
  // Loading State
  // ========================================

  if (loading) {
    return (
      <div className="dashboard-page">
        <section className="dashboard-loading">
          <div className="large-spinner"></div>

          <h2>Loading your dashboard...</h2>

          <p>Getting your latest activity</p>
        </section>
      </div>
    );
  }

  // ========================================
  // Dashboard
  // ========================================

  return (
    <div className="dashboard-page">
      {/* ========================================
          Welcome Section
          ======================================== */}

      <section className="dashboard-welcome">
        <div>
          <span className="dashboard-badge">🧠 MathMentor AI</span>

          <h1>
            Welcome back, <span>{displayName}</span> 👋
          </h1>

          <p>
            Ready to solve your next mathematics problem? Let MathMentor AI
            guide you step by step.
          </p>
        </div>

        <div className="dashboard-welcome-icon">🧮</div>
      </section>

      {/* ========================================
          Error
          ======================================== */}

      {error && (
        <div className="error dashboard-error">
          <span>⚠️</span>

          <p>{error}</p>

          <button type="button" onClick={fetchDashboardStats}>
            Retry
          </button>
        </div>
      )}

      {/* ========================================
          Statistics
          ======================================== */}

      <section className="dashboard-stats">
        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon">🧮</div>

          <div>
            <span>Problems Solved</span>

            <strong>{stats.totalProblems}</strong>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon">📚</div>

          <div>
            <span>Learning History</span>

            <strong>{stats.totalProblems > 0 ? "Active" : "Start"}</strong>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon">🎯</div>

          <div>
            <span>AI Tutor</span>

            <strong>Ready</strong>
          </div>
        </div>
      </section>

      {/* ========================================
          Quick Actions
          ======================================== */}

      <section className="dashboard-section">
        <div className="dashboard-section-heading">
          <span>QUICK ACTIONS</span>

          <h2>What would you like to do?</h2>
        </div>

        <div className="dashboard-actions">
          <button
            type="button"
            className="dashboard-action-card primary"
            onClick={onSolve}
          >
            <div className="dashboard-action-icon">🧮</div>

            <div>
              <h3>Solve a Problem</h3>

              <p>
                Enter any mathematics question and get a detailed step-by-step
                solution.
              </p>
            </div>

            <span className="dashboard-action-arrow">→</span>
          </button>

          <button
            type="button"
            className="dashboard-action-card"
            onClick={onHistory}
          >
            <div className="dashboard-action-icon">📖</div>

            <div>
              <h3>View History</h3>

              <p>Review your previously solved mathematics problems.</p>
            </div>

            <span className="dashboard-action-arrow">→</span>
          </button>
        </div>
      </section>

      {/* ========================================
          Recent Problems
          ======================================== */}

      <section className="dashboard-section">
        <div className="dashboard-section-heading dashboard-heading-row">
          <div>
            <span>RECENT ACTIVITY</span>

            <h2>Recently Solved</h2>
          </div>

          {stats.totalProblems > 0 && (
            <button
              type="button"
              className="dashboard-view-all"
              onClick={onHistory}
            >
              View all →
            </button>
          )}
        </div>

        {stats.recentProblems.length > 0 ? (
          <div className="dashboard-recent-list">
            {stats.recentProblems.map((item) => (
              <div className="dashboard-recent-card" key={item._id}>
                <div className="dashboard-recent-icon">🧮</div>

                <div className="dashboard-recent-content">
                  <h3>{item.problemType || "Mathematics Problem"}</h3>

                  <p>{item.questionText}</p>

                  <small>
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString(undefined, {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : ""}
                  </small>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="dashboard-empty">
            <div>📚</div>

            <h3>No problems solved yet</h3>

            <p>
              Start solving your first problem and your activity will appear
              here.
            </p>

            <button type="button" onClick={onSolve}>
              Solve Your First Problem
            </button>
          </div>
        )}
      </section>

      {/* ========================================
          AI Tutor
          ======================================== */}

      <section className="dashboard-tutor">
        <div className="dashboard-tutor-icon">🤖</div>

        <div className="dashboard-tutor-content">
          <span>AI LEARNING ASSISTANT</span>

          <h2>Learn, don't just get the answer.</h2>

          <p>
            MathMentor AI breaks difficult mathematics problems into clear,
            understandable steps so you can actually learn the concept.
          </p>
        </div>

        <button type="button" onClick={onSolve}>
          Start Learning →
        </button>
      </section>
    </div>
  );
};

export default Dashboard;
