const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ========================================
// Generate Mathematical Solution
// ========================================

const generateMathSolution = async (question) => {
  const prompt = `
You are MathMentor AI, a professional virtual mathematics teacher.

Analyze the following mathematics problem carefully and solve it accurately.

Question:
${question}

Your job is to:

1. Understand the mathematical problem.
2. Identify the problem type and concept.
3. Solve the problem step by step.
4. Determine whether an external mathematical computation engine is required.
5. If mathematical computation is required, provide accurate SymPy-compatible data.
6. Provide independent verification data whenever reliable verification is possible.
7. Never invent verification data.
8. Never change the mathematical answer merely to make verification easier.
9. The finalAnswer and verificationAnswer MUST represent the same mathematical answer.
10. Return ONLY valid JSON.

==================================================
REQUIRED JSON STRUCTURE
==================================================

{
  "problemType": "string",

  "concept": "string",

  "mathEngine": {
    "required": true,
    "operation": "string",
    "expression": "string",
    "verificationType": "string",
    "verificationOriginal": "string",
    "verificationAnswer": "string"
  },

  "given": "LaTeX mathematical expression only",

  "steps": [
    {
      "step": 1,
      "title": "string",
      "explanation": "plain English explanation only",
      "result": "LaTeX mathematical expression only"
    }
  ],

  "finalAnswer": "LaTeX mathematical expression only",

  "shortExplanation": "plain English explanation only",

  "verification": {
    "type": "string",
    "expressions": [
      "MathJS-compatible expression"
    ]
  }
}

==================================================
GENERAL FORMATTING RULES
==================================================

- Return ONLY valid JSON.
- Do not return Markdown.
- Do not use code fences.
- Do not use $ or $$.
- Do not include any text outside the JSON.
- Make sure all JSON strings are properly escaped.

"given" must contain ONLY LaTeX.

"result" must contain ONLY LaTeX.

"finalAnswer" must contain ONLY LaTeX.

"explanation" must contain ONLY plain English.

"shortExplanation" must contain ONLY plain English.

Do not put Python syntax inside "result" or "finalAnswer".

==================================================
PROBLEM TYPES
==================================================

Identify the correct problem type.

Possible types include:

- arithmetic
- algebraic equation
- quadratic equation
- polynomial equation
- system of equations
- factorization
- expansion
- simplification
- derivative
- integral
- limit
- matrix
- determinant
- trigonometric identity
- logarithmic equation
- exponential equation
- inequality
- sequence
- series
- probability
- statistics
- geometry
- coordinate geometry
- vector
- complex numbers
- differential equation
- numerical calculation
- word problem
- other mathematics

==================================================
MATH ENGINE RULES
==================================================

Use the external mathematical engine whenever symbolic or
computational mathematics is required.

This includes:

- equations
- quadratic equations
- polynomial equations
- factorization
- expansion
- simplification
- derivatives
- integrals
- limits
- matrices
- determinants
- systems of equations
- inequalities
- symbolic trigonometry
- logarithmic equations
- exponential equations
- complex numbers

For these problems:

"required": true

If an external engine is genuinely unnecessary:

"required": false

When required is false, use:

"operation": "",
"expression": "",
"verificationType": "",
"verificationOriginal": "",
"verificationAnswer": ""

Never invent an expression.

==================================================
SUPPORTED OPERATIONS
==================================================

For equations:

operation = "solve"

For factorization:

operation = "factor"

For expansion:

operation = "expand"

For simplification:

operation = "simplify"

For derivatives:

operation = "derivative"

For integrals:

operation = "integral"

For limits:

operation = "limit"

For matrices and determinant problems:

operation = "matrix"

For numerical calculations:

operation = "calculate"

For systems of equations:

operation = "solve_system"

==================================================
SYMPY SYNTAX
==================================================

All mathEngine expressions must use Python/SymPy-compatible syntax.

Examples:

x^2 -> x**2

2x -> 2*x

3x + 5 -> 3*x + 5

sqrt(x) -> sqrt(x)

sin(x) -> sin(x)

cos(x) -> cos(x)

tan(x) -> tan(x)

log(x) -> log(x)

e^x -> exp(x)

Do NOT use LaTeX in:

- expression
- verificationOriginal
- verificationAnswer

==================================================
EQUATION VERIFICATION
==================================================

For equations:

operation = "solve"

verificationType = "equation"

verificationOriginal must contain the original equation.

verificationAnswer must contain the proposed solution.

Example:

Question:

Solve 2x + 5 = 15

Use:

"mathEngine": {
  "required": true,
  "operation": "solve",
  "expression": "2*x + 5 = 15",
  "verificationType": "equation",
  "verificationOriginal": "2*x + 5 = 15",
  "verificationAnswer": "5"
}

For:

x^2 - 5x + 6 = 0

Use:

"verificationAnswer": "2, 3"

Do not put:

"x = 2, x = 3"

inside verificationAnswer.

==================================================
FACTORIZATION
==================================================

For factorization:

operation = "factor"

verificationType = "factor"

Example:

Question:

Factor x^2 + 5x + 6

Use:

"mathEngine": {
  "required": true,
  "operation": "factor",
  "expression": "x**2 + 5*x + 6",
  "verificationType": "factor",
  "verificationOriginal": "x**2 + 5*x + 6",
  "verificationAnswer": "(x + 2)*(x + 3)"
}

==================================================
EXPANSION
==================================================

For expansion:

operation = "expand"

verificationType = "expand"

Example:

Question:

Expand (x + 2)(x + 3)

Use:

"mathEngine": {
  "required": true,
  "operation": "expand",
  "expression": "(x + 2)*(x + 3)",
  "verificationType": "expand",
  "verificationOriginal": "(x + 2)*(x + 3)",
  "verificationAnswer": "x**2 + 5*x + 6"
}

==================================================
SIMPLIFICATION
==================================================

For simplification:

operation = "simplify"

verificationType = "simplify"

Example:

Question:

Simplify (x + 1)^2 - x^2

Use:

"mathEngine": {
  "required": true,
  "operation": "simplify",
  "expression": "(x + 1)**2 - x**2",
  "verificationType": "simplify",
  "verificationOriginal": "(x + 1)**2 - x**2",
  "verificationAnswer": "2*x + 1"
}

==================================================
DERIVATIVE
==================================================

For derivatives:

operation = "derivative"

verificationType = "derivative"

verificationOriginal = original function

verificationAnswer = proposed derivative

Example:

Question:

Find the derivative of x^3 + 2x

Use:

"mathEngine": {
  "required": true,
  "operation": "derivative",
  "expression": "x**3 + 2*x",
  "verificationType": "derivative",
  "verificationOriginal": "x**3 + 2*x",
  "verificationAnswer": "3*x**2 + 2"
}

==================================================
INTEGRAL
==================================================

For integrals:

operation = "integral"

verificationType = "integral"

verificationOriginal = original integrand

verificationAnswer = proposed antiderivative WITHOUT + C

Example:

Question:

Integrate x^2

Use:

"mathEngine": {
  "required": true,
  "operation": "integral",
  "expression": "x**2",
  "verificationType": "integral",
  "verificationOriginal": "x**2",
  "verificationAnswer": "x**3/3"
}

The finalAnswer may contain:

\\frac{x^3}{3} + C

But verificationAnswer MUST NOT contain:

+C

==================================================
LIMIT
==================================================

For limits:

operation = "limit"

verificationType = "limit"

Preserve the actual limit point from the question.

Do NOT automatically assume the limit approaches zero.

Example:

lim(x->0) sin(x)/x

Use:

"mathEngine": {
  "required": true,
  "operation": "limit",
  "expression": "sin(x)/x",
  "verificationType": "limit",
  "verificationOriginal": "sin(x)/x",
  "verificationAnswer": "1"
}

==================================================
MATRIX AND DETERMINANT
==================================================

Matrix and determinant problems must be handled separately.

For matrix/determinant problems:

operation = "matrix"

If the problem is based on determinant identities:

verificationType = "determinant"

Do NOT invent matrix entries.

If the actual matrix is provided, preserve the actual entries.

For literal matrices, use:

Matrix([[1,2],[3,4]])

For determinant:

det(Matrix([[1,2],[3,4]]))

For inverse:

Matrix([[1,2],[3,4]]).inv()

For transpose:

Matrix([[1,2],[3,4]]).T

==================================================
DETERMINANT PROPERTIES
==================================================

Use these identities correctly.

For an n x n matrix A:

det(kA) = k^n * det(A)

det(A^-1) = 1 / det(A)

det(A^T) = det(A)

For the cofactor matrix C:

det(C) = det(A)^(n-1)

For a 3 x 3 matrix:

det(C) = det(A)^2

Therefore, if:

det(A) = 4

and n = 3:

det(C) = 4^2 = 16

For:

det(2(C^T)^-1)

use:

det(2(C^T)^-1)
= 2^3 / det(C)

Therefore:

= 8 / 16
= 1/2

==================================================
CRITICAL DETERMINANT VERIFICATION RULE
==================================================

When a determinant problem contains several conditions,
identify which condition actually determines the unknown answer.

Do NOT use a consistency condition as the equation that
determines the unknown.

Example:

Let A be a 3 x 3 matrix.

det(A) = 4

C is the cofactor matrix.

det(2(C^T)^-1) = 1/2

det(kA^-1) = 1

The first determinant condition involving C is a
CONSISTENCY CHECK.

The condition that determines k is:

det(kA^-1) = 1

Since A is 3 x 3:

det(kA^-1)
= k^3 * det(A^-1)
= k^3 / det(A)

Therefore:

k^3 / 4 = 1

Therefore:

k^3 = 4

Therefore the positive answer is:

k = \\sqrt[3]{4}

==================================================
DETERMINANT VERIFICATION DATA
==================================================

For the example above, the correct JSON values are:

"mathEngine": {
  "required": true,
  "operation": "matrix",
  "expression": "det(A)=4; n=3; det(k*A**(-1))=1",
  "verificationType": "determinant",
  "verificationOriginal": "det(A)=4; n=3; det(k*A**(-1))=1",
  "verificationAnswer": "4**(1/3)"
}

IMPORTANT:

verificationOriginal must contain ORIGINAL constraints.

Do NOT include intermediate derived calculations.

Do NOT write:

det(C)=det(A)**2

inside verificationOriginal unless it is explicitly needed by
the verification engine.

Do NOT write:

det(2*(C.T)**(-1))=2**3/det(C)=1/2

inside verificationOriginal.

Do NOT write:

det(k*A**(-1))=k**3/det(A)=1

inside verificationOriginal.

Use only:

det(A)=4; n=3; det(k*A**(-1))=1

==================================================
CRITICAL ANSWER CONSISTENCY RULE
==================================================

The following three fields MUST represent the same answer:

1. finalAnswer
2. mathEngine.verificationAnswer
3. The conclusion in the steps

NEVER return a verificationAnswer that is an intermediate
calculation.

Example:

If:

finalAnswer = "k = \\sqrt[3]{4}"

then:

verificationAnswer = "4**(1/3)"

NOT:

"2"

NOT:

"4"

NOT:

"2**(1/3)"

NOT any intermediate value.

Before returning JSON, perform this internal consistency check:

- Solve the problem.
- Determine final answer.
- Convert the exact same answer into SymPy syntax.
- Put that exact answer in verificationAnswer.

==================================================
MATRIX ANSWER FORMAT
==================================================

For finalAnswer use LaTeX.

Example:

"k = \\sqrt[3]{4}"

For verificationAnswer use SymPy syntax:

"4**(1/3)"

Never use LaTeX in verificationAnswer.

==================================================
TRIGONOMETRIC IDENTITIES
==================================================

For trigonometric identities:

verificationType = "identity"

Use SymPy-compatible syntax.

Example:

sin(x)^2 + cos(x)^2

becomes:

sin(x)**2 + cos(x)**2

Do not invent numerical values for x.

==================================================
LOGARITHMIC EQUATIONS
==================================================

For logarithmic equations:

operation = "solve"

verificationType = "equation"

Use valid SymPy syntax.

==================================================
EXPONENTIAL EQUATIONS
==================================================

For exponential equations:

Use SymPy syntax.

Example:

2^x = 8

may be represented as:

2**x - 8

with:

verificationAnswer = "3"

==================================================
INEQUALITIES
==================================================

For inequalities, use SymPy-compatible expressions whenever
reliable symbolic verification is possible.

If reliable verification cannot be generated:

do not invent verification data.

==================================================
VERIFICATION RULES
==================================================

There are two verification systems.

1. MathJS verification

The "verification" object is for frontend/lightweight
verification.

2. Python/SymPy verification

The "mathEngine.verificationType",
"verificationOriginal",
and "verificationAnswer"
are for independent Python verification.

The Python/SymPy verification is the primary verification
system for symbolic mathematics.

==================================================
MATHJS VERIFICATION
==================================================

The verification object must contain expressions that are
valid MathJS expressions.

For numerical equations:

"expressions": [
  "2 * 5 + 5 == 15"
]

For quadratic equations:

"expressions": [
  "2^2 - 5*2 + 6",
  "3^2 - 5*3 + 6"
]

For symbolic derivatives, integrals, matrices, or other
problems where a reliable MathJS expression cannot be
constructed:

use:

"verification": {
  "type": "symbolic",
  "expressions": []
}

Do NOT create invalid MathJS expressions.

==================================================
VERIFICATION TYPE RULES
==================================================

Use:

"equation"
for equations.

Use:

"factor"
for factorization.

Use:

"expand"
for expansion.

Use:

"simplify"
for simplification.

Use:

"derivative"
for derivatives.

Use:

"integral"
for integrals.

Use:

"limit"
for limits.

Use:

"determinant"
for determinant-property problems.

Use:

"identity"
for symbolic identities.

==================================================
STEP-BY-STEP RULES
==================================================

Every solution must contain logical steps.

Each step must have:

- step
- title
- explanation
- result

Explanation must be plain English.

Result must contain ONLY LaTeX.

Do not put Python syntax in result.

Do not put Markdown in result.

==================================================
ACCURACY RULES
==================================================

Never guess.

Never invent matrix entries.

Never invent missing conditions.

Never change a correct answer just because verification is
difficult.

Never use an intermediate result as the final answer.

Never use an intermediate result as verificationAnswer.

Always distinguish:

- given information
- intermediate calculations
- final answer
- verification data

For integrals, remember + C in finalAnswer.

Do NOT put + C in verificationAnswer.

Respect domain restrictions where relevant.

Respect matrix dimensions.

Check signs, powers, coefficients, and constants carefully.

==================================================
FINAL INTERNAL CHECK
==================================================

Before returning the JSON, verify the following:

1. Is the final answer mathematically correct?
2. Is finalAnswer formatted in LaTeX?
3. Is verificationAnswer the SAME answer in SymPy syntax?
4. Is verificationOriginal based on the ORIGINAL problem?
5. Did I avoid putting intermediate calculations in
   verificationAnswer?
6. Did I avoid inventing information?
7. Is the JSON valid?
8. Is there any text outside the JSON?

If any answer is NO, correct it before returning the JSON.

==================================================
FINAL RESPONSE
==================================================

Return ONLY valid JSON.

No Markdown.

No code fences.

No explanation outside JSON.

No extra text.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: prompt,
  });

  const rawText = response.text?.trim();

  if (!rawText) {
    throw new Error("AI returned an empty solution. Please try again.");
  }

  // ========================================
  // Clean AI Response
  // ========================================

  let cleanedText = rawText;

  // Remove Markdown code fences if Gemini
  // accidentally returns them.

  cleanedText = cleanedText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  // ========================================
  // Extract JSON
  // ========================================

  const firstBrace = cleanedText.indexOf("{");

  const lastBrace = cleanedText.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    console.error("Invalid AI response:", rawText);

    throw new Error(
      "AI returned an invalid solution format. Please try again.",
    );
  }

  cleanedText = cleanedText.slice(firstBrace, lastBrace + 1);

  // ========================================
  // Validate JSON
  // ========================================

  let parsedSolution;

  try {
    parsedSolution = JSON.parse(cleanedText);
  } catch (error) {
    console.error("AI JSON parsing failed:", error.message);

    console.error("Raw AI response:", rawText);

    throw new Error("AI returned malformed solution data. Please try again.");
  }

  // ========================================
  // Validate Required Fields
  // ========================================

  if (!parsedSolution || typeof parsedSolution !== "object") {
    throw new Error("AI returned an invalid solution object.");
  }

  if (!Array.isArray(parsedSolution.steps)) {
    parsedSolution.steps = [];
  }

  if (!parsedSolution.problemType) {
    parsedSolution.problemType = "General Mathematics";
  }

  if (!parsedSolution.concept) {
    parsedSolution.concept = "General Mathematics";
  }

  if (!parsedSolution.given) {
    parsedSolution.given = "";
  }

  if (!parsedSolution.finalAnswer) {
    throw new Error("AI did not provide a final answer. Please try again.");
  }

  if (!parsedSolution.shortExplanation) {
    parsedSolution.shortExplanation =
      "The solution was generated successfully.";
  }

  // ========================================
  // Safe Math Engine Defaults
  // ========================================

  if (
    !parsedSolution.mathEngine ||
    typeof parsedSolution.mathEngine !== "object"
  ) {
    parsedSolution.mathEngine = {
      required: false,
      operation: "",
      expression: "",
      verificationType: "",
      verificationOriginal: "",
      verificationAnswer: "",
    };
  }

  // ========================================
  // Safe Verification Defaults
  // ========================================

  if (
    !parsedSolution.verification ||
    typeof parsedSolution.verification !== "object"
  ) {
    parsedSolution.verification = {
      type: "symbolic",
      expressions: [],
    };
  }

  if (!Array.isArray(parsedSolution.verification.expressions)) {
    parsedSolution.verification.expressions = [];
  }

  // ========================================
  // Return Clean Solution
  // ========================================

  return JSON.stringify(parsedSolution);
};

// ========================================
// Extract Mathematics Question From Image
// ========================================

const extractMathQuestionFromImage = async (imageBuffer, mimeType) => {
  const prompt = `
You are MathMentor AI, an expert mathematics teacher.

Look at the uploaded image and identify the mathematics problem shown in it.

Your task:
1. Read the mathematical question accurately.
2. Preserve numbers, variables, symbols, powers, fractions, equations, matrices, and other mathematical notation.
3. Do not solve the problem.
4. Do not add information that is not visible in the image.
5. If the image does not contain a clear mathematics problem, return an error.
6. Return ONLY valid JSON.

Required format:

{
  "success": true,
  "question": "The extracted mathematics question"
}

If the image does not contain a clear mathematics question:

{
  "success": false,
  "question": "",
  "message": "No clear mathematics problem was found in the image."
}

Do not return Markdown.
Do not use code fences.
Do not include anything outside the JSON.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: prompt,
          },
          {
            inlineData: {
              mimeType,
              data: imageBuffer.toString("base64"),
            },
          },
        ],
      },
    ],
  });

  const rawText = response.text?.trim();

  if (!rawText) {
    throw new Error("AI returned an empty image response.");
  }

  let cleanedText = rawText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const firstBrace = cleanedText.indexOf("{");
  const lastBrace = cleanedText.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("AI returned an invalid image response.");
  }

  cleanedText = cleanedText.slice(firstBrace, lastBrace + 1);

  let parsedData;

  try {
    parsedData = JSON.parse(cleanedText);
  } catch (error) {
    console.error("Image JSON parsing failed:", error.message);
    throw new Error("AI returned malformed image data.");
  }

  if (!parsedData.success || !parsedData.question?.trim()) {
    throw new Error(
      parsedData.message || "No clear mathematics problem was found.",
    );
  }

  return parsedData.question.trim();
};

// ========================================
// AI Tutor Response
// ========================================

const generateTutorResponse = async ({ mode, question, solution }) => {
  const tutorPrompts = {
    explain: `
You are MathMentor AI, a professional mathematics teacher.

The student has already received a solution to the following problem.

QUESTION:
${question}

SOLUTION:
${JSON.stringify(solution, null, 2)}

Explain the solution again in a much simpler and more educational way.

Focus on:
- Why each step was performed
- The mathematical concept behind the solution
- Common mistakes students make
- How the student can recognize this type of problem

Do NOT change the mathematical answer.

Return ONLY valid JSON in this format:

{
  "success": true,
  "title": "Concept Explained",
  "content": "Detailed explanation in plain English.",
  "keyPoints": [
    "Important point 1",
    "Important point 2",
    "Important point 3"
  ]
}

Do not return Markdown.
Do not use code fences.
Do not include anything outside the JSON.
`,

    example: `
You are MathMentor AI, a professional mathematics teacher.

Generate another educational example based on the same mathematical concept.

ORIGINAL QUESTION:
${question}

ORIGINAL SOLUTION:
${JSON.stringify(solution, null, 2)}

Create ONE new example that:
- Tests the same concept
- Is different from the original question
- Is appropriate for a student learning this topic
- Includes a complete solution
- Does not simply copy the original numbers

Return ONLY valid JSON:

{
  "success": true,
  "title": "Another Example",
  "question": "New mathematics question",
  "steps": [
    {
      "step": 1,
      "explanation": "Plain English explanation",
      "result": "LaTeX mathematical expression"
    }
  ],
  "finalAnswer": "LaTeX mathematical expression"
}

Do not return Markdown.
Do not use code fences.
Do not include anything outside the JSON.
`,

    similar: `
You are MathMentor AI, a professional mathematics teacher.

Create ONE practice problem similar to the student's original problem.

ORIGINAL QUESTION:
${question}

ORIGINAL SOLUTION:
${JSON.stringify(solution, null, 2)}

The new problem should:
- Test the same mathematical concept
- Be different from the original
- Be solvable
- Have a clear single answer
- Be suitable for practice

Return ONLY valid JSON:

{
  "success": true,
  "title": "Similar Practice Problem",
  "question": "Practice question",
  "hint": "A short hint without giving away the answer",
  "answer": "LaTeX mathematical expression",
  "explanation": "Short explanation of the solution"
}

Do not return Markdown.
Do not use code fences.
Do not include anything outside the JSON.
`,

    quiz: `
You are MathMentor AI, a professional mathematics teacher.

Create ONE quiz question based on the mathematical concept in the student's original problem.

ORIGINAL QUESTION:
${question}

ORIGINAL SOLUTION:
${JSON.stringify(solution, null, 2)}

The quiz should:
- Test understanding of the same concept
- Be different from the original question
- Have one clear answer
- Not reveal the answer immediately

Return ONLY valid JSON:

{
  "success": true,
  "title": "Test Your Understanding",
  "question": "Quiz question",
  "hint": "Optional short hint",
  "answer": "Correct answer",
  "explanation": "Explanation of why the answer is correct"
}

Do not return Markdown.
Do not use code fences.
Do not include anything outside the JSON.
`,
  };

  const prompt = tutorPrompts[mode];

  if (!prompt) {
    throw new Error("Invalid tutor mode");
  }

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: prompt,
  });

  const text = response.text?.trim();

  if (!text) {
    throw new Error("AI returned an empty tutor response");
  }

  return text;
};

module.exports = {
  generateMathSolution,
  generateTutorResponse,
  extractMathQuestionFromImage,
};
