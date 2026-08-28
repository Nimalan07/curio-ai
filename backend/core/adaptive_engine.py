from typing import Dict

DIFFICULTY_LEVELS = {
    1: "basic",
    2: "clarifying",
    3: "application",
    4: "deep_reasoning",
    5: "transfer"
}

def clamp(value: int, minimum: int = 1, maximum: int = 5) -> int:
    return max(minimum, min(maximum, value))

def update_difficulty(
    current_level: int,
    answer_quality: float,
    confidence: int | None = None,
) -> int:
    """
    answer_quality: 0.0 - 1.0

    High-quality explanations -> harder questions.
    Weak explanations -> easier questions.
    """
    level = current_level

    if answer_quality >= 0.82:
        level += 1
    elif answer_quality <= 0.40:
        level -= 1

    # Confidence is used only as a small signal.
    # We don't let self-confidence override actual performance.
    if confidence is not None:
        if confidence >= 9 and answer_quality < 0.55:
            level -= 1
        elif confidence <= 4 and answer_quality >= 0.75:
            level += 1

    return clamp(level)

def difficulty_name(level: int) -> str:
    return DIFFICULTY_LEVELS.get(level, "clarifying")

def build_difficulty_instruction(level: int) -> str:
    instructions = {
        1: """
Ask a very simple clarification question.
Focus on one missing fact.
Do not introduce a new concept.
""",
        2: """
Ask a targeted follow-up question.
Check whether the student can explain an important step.
Keep the cognitive load moderate.
""",
        3: """
Ask the student to apply the concept to a simple situation.
Test whether they understand the concept beyond memorization.
""",
        4: """
Ask a deeper reasoning question.
Make the student connect causes, mechanisms, or consequences.
Do not give away the answer.
""",
        5: """
Ask a transfer question.
Connect the concept to a new situation, related concept, or edge case.
The goal is deep conceptual understanding.
"""
    }
    return instructions.get(level, instructions[2])
