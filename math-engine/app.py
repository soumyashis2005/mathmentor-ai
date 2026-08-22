from fastapi import FastAPI
from pydantic import BaseModel

from sympy import (
    symbols,
    solve,
    factor,
    expand,
    simplify,
    diff,
    integrate,
    limit,
    sympify,
    Matrix,
)

from utils.verifier import (
    verify_derivative,
    verify_integral,
    verify_equation,
    verify_factorization,
    verify_expansion,
    verify_simplification,
    verify_limit,
    verify_determinant,
)


# ========================================
# FastAPI Application
# ========================================

app = FastAPI(
    title="MathMentor Math Engine",
    description="Advanced mathematical solving and verification engine",
    version="1.0.0",
)


# ========================================
# Symbols
# ========================================

x = symbols("x")


# ========================================
# Request Models
# ========================================

class MathRequest(BaseModel):
    expression: str
    operation: str


class VerificationRequest(BaseModel):
    type: str
    original: str
    answer: str


# ========================================
# Home
# ========================================

@app.get("/")
def home():
    return {
        "success": True,
        "message": "MathMentor Math Engine is running 🧠🐍",
    }


# ========================================
# Health Check
# ========================================

@app.get("/health")
def health():
    return {
        "success": True,
        "status": "healthy",
    }


# ========================================
# Test Math Engine
# ========================================

@app.post("/test")
def test_math():
    expression = x**2 - 5 * x + 6

    factored = factor(expression)

    solutions = solve(
        expression,
        x,
    )

    expanded = expand(
        (x - 2) * (x - 3)
    )

    return {
        "success": True,
        "original": str(expression),
        "factored": str(factored),
        "solutions": [
            str(solution)
            for solution in solutions
        ],
        "expanded": str(expanded),
    }


# ========================================
# Solve / Math Engine
# ========================================

@app.post("/solve")
def solve_math(request: MathRequest):
    expression = request.expression.strip()
    operation = request.operation.strip().lower()

    try:
        # ====================================
        # SOLVE
        # ====================================

        if operation == "solve":

            if "=" in expression:
                left, right = expression.split(
                    "=",
                    1,
                )

                left_expr = sympify(
                    left,
                    locals={"x": x},
                )

                right_expr = sympify(
                    right,
                    locals={"x": x},
                )

                equation = left_expr - right_expr

                result = solve(
                    equation,
                    x,
                )

            else:
                expr = sympify(
                    expression,
                    locals={"x": x},
                )

                result = solve(
                    expr,
                    x,
                )

            return {
                "success": True,
                "operation": "solve",
                "expression": expression,
                "result": [
                    str(value)
                    for value in result
                ],
            }

        # ====================================
        # SIMPLIFY
        # ====================================

        elif operation == "simplify":

            expr = sympify(
                expression,
                locals={"x": x},
            )

            result = simplify(expr)

            return {
                "success": True,
                "operation": "simplify",
                "expression": expression,
                "result": str(result),
            }

        # ====================================
        # DERIVATIVE
        # ====================================

        elif operation == "derivative":

            expr = sympify(
                expression,
                locals={"x": x},
            )

            result = diff(
                expr,
                x,
            )

            return {
                "success": True,
                "operation": "derivative",
                "expression": expression,
                "result": str(result),
            }

        # ====================================
        # INTEGRAL
        # ====================================

        elif operation == "integral":

            expr = sympify(
                expression,
                locals={"x": x},
            )

            result = integrate(
                expr,
                x,
            )

            return {
                "success": True,
                "operation": "integral",
                "expression": expression,
                "result": str(result),
            }

        # ====================================
        # LIMIT
        # ====================================

        elif operation == "limit":

            expr = sympify(
                expression,
                locals={"x": x},
            )

            result = limit(
                expr,
                x,
                0,
            )

            return {
                "success": True,
                "operation": "limit",
                "expression": expression,
                "result": str(result),
            }

        # ====================================
        # FACTOR
        # ====================================

        elif operation == "factor":

            expr = sympify(
                expression,
                locals={"x": x},
            )

            result = factor(expr)

            return {
                "success": True,
                "operation": "factor",
                "expression": expression,
                "result": str(result),
            }

        # ====================================
        # EXPAND
        # ====================================

        elif operation == "expand":

            expr = sympify(
                expression,
                locals={"x": x},
            )

            result = expand(expr)

            return {
                "success": True,
                "operation": "expand",
                "expression": expression,
                "result": str(result),
            }

        # ====================================
        # MATRIX
        # ====================================

        elif operation == "matrix":

            # --------------------------------
            # Matrix expressions that contain
            # determinant constraints are
            # primarily verified through the
            # determinant verifier.
            # --------------------------------

            matrix_expression = expression.strip()

            # --------------------------------
            # Literal Matrix expression
            #
            # Example:
            #
            # Matrix([[1, 2], [3, 4]])
            # --------------------------------

            if matrix_expression.startswith("Matrix("):

                matrix = sympify(
                    matrix_expression,
                    locals={
                        "Matrix": Matrix,
                    },
                )

                return {
                    "success": True,
                    "operation": "matrix",
                    "expression": expression,
                    "result": str(matrix),
                }

            # --------------------------------
            # Determinant constraint
            #
            # Example:
            #
            # det(A)=4
            # --------------------------------

            if "det(" in matrix_expression.lower():

                return {
                    "success": True,
                    "operation": "matrix",
                    "expression": expression,
                    "result": (
                        "Matrix/determinant problem "
                        "delegated to verification engine"
                    ),
                }

            return {
                "success": False,
                "operation": "matrix",
                "message": "Unsupported matrix expression",
            }

        # ====================================
        # UNSUPPORTED OPERATION
        # ====================================

        else:

            return {
                "success": False,
                "operation": operation,
                "message": "Unsupported mathematical operation",
            }

    # ========================================
    # ERROR HANDLING
    # ========================================

    except Exception as error:

        return {
            "success": False,
            "operation": operation,
            "message": str(error),
        }


# ========================================
# Mathematical Verification
# ========================================

@app.post("/verify")
def verify_math(
    request: VerificationRequest,
):

    verification_type = (
        request.type
        .lower()
        .strip()
    )

    try:

        # ====================================
        # DERIVATIVE
        # ====================================

        if verification_type == "derivative":

            result = verify_derivative(
                request.original,
                request.answer,
            )

            return {
                "success": True,
                "type": "derivative",
                **result,
            }

        # ====================================
        # INTEGRAL
        # ====================================

        elif verification_type == "integral":

            result = verify_integral(
                request.original,
                request.answer,
            )

            return {
                "success": True,
                "type": "integral",
                **result,
            }

        # ====================================
        # EQUATION
        # ====================================

        elif verification_type == "equation":

            result = verify_equation(
                request.original,
                request.answer,
            )

            return {
                "success": True,
                "type": "equation",
                **result,
            }

        # ====================================
        # FACTORIZATION
        # ====================================

        elif verification_type in (
            "factor",
            "factorization",
        ):

            result = verify_factorization(
                request.original,
                request.answer,
            )

            return {
                "success": True,
                "type": "factor",
                **result,
            }

        # ====================================
        # DETERMINANT / MATRIX
        # ====================================

        elif verification_type in (
            "determinant",
            "matrix",
        ):

            result = verify_determinant(
                request.original,
                request.answer,
            )

            return {
                "success": True,
                "type": "determinant",
                **result,
            }

        # ====================================
        # EXPANSION
        # ====================================

        elif verification_type in (
            "expand",
            "expansion",
        ):

            result = verify_expansion(
                request.original,
                request.answer,
            )

            return {
                "success": True,
                "type": "expand",
                **result,
            }

        # ====================================
        # SIMPLIFICATION
        # ====================================

        elif verification_type in (
            "simplify",
            "simplification",
        ):

            result = verify_simplification(
                request.original,
                request.answer,
            )

            return {
                "success": True,
                "type": "simplify",
                **result,
            }

        # ====================================
        # LIMIT
        # ====================================

        elif verification_type == "limit":

            result = verify_limit(
                request.original,
                request.answer,
            )

            return {
                "success": True,
                "type": "limit",
                **result,
            }

        # ====================================
        # UNSUPPORTED
        # ====================================

        else:

            return {
                "success": True,
                "verified": False,
                "type": verification_type,
                "status": "unable_to_verify",
                "message": (
                    "This solution could not be independently "
                    "verified by the current mathematical "
                    "verification engine."
                ),
            }

    # ========================================
    # VERIFICATION ERROR HANDLING
    # ========================================

    except Exception as error:

        return {
            "success": False,
            "verified": False,
            "type": verification_type,
            "message": str(error),
        }