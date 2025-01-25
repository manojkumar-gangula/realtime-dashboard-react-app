import { useEffect, useRef, useState } from "react";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import "./ChatContainer.css";

function ChatContainer() {
  const newMessageRef = useRef(null);
  const scrollDiv = useRef();
  const [messages, setMessages] = useState([]);
  const newMessageChangeHandler = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
    newMessageRef.current.value = "";
  };

  function scrollToBottom() {
    if (scrollDiv.current) {
      scrollDiv.current.scrollTop = scrollDiv.current.scrollHeight;
    }
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chatContainer">
      <Messages messages={messages} scrollDiv={scrollDiv} />
      <MessageInput
        newMessageChangeHandler={newMessageChangeHandler}
        inputRef={newMessageRef}
      />
    </div>
  );
}

export default ChatContainer;
