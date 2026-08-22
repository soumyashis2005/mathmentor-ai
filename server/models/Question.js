const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    // ========================================
    // User Reference
    // ========================================

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // ========================================
    // Question
    // ========================================

    questionText: {
      type: String,
      required: true,
      trim: true,
    },

    // ========================================
    // Solution
    // ========================================

    solution: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    // ========================================
    // Problem Information
    // ========================================

    problemType: {
      type: String,
      default: "General Mathematics",
    },

    concept: {
      type: String,
      default: "",
    },

    finalAnswer: {
      type: String,
      default: "",
    },

    // ========================================
    // Verification
    // ========================================

    verification: {
      verified: {
        type: Boolean,
        default: false,
      },

      status: {
        type: String,
        default: "unable_to_verify",
      },

      type: {
        type: String,
        default: "",
      },

      engine: {
        type: String,
        default: "",
      },

      message: {
        type: String,
        default: "",
      },

      results: {
        type: mongoose.Schema.Types.Mixed,
        default: [],
      },

      details: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  },
);

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
