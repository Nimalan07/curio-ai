import { useState } from "react";

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

      <button
        type="submit"
        disabled={
          disabled || !message.trim()
        }
        className="send-button"
      >
        →
      </button>

    </form>
  );
}

export default ChatInput;
