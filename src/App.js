import logo from "./logo.svg";
import "./App.css";
import MessageInput from "./Chat/MessageInput";
import Messages from "./Chat/Messages";
import ChatContainer from "./Chat/ChatContainer";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div className="App">
      <ChatContainer />
    </div>
  );
}

export default App;
