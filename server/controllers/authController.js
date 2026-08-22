const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

// ========================================
// Generate JWT
// ========================================

const generateToken = (userId) => {
  return jwt.sign(
    {
      userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
};

// ========================================
// Register User
// ========================================

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ========================================
    // Validation
    // ========================================

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    // ========================================
    // Normalize Email
    // ========================================

    const normalizedEmail = email.trim().toLowerCase();

    // ========================================
    // Check Existing User
    // ========================================

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // ========================================
    // Hash Password
    // ========================================

    const hashedPassword = await bcrypt.hash(password, 12);

    // ========================================
    // Create User
    // ========================================

    const user = await User.create({
      name: name.trim(),

      email: normalizedEmail,

      password: hashedPassword,
    });

    // ========================================
    // Generate Token
    // ========================================

    const token = generateToken(user._id);

    // ========================================
    // Response
    // ========================================

    return res.status(201).json({
      success: true,

      message: "Account created successfully.",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create account.",
    });
  }
};

// ========================================
// Login User
// ========================================

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ========================================
    // Validation
    // ========================================

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // ========================================
    // Find User
    // ========================================

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // ========================================
    // Compare Password
    // ========================================

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // ========================================
    // Generate Token
    // ========================================

    const token = generateToken(user._id);

    // ========================================
    // Response
    // ========================================

    return res.status(200).json({
      success: true,

      message: "Login successful.",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to login.",
    });
  }
};

// ========================================
// Get Current User
// ========================================

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Get Current User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user.",
    });
  }
};

// ========================================
// Exports
// ========================================

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
};
