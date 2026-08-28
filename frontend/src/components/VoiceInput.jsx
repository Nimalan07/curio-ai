import { useEffect, useRef, useState } from "react";

export default function VoiceInput({ onTranscript }) {

  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);

  const recognitionRef = useRef(null);
  const lastIndexRef = useRef(0);
  const onTranscriptRef = useRef(onTranscript);

  // Keep the latest callback ref without restarting the recognition engine
  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  useEffect(() => {

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setListening(true);
      lastIndexRef.current = 0;
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
    };

    recognition.onresult = (event) => {
      let newText = "";
      for (let i = lastIndexRef.current; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          newText += event.results[i][0].transcript + " ";
          lastIndexRef.current = i + 1;
        }
      }
      if (newText) {
        onTranscriptRef.current(newText.trim());
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };

  }, []);

  if (!supported) {
    return null;
  }

  function toggleVoice() {

    if (!recognitionRef.current) return;

    if (listening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
      }
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
