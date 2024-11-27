// frontend/src/server.js

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

// WebSocket connection handling
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("message", (data) => {
    // Broadcast the message to all other clients
    socket.broadcast.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Set the port explicitly to 1717
const PORT = 1717;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
