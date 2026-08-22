const { evaluate } = require("mathjs");

const verifyExpressions = (expressions) => {
  const results = [];

  for (const expression of expressions) {
    try {
      const value = evaluate(expression);

      const isCorrect = Math.abs(Number(value)) < 0.000001;

      results.push({
        expression,
        value,
        verified: isCorrect,
      });
    } catch (error) {
      results.push({
        expression,
        value: null,
        verified: false,
        error: error.message,
      });
    }
  }

  const verified = results.length > 0 && results.every((item) => item.verified);

  return {
    verified,
    results,
  };
};

module.exports = {
  verifyExpressions,
};
