const axios = require("axios");

const PYTHON_ENGINE_URL =
  process.env.PYTHON_ENGINE_URL || "http://127.0.0.1:8000";

// ========================================
// Solve using Python + SymPy
// ========================================

const solveWithPython = async (data) => {
  try {
    const response = await axios.post(`${PYTHON_ENGINE_URL}/solve`, data);

    return response.data;
  } catch (error) {
    console.error("Python Math Engine Error:", error.message);

    return {
      success: false,
      message: "Python math engine unavailable",
    };
  }
};

// ========================================
// Verify using Python + SymPy
// ========================================

const verifyWithPython = async (data) => {
  try {
    const response = await axios.post(`${PYTHON_ENGINE_URL}/verify`, data);

    return response.data;
  } catch (error) {
    console.error("Python Verification Error:", error.message);

    return {
      success: false,
      verified: false,
      message: "Python verification engine unavailable",
    };
  }
};

module.exports = {
  solveWithPython,
  verifyWithPython,
};
