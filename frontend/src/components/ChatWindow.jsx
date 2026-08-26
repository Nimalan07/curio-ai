import ChatMessage from "./ChatMessage";

function ChatWindow({
  messages,
  loading,
}) {
  return (
    <div className="chat-window">

      <div className="chat-intro">

        <div className="curio-large-icon">
          ✦
        </div>

        <h1>Teach Curio</h1>

        <p>
          Explain the concept like you're teaching
          someone who knows nothing about it.
        </p>

      </div>


      <div className="messages">

        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message}
          />
        ))}


        {loading && (
          <div className="typing-indicator">

            <div className="curio-avatar">
              ✦
            </div>

            <div className="typing-bubble">
              <span />
              <span />
              <span />
            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default ChatWindow;
