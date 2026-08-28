import json

from core.ollama_client import check_ollama
from core.report_generator import ReportGenerator

TRANSCRIPT_MESSAGES = [
    {"role": "user", "content": "Photosynthesis is how plants use sunlight to make food."},
    {"role": "assistant", "content": "What exactly happens to the sunlight after the plant captures it?"},
    {"role": "user", "content": "The sunlight gives the plant energy to make glucose."},
    {"role": "assistant", "content": "How does the plant convert that light energy into something that can be used to make glucose?"},
    {"role": "user", "content": "I think chlorophyll absorbs the sunlight and then the plant uses that energy to make food."},
    {"role": "assistant", "content": "What role does chlorophyll play in capturing the energy?"},
    {"role": "user", "content": "I'm not exactly sure about that part."},
    {"role": "assistant", "content": "What happens to the energy after chlorophyll absorbs it?"},
    {"role": "user", "content": "I don't know the exact process."}
]

def main():
    print("=" * 70)
    print("Curio - Report Agent Test")
    print("=" * 70)

    if not check_ollama():
        print("\n[ERROR] Ollama is not running.")
        print("Run: ollama serve")
        return

    print("\n[OK] Ollama is running.")
    print("\nGenerating report...\n")

    try:
        generator = ReportGenerator()
        report = generator.generate(
            topic="Photosynthesis",
            messages=TRANSCRIPT_MESSAGES,
            confidence=6
        )

    except Exception as error:
        print(f"\n[ERROR] Error: {error}")
        return

    print("=" * 70)
    print("MODEL ANALYSIS REPORT")
    print("=" * 70)

    print(
        json.dumps(
            report,
            indent=2,
            ensure_ascii=False
        )
    )

if __name__ == "__main__":
    main()
