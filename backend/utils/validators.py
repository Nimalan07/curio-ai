from config import (
    MAX_CONVERSATION_TURNS,
    MIN_CONVERSATION_TURNS_FOR_REPORT
)


def validate_topic(topic: str) -> str:
    """
    Validate and clean a topic.
    """

    if not isinstance(topic, str):
        raise ValueError(
            "Topic must be a string."
        )

    topic = topic.strip()

    if not topic:
        raise ValueError(
            "Topic cannot be empty."
        )

    if len(topic) > 200:
        raise ValueError(
            "Topic is too long. "
            "Please keep it under 200 characters."
        )

    return topic


def validate_message(message: str) -> str:
    """
    Validate and clean a student message.
    """

    if not isinstance(message, str):
        raise ValueError(
            "Message must be a string."
        )

    message = message.strip()

    if not message:
        raise ValueError(
            "Message cannot be empty."
        )

    if len(message) > 5000:
        raise ValueError(
            "Message is too long."
        )

    return message


def validate_session_exists(
    session: dict | None
) -> None:

    if session is None:
        raise ValueError(
            "Session not found."
        )


def can_continue_conversation(
    turn_count: int
) -> bool:

    return turn_count < MAX_CONVERSATION_TURNS


def can_generate_report(
    turn_count: int
) -> bool:

    return (
        turn_count >= MIN_CONVERSATION_TURNS_FOR_REPORT
    )
