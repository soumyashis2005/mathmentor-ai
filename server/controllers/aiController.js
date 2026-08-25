const {
  generateMathSolution,
  generateTutorResponse,
  extractMathQuestionFromImage,
} = require("../services/aiService");

const { verifyExpressions } = require("../services/mathVerification");

const Question = require("../models/Question");

const {
  solveWithPython,
  verifyWithPython,
} = require("../services/pythonService");

// ========================================
// Solve Question
// ========================================

const solveQuestion = async (req, res) => {
  try {
    const { question } = req.body;

    // ========================================
    // Validate Question
    // ========================================

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    // ========================================
    // Validate Authenticated User
    // ========================================

    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please login.",
      });
    }

    // ========================================
    // Generate AI Solution
    // ========================================

    const solutionText = await generateMathSolution(question);

    let solution;

    try {
      solution = JSON.parse(solutionText);
    } catch (error) {
      console.error("Failed to parse Gemini JSON:", error);

      return res.status(500).json({
        success: false,
        message: "AI returned an invalid solution format",
      });
    }

    // ========================================
    // Python Math Engine
    // ========================================

    let mathEngineResult = null;

    if (
      solution.mathEngine &&
      solution.mathEngine.required === true &&
      solution.mathEngine.expression &&
      solution.mathEngine.operation
    ) {
      mathEngineResult = await solveWithPython({
        expression: solution.mathEngine.expression,

        operation: solution.mathEngine.operation,
      });
    }

    // ========================================
    // Python Symbolic Verification
    // ========================================

    let pythonVerification = null;

    if (
      solution.mathEngine &&
      solution.mathEngine.verificationType &&
      solution.mathEngine.verificationOriginal &&
      solution.mathEngine.verificationAnswer
    ) {
      pythonVerification = await verifyWithPython({
        type: solution.mathEngine.verificationType,

        original: solution.mathEngine.verificationOriginal,

        answer: solution.mathEngine.verificationAnswer,
      });
    }

    // ========================================
    // Final Verification
    // ========================================

    let verification = null;

    // ----------------------------------------
    // Priority 1: Python / SymPy
    // ----------------------------------------

    if (pythonVerification && pythonVerification.success === true) {
      verification = {
        verified: pythonVerification.verified === true,

        status:
          pythonVerification.verified === true
            ? "verified"
            : pythonVerification.status || "incorrect",

        type: "symbolic",

        engine: "SymPy",

        message:
          pythonVerification.verified === true
            ? "The solution was independently verified using SymPy."
            : pythonVerification.status === "unable_to_verify"
              ? "This solution could not be independently verified by the current mathematical verification engine."
              : "The solution did not pass independent mathematical verification.",

        details: pythonVerification,
      };
    }

    // ----------------------------------------
    // Priority 2: MathJS
    // ----------------------------------------
    else if (
      solution.verification &&
      Array.isArray(solution.verification.expressions) &&
      solution.verification.expressions.length > 0
    ) {
      verification = verifyExpressions(solution.verification.expressions);
    }

    // ----------------------------------------
    // Priority 3: Unable to Verify
    // ----------------------------------------
    else {
      verification = {
        verified: false,

        status: "unable_to_verify",

        type: "unverified",

        engine: null,

        message:
          "This solution could not be independently verified automatically.",

        results: [],
      };
    }

    // ========================================
    // Save Question
    // ========================================

    const savedQuestion = await Question.create({
      // IMPORTANT:
      // Save authenticated user's ID
      userId: req.user.userId,

      questionText: question,

      solution: solution,

      problemType: solution.problemType || "General Mathematics",

      concept: solution.concept || "",

      finalAnswer: solution.finalAnswer || "",

      verification: verification || {
        verified: false,

        status: "unable_to_verify",

        results: [],
      },
    });

    // ========================================
    // Final Response
    // ========================================

    return res.status(200).json({
      success: true,

      question,

      solution,

      mathEngineResult,

      pythonVerification,

      verification,

      savedQuestionId: savedQuestion._id,
    });
  } catch (error) {
    console.error("AI Error:", error);

    return res.status(500).json({
      success: false,

      message: error.message || "Failed to generate solution",
    });
  }
};

// ========================================
// Solve Image Question
// ========================================

const solveImage = async (req, res) => {
  try {
    // ========================================
    // Validate Authentication
    // ========================================

    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please login.",
      });
    }

    // ========================================
    // Validate Image
    // ========================================

    if (!req.body?.image) {
      return res.status(400).json({
        success: false,
        message: "Image is required.",
      });
    }

    const { image, mimeType } = req.body;

    // Convert Base64 image to Buffer
    const imageBuffer = Buffer.from(image, "base64");

    // ========================================
    // Extract Mathematics Question
    // ========================================

    const question = await extractMathQuestionFromImage(
      imageBuffer,
      mimeType || "image/jpeg",
    );

    // ========================================
    // Generate Normal Math Solution
    // ========================================

    const solutionText = await generateMathSolution(question);

    let solution;

    try {
      solution = JSON.parse(solutionText);
    } catch (error) {
      console.error("Failed to parse Gemini JSON:", error);

      return res.status(500).json({
        success: false,
        message: "AI returned an invalid solution format.",
      });
    }

    // ========================================
    // Python Math Engine
    // ========================================

    let mathEngineResult = null;

    if (
      solution.mathEngine &&
      solution.mathEngine.required === true &&
      solution.mathEngine.expression &&
      solution.mathEngine.operation
    ) {
      mathEngineResult = await solveWithPython({
        expression: solution.mathEngine.expression,
        operation: solution.mathEngine.operation,
      });
    }

    // ========================================
    // Python Symbolic Verification
    // ========================================

    let pythonVerification = null;

    if (
      solution.mathEngine &&
      solution.mathEngine.verificationType &&
      solution.mathEngine.verificationOriginal &&
      solution.mathEngine.verificationAnswer
    ) {
      pythonVerification = await verifyWithPython({
        type: solution.mathEngine.verificationType,
        original: solution.mathEngine.verificationOriginal,
        answer: solution.mathEngine.verificationAnswer,
      });
    }

    // ========================================
    // Final Verification
    // ========================================

    let verification = null;

    if (pythonVerification && pythonVerification.success === true) {
      verification = {
        verified: pythonVerification.verified === true,

        status:
          pythonVerification.verified === true
            ? "verified"
            : pythonVerification.status || "incorrect",

        type: "symbolic",

        engine: "SymPy",

        message:
          pythonVerification.verified === true
            ? "The solution was independently verified using SymPy."
            : "The solution did not pass independent mathematical verification.",

        details: pythonVerification,
      };
    } else if (
      solution.verification &&
      Array.isArray(solution.verification.expressions) &&
      solution.verification.expressions.length > 0
    ) {
      verification = verifyExpressions(solution.verification.expressions);
    } else {
      verification = {
        verified: false,
        status: "unable_to_verify",
        type: "unverified",
        engine: null,
        message:
          "This solution could not be independently verified automatically.",
        results: [],
      };
    }

    // ========================================
    // Save Question
    // ========================================

    const savedQuestion = await Question.create({
      userId: req.user.userId,

      questionText: question,

      solution,

      problemType: solution.problemType || "General Mathematics",

      concept: solution.concept || "",

      finalAnswer: solution.finalAnswer || "",

      verification,
    });

    // ========================================
    // Final Response
    // ========================================

    return res.status(200).json({
      success: true,

      question,

      solution,

      mathEngineResult,

      pythonVerification,

      verification,

      savedQuestionId: savedQuestion._id,
    });
  } catch (error) {
    console.error("Image Solve Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to solve image.",
    });
  }
};

// ========================================
// AI Tutor
// ========================================

const tutorResponse = async (req, res) => {
  try {
    const { mode, question, solution } = req.body;

    // ========================================
    // Validate Authentication
    // ========================================

    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please login.",
      });
    }

    // ========================================
    // Validate Mode
    // ========================================

    const allowedModes = ["explain", "example", "similar", "quiz"];

    if (!mode || !allowedModes.includes(mode)) {
      return res.status(400).json({
        success: false,
        message: "Invalid tutor mode.",
        allowedModes,
      });
    }

    // ========================================
    // Validate Question
    // ========================================

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required.",
      });
    }

    // ========================================
    // Validate Solution
    // ========================================

    if (!solution) {
      return res.status(400).json({
        success: false,
        message: "Solution data is required.",
      });
    }

    // ========================================
    // Generate Tutor Response
    // ========================================

    const tutorText = await generateTutorResponse({
      mode,

      question,

      solution,
    });

    // ========================================
    // Parse AI Response
    // ========================================

    let tutorData;

    try {
      tutorData = JSON.parse(tutorText);
    } catch (error) {
      console.error("Failed to parse tutor JSON:", error);

      return res.status(500).json({
        success: false,
        message: "AI returned an invalid tutor response.",
      });
    }

    // ========================================
    // Final Response
    // ========================================

    return res.status(200).json({
      success: true,

      mode,

      tutor: tutorData,
    });
  } catch (error) {
    console.error("Tutor Error:", error);

    return res.status(500).json({
      success: false,

      message: error.message || "Failed to generate tutor response.",
    });
  }
};

// ========================================
// Test Python Engine
// ========================================

const testPythonEngine = async (req, res) => {
  try {
    const result = await solveWithPython({
      expression: req.body.expression,

      operation: req.body.operation,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Python Test Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to communicate with Python engine",
    });
  }
};

// ========================================
// Exports
// ========================================

module.exports = {
  solveQuestion,
  solveImage,
  tutorResponse,
  testPythonEngine,
};
