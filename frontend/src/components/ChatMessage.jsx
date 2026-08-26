function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`chat-message ${
        isUser ? "user-message" : "curio-message"
      }`}
    >

      {!isUser && (
        <div className="curio-avatar">
          ✦
        </div>
      )}

      <div className="message-content">

        <span className="message-author">
          {isUser ? "You" : "Curio"}
        </span>

        <div className="message-bubble">
          {message.content}
        </div>

      </div>

    </div>
  );
}

export default ChatMessage;
