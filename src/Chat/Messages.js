import "./Messages.css";

function Messages({ messages, scrollDiv }) {
  return (
    <div className="messageContainer" ref={scrollDiv}>
      {messages.map((msg, index) => (
        <div key={index} className={`messageDiv ${msg.source}`}>
          <div className="message">{msg.text}</div>
        </div>
      ))}
    </div>
  );
}

export default Messages;
