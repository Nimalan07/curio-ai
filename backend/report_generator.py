from typing import Dict, Any

from ollama_client import (
    generate_report,
    retry_report_as_json
)

from utils.json_parser import parse_report


class ReportGenerator:
    """
    Generates and validates an ExplainBack
    Understanding Report.
    """

    def generate(
        self,
        transcript: str
    ) -> Dict[str, Any]:

        if not transcript.strip():
            raise ValueError(
                "Transcript cannot be empty."
            )

        # First attempt
        raw_output = generate_report(
            transcript
        )

        try:
            return parse_report(
                raw_output
            )

        except ValueError:

            # Second attempt with stricter JSON instruction
            retry_output = retry_report_as_json(
                transcript=transcript,
                previous_output=raw_output
            )

            # If this fails, let the error propagate.
            return parse_report(
                retry_output
            )


report_generator = ReportGenerator()
