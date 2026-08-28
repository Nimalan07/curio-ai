from core.ollama_client import check_ollama
from core.student_agent import StudentAgent


def main():
    print("=" * 70)
    print("Curio - Student Agent Test")
    print("=" * 70)

    if not check_ollama():
        print("\n[ERROR] Ollama is not running.")
        print("Run: ollama serve")
        return

    print("\n[OK] Ollama is running.\n")

    agent = StudentAgent()
    conversation = []

    topic = input("Topic: ").strip()

    if not topic:
        print("[ERROR] Topic cannot be empty.")
        return

    print("\nTell the AI what you know.")
    print("Type 'exit' to stop.\n")

    while True:

        student_message = input("YOU: ").strip()

        if student_message.lower() == "exit":
            break

        if not student_message:
            print("Please explain something first.\n")
            continue

        conversation.append(
            {
                "role": "user",
                "content": student_message
            }
        )

        try:
            res = agent.generate_response(
                topic=topic,
                messages=conversation,
                difficulty_level=2
            )
            ai_reply = res["question"]

        except Exception as error:
            print(f"\n[ERROR] Error: {error}")
            break

        conversation.append(
            {
                "role": "assistant",
                "content": ai_reply
            }
        )

        print(f"\nAI LEARNER: {ai_reply}\n")

    print("\nSession ended.")


if __name__ == "__main__":
    main()
