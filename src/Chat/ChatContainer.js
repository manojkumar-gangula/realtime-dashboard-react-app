import { useEffect, useRef, useState } from "react";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import RoomInput from "./RoomInput";
import "./ChatContainer.css";
import { socket, connectSocket } from "../socket";

function ChatContainer() {
  const newMessageRef = useRef(null);
  const scrollDiv = useRef();
  const [roomId, setRoomId] = useState(null);
  const [messages, setMessages] = useState([
    { text: "Hi Manoj!", source: "received" },
  ]);

  useEffect(() => {
    const handleReceiveMessage = (msg) => {
      console.log("Message received from Server: " + msg.text);
      displayOnScreen(msg.text);
    };
    socket.on("receive_msg", handleReceiveMessage);

    return () => {
      socket.off("receive_msg", handleReceiveMessage); // Cleanup
    };
  }, []);

  const newMessageChangeHandler = (message) => {
    const messageObject = { text: message, source: "sent" };
    if (message && message.trim() !== "") {
      setMessages((prevMessages) => [...prevMessages, messageObject]);
      socket.emit("send_msg", messageObject, roomId);
    }
    newMessageRef.current.value = "";
  };

  function displayOnScreen(message) {
    let message2 = { text: message, source: "received" };
    setMessages((prevMessages) => [...prevMessages, message2]);
  }

  function scrollToBottom() {
    if (scrollDiv.current) {
      scrollDiv.current.scrollTop = scrollDiv.current.scrollHeight;
    }
  }

  function handleRoomConnection(event) {
    event.preventDefault();
    const clickedButton = event.nativeEvent.submitter.value;
    let tempRoomId = event.target.elements[0].value;
    if (clickedButton === "Join") {
      if (tempRoomId && tempRoomId.trim() !== "") {
        connectSocket();
        console.log("Clicked Join");
        if (roomId == null) {
          socket.on("connect", () => {
            console.log("connected to server");
            socket.emit("join_room", tempRoomId);
            setRoomId(tempRoomId);
          });
        } else {
          if (roomId === tempRoomId) {
            alert("You are already in room: " + roomId + ".");
          } else {
            alert("Leave " + roomId + ", to join other.");
          }
        }
      } else {
        alert("Room ID cannot be empty!");
      }
    } else if (clickedButton === "Leave") {
      console.log("Clicked Leave");
      socket.emit("leave_room", roomId);
      setRoomId(null);
    }
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chatContainer">
      <RoomInput handleRoomConnection={handleRoomConnection} />
      <Messages messages={messages} scrollDiv={scrollDiv} />
      <MessageInput
        newMessageChangeHandler={newMessageChangeHandler}
        inputRef={newMessageRef}
      />
    </div>
  );
}

export default ChatContainer;
