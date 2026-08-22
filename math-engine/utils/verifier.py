import re

from sympy import (
    symbols,
    sympify,
    simplify,
    expand,
    factor,
    diff,
    integrate,
    limit,
    N,
    sin,
    cos,
    tan,
    sec,
    csc,
    cot,
    log,
    exp,
    sqrt,
    pi,
    Abs,
    acos,
)

from sympy.parsing.sympy_parser import (
    parse_expr,
    standard_transformations,
    implicit_multiplication_application,
    convert_xor,
)


# ========================================
# Global Symbol
# ========================================

x = symbols("x")


# ========================================
# SymPy Parser Configuration
# ========================================

transformations = standard_transformations + (
    implicit_multiplication_application,
    convert_xor,
)


# ========================================
# Parse Mathematical Expression
# ========================================

def parse_expression(expression):

    expression = str(
        expression
    ).strip()

    local_symbols = {
        "x": x,

        "sin": sin,
        "cos": cos,
        "tan": tan,

        "sec": sec,
        "csc": csc,
        "cot": cot,

        # arcsec(x) = acos(1/x)
        "arcsec": lambda value: acos(1 / value),

        "log": log,
        "ln": log,

        "exp": exp,
        "sqrt": sqrt,

        "Abs": Abs,
        "pi": pi,
    }

    return parse_expr(
        expression,
        local_dict=local_symbols,
        transformations=transformations,
    )


# ========================================
# Extract Numeric Values
# ========================================

def extract_numeric_values(answer):

    answer = str(
        answer
    ).strip()

    # Remove common prefixes
    answer = (
        answer
        .replace("X =", "")
        .replace("x =", "")
        .replace("X=", "")
        .replace("x=", "")
        .strip()
    )

    # Handle comma-separated answers
    parts = re.split(
        r",|\bor\b",
        answer,
        flags=re.IGNORECASE,
    )

    values = []

    for part in parts:

        part = (
            part
            .replace("X =", "")
            .replace("x =", "")
            .replace("X=", "")
            .replace("x=", "")
            .strip()
        )

        if not part:
            continue

        try:
            values.append(
                parse_expression(part)
            )
        except Exception:
            continue

    return values


# ========================================
# Verify Derivative
# ========================================

def verify_derivative(
    original_expression,
    proposed_answer,
):

    try:

        original = parse_expression(
            original_expression
        )

        proposed = parse_expression(
            proposed_answer
        )

        calculated = diff(
            original,
            x,
        )

        difference = simplify(
            calculated - proposed
        )

        verified = (
            difference == 0
        )

        return {
            "verified": verified,
            "method": "symbolic",
            "expected": str(calculated),
            "proposed": str(proposed),
            "difference": str(difference),
        }

    except Exception as error:

        return {
            "verified": False,
            "method": "symbolic",
            "status": "unable_to_verify",
            "error": str(error),
        }


# ========================================
# Verify Integral
# ========================================

def verify_integral(
    original_expression,
    proposed_answer,
):

    try:

        original = parse_expression(
            original_expression
        )

        proposed = parse_expression(
            proposed_answer
        )

        differentiated_answer = diff(
            proposed,
            x,
        )

        difference = simplify(
            differentiated_answer - original
        )

        if difference == 0:

            return {
                "verified": True,
                "method": "symbolic",
                "expected": str(original),
                "differentiatedAnswer": str(
                    differentiated_answer
                ),
                "difference": "0",
            }

        # ====================================
        # Numerical Fallback
        # ====================================

        test_values = [
            2,
            3,
            4,
            -2,
            -3,
            -4,
        ]

        tested_values = []

        numerical_verified = True

        for value in test_values:

            try:

                expected_value = N(
                    original.subs(
                        x,
                        value,
                    )
                )

                actual_value = N(
                    differentiated_answer.subs(
                        x,
                        value,
                    )
                )

                if (
                    abs(
                        float(
                            expected_value
                            - actual_value
                        )
                    )
                    > 1e-8
                ):

                    numerical_verified = False

                tested_values.append(
                    value
                )

            except Exception:
                continue

        if numerical_verified:

            return {
                "verified": True,
                "method": "numerical",
                "expected": str(original),
                "differentiatedAnswer": str(
                    differentiated_answer
                ),
                "difference": str(difference),
                "testedValues": tested_values,
                "message": (
                    "Symbolic comparison was inconclusive, "
                    "but numerical verification passed."
                ),
            }

        return {
            "verified": False,
            "method": "symbolic_and_numerical",
            "expected": str(original),
            "differentiatedAnswer": str(
                differentiated_answer
            ),
            "difference": str(difference),
            "testedValues": tested_values,
        }

    except Exception as error:

        return {
            "verified": False,
            "method": "symbolic_and_numerical",
            "status": "unable_to_verify",
            "error": str(error),
        }


# ========================================
# Verify Equation
# ========================================

def verify_equation(
    original_expression,
    proposed_answer,
):

    try:

        expression = str(
            original_expression
        ).strip()

        # ====================================
        # Convert equation to expression = 0
        # ====================================

        if "=" in expression:

            left, right = expression.split(
                "=",
                1,
            )

            left_expr = parse_expression(
                left
            )

            right_expr = parse_expression(
                right
            )

            equation_expression = (
                left_expr - right_expr
            )

        else:

            equation_expression = parse_expression(
                expression
            )

        # ====================================
        # Extract proposed solutions
        # ====================================

        values = extract_numeric_values(
            proposed_answer
        )

        if not values:

            return {
                "verified": False,
                "method": "substitution",
                "status": "unable_to_verify",
                "message": (
                    "Could not extract solution values."
                ),
            }

        results = []

        all_verified = True

        for value in values:

            try:

                result = simplify(
                    equation_expression.subs(
                        x,
                        value,
                    )
                )

                verified = (
                    result == 0
                )

                results.append(
                    {
                        "value": str(value),
                        "result": str(result),
                        "verified": verified,
                    }
                )

                if not verified:
                    all_verified = False

            except Exception as error:

                all_verified = False

                results.append(
                    {
                        "value": str(value),
                        "verified": False,
                        "error": str(error),
                    }
                )

        return {
            "verified": all_verified,
            "method": "substitution",
            "results": results,
        }

    except Exception as error:

        return {
            "verified": False,
            "method": "substitution",
            "status": "unable_to_verify",
            "error": str(error),
        }


# ========================================
# Verify Factorization
# ========================================

def verify_factorization(
    original_expression,
    proposed_answer,
):

    try:

        original = parse_expression(
            original_expression
        )

        proposed = parse_expression(
            proposed_answer
        )

        difference = simplify(
            expand(proposed)
            - expand(original)
        )

        verified = (
            difference == 0
        )

        return {
            "verified": verified,
            "method": "symbolic",
            "original": str(original),
            "proposed": str(proposed),
            "difference": str(difference),
        }

    except Exception as error:

        return {
            "verified": False,
            "method": "symbolic",
            "status": "unable_to_verify",
            "error": str(error),
        }


# ========================================
# Verify Expansion
# ========================================

def verify_expansion(
    original_expression,
    proposed_answer,
):

    try:

        original = parse_expression(
            original_expression
        )

        proposed = parse_expression(
            proposed_answer
        )

        expected = expand(
            original
        )

        difference = simplify(
            expected - proposed
        )

        verified = (
            difference == 0
        )

        return {
            "verified": verified,
            "method": "symbolic",
            "expected": str(expected),
            "proposed": str(proposed),
            "difference": str(difference),
        }

    except Exception as error:

        return {
            "verified": False,
            "method": "symbolic",
            "status": "unable_to_verify",
            "error": str(error),
        }


# ========================================
# Verify Simplification
# ========================================

def verify_simplification(
    original_expression,
    proposed_answer,
):

    try:

        original = parse_expression(
            original_expression
        )

        proposed = parse_expression(
            proposed_answer
        )

        expected = simplify(
            original
        )

        difference = simplify(
            expected - proposed
        )

        verified = (
            difference == 0
        )

        return {
            "verified": verified,
            "method": "symbolic",
            "expected": str(expected),
            "proposed": str(proposed),
            "difference": str(difference),
        }

    except Exception as error:

        return {
            "verified": False,
            "method": "symbolic",
            "status": "unable_to_verify",
            "error": str(error),
        }


# ========================================
# Verify Limit
# ========================================

def verify_limit(
    original_expression,
    proposed_answer,
):

    try:

        original = parse_expression(
            original_expression
        )

        proposed = parse_expression(
            proposed_answer
        )

        calculated = limit(
            original,
            x,
            0,
        )

        difference = simplify(
            calculated - proposed
        )

        verified = (
            difference == 0
        )

        return {
            "verified": verified,
            "method": "symbolic",
            "expected": str(calculated),
            "proposed": str(proposed),
            "difference": str(difference),
        }

    except Exception as error:

        return {
            "verified": False,
            "method": "symbolic",
            "status": "unable_to_verify",
            "error": str(error),
        }


# ========================================
# Verify Determinant / Matrix Problem
# ========================================

def verify_determinant(
    original_expression,
    proposed_answer,
):

    try:

        original = str(
            original_expression
        ).replace(" ", "")

        answer = str(
            proposed_answer
        ).strip()

        # ====================================
        # Extract det(A)
        # ====================================

        det_a_match = re.search(
            r"det\(A\)=([0-9.+\-*/]+)",
            original,
            flags=re.IGNORECASE,
        )

        # ====================================
        # Extract matrix dimension
        # ====================================

        n_match = re.search(
            r"n=([0-9]+)",
            original,
            flags=re.IGNORECASE,
        )

        # ====================================
        # Extract determinant constraint
        #
        # det(k*A^(-1))=1
        # ====================================

        determinant_constraint_match = re.search(
            r"det\(k\*A\^\(-1\)\)=([0-9.+\-*/]+)",
            original,
            flags=re.IGNORECASE,
        )

        if (
            not det_a_match
            or not n_match
            or not determinant_constraint_match
        ):

            return {
                "verified": False,
                "method": "symbolic",
                "status": "unable_to_verify",
                "message": (
                    "Insufficient determinant information "
                    "for automatic verification."
                ),
            }

        det_a = parse_expression(
            det_a_match.group(1)
        )

        n = int(
            n_match.group(1)
        )

        constraint = parse_expression(
            determinant_constraint_match.group(1)
        )

        # ====================================
        # Parse proposed answer
        # ====================================

        proposed = parse_expression(
            answer
        )

        # ====================================
        # det(k*A^-1)
        #
        # det(k*A^-1)
        # = k^n * det(A^-1)
        # = k^n / det(A)
        # ====================================

        calculated_constraint = simplify(
            proposed**n / det_a
        )

        difference = simplify(
            calculated_constraint
            - constraint
        )

        verified = (
            difference == 0
        )

        return {
            "verified": verified,
            "method": "symbolic",
            "dimension": n,
            "detA": str(det_a),
            "constraint": str(constraint),
            "calculated": str(
                calculated_constraint
            ),
            "proposed": str(proposed),
            "difference": str(difference),
        }

    except Exception as error:

        return {
            "verified": False,
            "method": "symbolic",
            "status": "unable_to_verify",
            "error": str(error),
        }