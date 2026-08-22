const express = require("express");

const {
  getQuestions,
  getQuestionById,
  deleteQuestion,
  deleteAllQuestions,
} = require("../controllers/questionController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ========================================
// Protected History Routes
// ========================================

// Get logged-in user's history
router.get("/", authMiddleware, getQuestions);

// Delete all logged-in user's history
router.delete("/", authMiddleware, deleteAllQuestions);

// Get one question
router.get("/:id", authMiddleware, getQuestionById);

// Delete one question
router.delete("/:id", authMiddleware, deleteQuestion);

module.exports = router;
