import requests
from pathlib import Path
from typing import List, Dict, Optional

from config import OLLAMA_CHAT_URL, OLLAMA_MODEL, OLLAMA_TIMEOUT


BASE_DIR = Path(__file__).resolve().parent
PROMPTS_DIR = BASE_DIR / "prompts"


def load_prompt(filename: str) -> str:
    """
    Load a prompt from the prompts directory.
    """

    prompt_path = PROMPTS_DIR / filename

    if not prompt_path.exists():
        raise FileNotFoundError(
            f"Prompt file not found: {prompt_path}"
        )

    return prompt_path.read_text(encoding="utf-8").strip()


def check_ollama() -> bool:
    """
    Check whether Ollama is running.
    """

    try:
        response = requests.get(
            OLLAMA_CHAT_URL.replace("/api/chat", "/api/tags"),
            timeout=5
        )

        return response.status_code == 200

    except requests.RequestException:
        return False


def chat_with_ollama(
    messages: List[Dict[str, str]],
    temperature: float = 0.4,
    timeout: Optional[int] = None,
    json_format: bool = False
) -> str:
    """
    Send a conversation to Ollama and return the generated response.

    messages format:

    [
        {
            "role": "system",
            "content": "..."
        },
        {
            "role": "user",
            "content": "..."
        }
    ]
    """

    if timeout is None:
        timeout = OLLAMA_TIMEOUT

    payload = {
        "model": OLLAMA_MODEL,
        "messages": messages,
        "stream": False,
        "options": {
            "temperature": temperature
        }
    }

    if json_format:
        payload["format"] = "json"

    try:
        response = requests.post(
            OLLAMA_CHAT_URL,
            json=payload,
            timeout=timeout
        )

        response.raise_for_status()

    except requests.exceptions.ConnectionError as exc:
        raise RuntimeError(
            "Could not connect to Ollama. "
            "Make sure Ollama is running with 'ollama serve'."
        ) from exc

    except requests.exceptions.Timeout as exc:
        raise RuntimeError(
            "Ollama took too long to respond."
        ) from exc

    except requests.exceptions.HTTPError as exc:
        raise RuntimeError(
            f"Ollama returned an HTTP error: {response.status_code} "
            f"- {response.text}"
        ) from exc

    except requests.RequestException as exc:
        raise RuntimeError(
            f"Error communicating with Ollama: {exc}"
        ) from exc

    try:
        data = response.json()

    except ValueError as exc:
        raise RuntimeError(
            "Ollama returned an invalid JSON response."
        ) from exc

    message = data.get("message")

    if not message:
        raise RuntimeError(
            f"Ollama response did not contain a message: {data}"
        )

    content = message.get("content")

    if not content:
        raise RuntimeError(
            f"Ollama response contained an empty message: {data}"
        )

    return content.strip()


def generate_student_response(
    conversation: List[Dict[str, str]]
) -> str:
    """
    Generate a response from the Curio AI learner.

    conversation should contain the user/assistant history,
    excluding the system prompt.
    """

    system_prompt = load_prompt("student_persona.txt")

    messages = [
        {
            "role": "system",
            "content": system_prompt
        }
    ]

    messages.extend(conversation)

    return chat_with_ollama(
        messages=messages,
        temperature=0.5
    )


def generate_report(
    transcript: str
) -> str:
    """
    Send the complete transcript to the report-analysis AI.
    """

    system_prompt = load_prompt("report_analysis.txt")

    messages = [
        {
            "role": "system",
            "content": system_prompt
        },
        {
            "role": "user",
            "content": (
                "Analyze the following Curio session.\n\n"
                "SESSION TRANSCRIPT:\n"
                "-------------------\n"
                f"{transcript}\n"
                "-------------------\n\n"
                "Return ONLY the required JSON."
            )
        }
    ]

    return chat_with_ollama(
        messages=messages,
        temperature=0.1,
        json_format=True
    )


def retry_report_as_json(
    transcript: str,
    previous_output: str
) -> str:
    """
    Ask Ollama again for strict JSON if the first
    report output could not be parsed.
    """

    system_prompt = load_prompt("report_analysis.txt")

    retry_prompt = f"""
The previous report generation did not produce valid
JSON in the required format.

Generate the report again.

IMPORTANT:
Return ONLY valid JSON.
No Markdown.
No ```json fences.
No explanation.
No text before or after the JSON.

Required fields:

clarity_score
completeness_score
accuracy_score
depth_score
well_explained
gaps_found
misconception_flags
suggested_review

Previous output:

{previous_output}

Transcript:

{transcript}
"""

    messages = [
        {
            "role": "system",
            "content": system_prompt
        },
        {
            "role": "user",
            "content": retry_prompt
        }
    ]

    return chat_with_ollama(
        messages=messages,
        temperature=0.0,
        json_format=True
    )


if __name__ == "__main__":
    print("=" * 60)
    print("Curio - Ollama Client Test")
    print("=" * 60)

    print("\nChecking Ollama...")

    if not check_ollama():
        print("\n[ERROR] Ollama is not running.")
        print("Start it with:")
        print("    ollama serve")
        raise SystemExit(1)

    print("[OK] Ollama is running.")

    print(f"\nModel: {OLLAMA_MODEL}")

    print("\nTesting AI learner...\n")

    conversation = [
        {
            "role": "user",
            "content": (
                "Photosynthesis is the process where plants "
                "use sunlight to make food."
            )
        }
    ]

    try:
        reply = generate_student_response(conversation)

        print("AI LEARNER:")
        print(reply)

    except RuntimeError as error:
        print("\n[ERROR] Error:")
        print(error)
