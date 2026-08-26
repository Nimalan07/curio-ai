export default function ChatMessage({ message }) {
  const isUser = message.role === "user";
  const reason = message.reason;

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

        {!isUser && reason && (
          <details className="why-question">
            <summary>Why I asked this</summary>
            <p>{reason}</p>
          </details>
        )}
      </div>
    </div>
  );
}
