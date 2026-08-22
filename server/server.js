const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Routes
const aiRoutes = require("./routes/aiRoutes");
const questionRoutes = require("./routes/questionRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// ========================================
// Middleware
// ========================================

app.use(cors());

const cors = require("cors");

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// ========================================
// Routes
// ========================================

app.use("/api/ai", aiRoutes);

app.use("/api/questions", questionRoutes);

app.use("/api/auth", authRoutes);

// ========================================
// Health Check
// ========================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MathMentor AI Server is running 🚀",
  });
});

// ========================================
// MongoDB Connection
// ========================================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);

    process.exit(1);
  }
};

startServer();
