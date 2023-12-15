const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Kullanıcı listesini takip etmek için bir nesne
const users = {};

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", ({ username, room }) => {
    socket.join(room);
    console.log(`User with ID: ${socket.id} joined room: ${room}`);
    // Kullanıcı bilgilerini kullanıcı listesine ekle
    users[socket.id] = {
      id: socket.id,
      username,
      status: "Active",
      joinDate: new Date(),
    };

    // Odadaki kullanıcı listesini güncelle ve tüm istemcilere gönder
    io.to(room).emit("user_list", Object.values(users));
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    // Kullanıcıyı kullanıcı listesinden sil
    delete users[socket.id];

    // Odadaki kullanıcı listesini güncelle ve tüm istemcilere gönder
    io.emit("user_list", Object.values(users));
    console.log("User Disconnected", socket.id);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
