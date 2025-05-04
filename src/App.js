import "./App.css";
import MessageInput from "./Chat/MessageInput";
import Messages from "./Chat/Messages";
import ChatContainer from "./Chat/ChatContainer";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

function App() {
  return (
    <div className="App">
      <ChatContainer />
    </div>
  );
}

export default App;
