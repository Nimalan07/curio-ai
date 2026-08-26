import json
import re
from typing import Any, Dict


REQUIRED_FIELDS = {
    "clarity_score",
    "completeness_score",
    "accuracy_score",
    "depth_score",
    "well_explained",
    "gaps_found",
    "misconception_flags",
    "suggested_review",
}


def strip_markdown_fences(text: str) -> str:
    """
    Remove markdown code fences from LLM output.
    """

    text = text.strip()

    text = re.sub(
        r"^```(?:json)?\s*",
        "",
        text,
        flags=re.IGNORECASE
    )

    text = re.sub(
        r"\s*```$",
        "",
        text
    )

    return text.strip()


def extract_json_object(text: str) -> str:
    """
    Extract the outermost JSON object if the model
    included additional text.
    """

    text = strip_markdown_fences(text)

    start = text.find("{")
    end = text.rfind("}")

    if start == -1 or end == -1 or end <= start:
        raise ValueError(
            "No JSON object found in model output."
        )

    return text[start:end + 1]


def validate_report(report: Dict[str, Any]) -> Dict[str, Any]:
    """
    Validate the structure of the Curio report.
    """

    missing_fields = REQUIRED_FIELDS - set(report.keys())

    if missing_fields:
        raise ValueError(
            f"Missing required fields: {sorted(missing_fields)}"
        )

    score_fields = [
        "clarity_score",
        "completeness_score",
        "accuracy_score",
        "depth_score",
    ]

    for field in score_fields:

        value = report[field]

        if not isinstance(value, int):
            raise ValueError(
                f"{field} must be an integer."
            )

        if not 1 <= value <= 10:
            raise ValueError(
                f"{field} must be between 1 and 10."
            )

    list_fields = [
        "well_explained",
        "gaps_found",
        "misconception_flags",
        "suggested_review",
    ]

    for field in list_fields:

        if not isinstance(report[field], list):
            raise ValueError(
                f"{field} must be a list."
            )

    return report


def parse_report(text: str) -> Dict[str, Any]:
    """
    Safely parse and validate an LLM-generated report.
    """

    json_text = extract_json_object(text)

    try:
        report = json.loads(json_text)

    except json.JSONDecodeError as error:
        raise ValueError(
            f"Invalid JSON returned by model: {error}"
        ) from error

    if not isinstance(report, dict):
        raise ValueError(
            "Report JSON must be an object."
        )

    return validate_report(report)


if __name__ == "__main__":

    test_output = """
    ```json
    {
      "clarity_score": 8,
      "completeness_score": 6,
      "accuracy_score": 7,
      "depth_score": 5,
      "well_explained": [
        "Explained the basic concept clearly"
      ],
      "gaps_found": [
        "Skipped an important mechanism"
      ],
      "misconception_flags": [],
      "suggested_review": [
        "Review the underlying mechanism"
      ]
    }
    ```
    """

    try:

        result = parse_report(test_output)

        print("[OK] Parser test passed!")

        print(
            json.dumps(
                result,
                indent=2
            )
        )

    except ValueError as error:

        print("[FAIL] Parser test failed:")
        print(error)

    print("\nTesting bad output parsing...")
    bad_output = """
    Here is your report:

    ```json
    {
      "clarity_score": 8
    }
    ```
    """

    try:
        parse_report(bad_output)
        print("[FAIL] Bad output test failed (expected a ValueError but didn't raise one).")
    except ValueError as error:
        print("[OK] Bad output test passed (successfully caught invalid report):")
        print(f"   {error}")
