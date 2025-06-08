import { io } from "socket.io-client";

const socket = io("http://localhost:8000", {
  autoConnect: false,
  cors: {
    origin: "http://localhost:8000",
    methods: ["GET", "POST"],
  },
});

const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export { socket, connectSocket };
