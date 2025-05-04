import { useEffect, useRef, useState } from "react";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import "./ChatContainer.css";
import { io } from "socket.io-client";

function ChatContainer() {
  const newMessageRef = useRef(null);
  const scrollDiv = useRef();
  const [messages, setMessages] = useState([
    { text: "Hi Manoj!", source: "received" },
  ]);

  const socket = useRef("null");
  useEffect(() => {
    socket.current = io.connect("http://localhost:8000", {
      cors: {
        origin: "http://localhost:8000",
        methods: ["GET", "POST"],
      },
    });

    const handleReceiveMessage = (msg) => {
      console.log("Message received from Server: " + msg.text);
      displayOnScreen(msg.text);
    };
    socket.current.on("receive_msg", handleReceiveMessage);

    return () => {
      socket.current.off("receive_msg", handleReceiveMessage);
      socket.current.disconnect();
    };
  }, []);

  const newMessageChangeHandler = (message) => {
    const messageObject = { text: message, source: "sent" };
    console.log("From newMessageChangeHandler");
    setMessages((prevMessages) => [...prevMessages, messageObject]);
    console.log(messages);
    socket.current.emit("send_msg", messageObject);
    console.log("msg sent: " + messageObject.text);
    newMessageRef.current.value = "";
  };

  function displayOnScreen(message) {
    console.log("From displayOnScreen: ");
    let message2 = { text: message, source: "received" };
    setMessages((prevMessages) => [...prevMessages, message2]);
    console.log(messages);
  }

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
