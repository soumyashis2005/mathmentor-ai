const jwt = require("jsonwebtoken");

// ========================================
// Authentication Middleware
// ========================================

const authMiddleware = (req, res, next) => {
  try {
    // ========================================
    // Get Authorization Header
    // ========================================

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please login.",
      });
    }

    // ========================================
    // Extract Token
    // ========================================

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is missing.",
      });
    }

    // ========================================
    // Verify JWT
    // ========================================

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ========================================
    // Attach User Information
    // ========================================

    req.user = decoded;

    // ========================================
    // Continue Request
    // ========================================

    next();
  } catch (error) {
    console.error("Authentication Error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token.",
    });
  }
};

module.exports = authMiddleware;
