import json

from ollama_client import (
    check_ollama,
    generate_report
)
from utils.json_parser import parse_report


TRANSCRIPT = """
TOPIC: Photosynthesis

STUDENT:
Photosynthesis is how plants use sunlight to make food.

AI LEARNER:
What exactly happens to the sunlight after the plant captures it?

STUDENT:
The sunlight gives the plant energy to make glucose.

AI LEARNER:
How does the plant convert that light energy into something
that can be used to make glucose?

STUDENT:
I think chlorophyll absorbs the sunlight and then the plant
uses that energy to make food.

AI LEARNER:
What role does chlorophyll play in capturing the energy?

STUDENT:
I'm not exactly sure about that part.

AI LEARNER:
What happens to the energy after chlorophyll absorbs it?

STUDENT:
I don't know the exact process.
"""


def main():

    print("=" * 70)
    print("ExplainBack - Report Agent Test")
    print("=" * 70)

    if not check_ollama():
        print("\n[ERROR] Ollama is not running.")
        print("Run: ollama serve")
        return

    print("\n[OK] Ollama is running.")
    print("\nGenerating report...\n")

    try:
        raw_report = generate_report(
            transcript=TRANSCRIPT
        )

    except RuntimeError as error:
        print(f"\n[ERROR] Error: {error}")
        return

    print("=" * 70)
    print("RAW MODEL OUTPUT")
    print("=" * 70)

    print(raw_report)

    print("\n" + "=" * 70)
    print("JSON VALIDATION")
    print("=" * 70)

    try:
        report = parse_report(raw_report)

        print("\n[OK] Valid ExplainBack report!")

        print("\nParsed report:")

        print(
            json.dumps(
                report,
                indent=2,
                ensure_ascii=False
            )
        )

    except ValueError as error:

        print("\n[ERROR] Report validation failed!")

        print(error)


if __name__ == "__main__":
    main()
