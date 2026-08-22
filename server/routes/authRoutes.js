const express = require("express");

const {
  registerUser,
  loginUser,
  getCurrentUser,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ========================================
// Register
// ========================================

router.post("/register", registerUser);

// ========================================
// Login
// ========================================

router.post("/login", loginUser);

// ========================================
// Current User
// ========================================

router.get("/me", authMiddleware, getCurrentUser);

module.exports = router;
