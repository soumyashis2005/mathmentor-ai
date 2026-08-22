const express = require("express");

const {
  solveQuestion,
  tutorResponse,
  testPythonEngine,
} = require("../controllers/aiController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

console.log("AI ROUTES LOADED");

// ========================================
// Test Route
// ========================================

router.get("/test-route", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AI route is working",
  });
});

// ========================================
// Protected Solve Route
// ========================================

router.post("/solve", authMiddleware, solveQuestion);

// ========================================
// Protected AI Tutor Route
// ========================================

router.post("/tutor", authMiddleware, tutorResponse);

// ========================================
// Python Test
// ========================================

router.post("/python-test", testPythonEngine);

module.exports = router;
