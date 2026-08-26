import ChatMessage from "./ChatMessage";
import ThinkingIndicator from "./ThinkingIndicator";

function ChatWindow({ messages, loading }) {
  return (
    <div className="chat-window">
      <div className="chat-intro">
        <div className="curio-large-icon">✦</div>
        <h1>Teach Curio</h1>
        <p>
          Explain the concept like you're teaching someone who knows nothing about it.
        </p>
      </div>

      <div className="messages">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}

        {loading && <ThinkingIndicator />}
      </div>
    </div>
  );
}

export default ChatWindow;
