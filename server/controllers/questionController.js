const Question = require("../models/Question");

// ========================================
// Get All Questions For Logged-in User
// ========================================

const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find({
      userId: req.user.userId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: questions.length,
      questions,
    });
  } catch (error) {
    console.error("History Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch question history",
    });
  }
};

// ========================================
// Get Single Question
// Only if it belongs to logged-in user
// ========================================

const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    res.status(200).json({
      success: true,
      question,
    });
  } catch (error) {
    console.error("Question Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch question",
    });
  }
};

// ========================================
// Delete Single Question
// Only user's own question
// ========================================

const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    await Question.deleteOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    res.status(200).json({
      success: true,

      message: "Question deleted successfully",

      deletedQuestionId: req.params.id,
    });
  } catch (error) {
    console.error("Delete Question Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete question",
    });
  }
};

// ========================================
// Delete All Questions
// ONLY logged-in user's questions
// ========================================

const deleteAllQuestions = async (req, res) => {
  try {
    const result = await Question.deleteMany({
      userId: req.user.userId,
    });

    res.status(200).json({
      success: true,

      message: "Your question history deleted successfully",

      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Delete All Questions Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete question history",
    });
  }
};

// ========================================
// Exports
// ========================================

module.exports = {
  getQuestions,
  getQuestionById,
  deleteQuestion,
  deleteAllQuestions,
};
