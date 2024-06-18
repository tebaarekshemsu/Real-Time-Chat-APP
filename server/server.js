const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

const users = {};

io.on("connection", (socket) => {
  socket.on("new-user", (name) => {
    users[socket.id] = { name, isOnline: true };
    io.emit("user-connected", { name, id: socket.id });
  });

  socket.on("send-chat-message", (message) => {
    io.emit("chat-message", {
      message,
      name: users[socket.id].name,
      id: socket.id,
    });
  });

  socket.on("disconnect", () => {
    const name = users[socket.id].name;
    users[socket.id].isOnline = false;
    io.emit("user-disconnected", { name, id: socket.id });
    delete users[socket.id];
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});