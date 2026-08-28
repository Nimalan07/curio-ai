import { useState } from "react";
import VoiceInput from "./VoiceInput";

function ChatInput({
  onSend,
  disabled,
}) {
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!message.trim() || disabled) {
      return;
    }

    onSend(message);

    setMessage("");
  }

  function handleKeyDown(event) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      handleSubmit(event);
    }
  }

  return (
    <form
      className="chat-input-form"
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", alignItems: "stretch", width: "100%" }}
    >
      <textarea
        value={message}
        onChange={(event) =>
          setMessage(event.target.value)
        }
        onKeyDown={handleKeyDown}
        placeholder="Explain it in your own words..."
        disabled={disabled}
        rows={3}
      />

      <div className="chat-input-actions" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", marginTop: "8px" }}>
        <VoiceInput onTranscript={(text) => setMessage((prev) => prev ? prev + " " + text : text)} />
        <button
          type="submit"
          disabled={
            disabled || !message.trim()
          }
          className="send-button"
        >
          →
        </button>
      </div>
    </form>
  );
}

export default ChatInput;
