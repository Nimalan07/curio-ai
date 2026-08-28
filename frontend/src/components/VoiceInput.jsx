import { useEffect, useRef, useState } from "react";

export default function VoiceInput({ onTranscript }) {

  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);

  const recognitionRef = useRef(null);

  useEffect(() => {

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onresult = (event) => {

      let transcript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        transcript +=
          event.results[i][0].transcript;
      }

      onTranscript(transcript);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };

  }, [onTranscript]);

  if (!supported) {
    return null;
  }

  function toggleVoice() {

    if (!recognitionRef.current) return;

    if (listening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }

  }

  return (
    <button
      type="button"
      className={
        listening
          ? "voice-button listening"
          : "voice-button"
      }
      onClick={toggleVoice}
      title="Explain using your voice"
      style={{ marginRight: "8px" }}
    >
      {listening ? "● Listening..." : "🎙 Explain aloud"}
    </button>
  );
}
