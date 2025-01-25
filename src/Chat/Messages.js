import "./Messages.css";

function Messages({ messages, scrollDiv }) {
  return (
    <div className="messageContainer" ref={scrollDiv}>
      {messages.map((message, index) => (
        <div key={index} className="message">
          {message}
        </div>
      ))}
    </div>
  );
}

export default Messages;
