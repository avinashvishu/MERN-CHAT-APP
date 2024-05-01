const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const UserRoute = require("./Routes/userRoutes");
const ChatRoute = require("./Routes/chatRoutes");
const MessageRoute = require("./Routes/messageRoutes");
const connectDB = require("./config/mongoDb");
const color = require("colors");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const { notFound, errorHandler } = require("./Middleware/errorHandler");
const PORT = process.env.PORT;
app.use(cors());
connectDB();
app.use(express.json());

/* app.use(express.static(path.resolve(__dirname, "build")));
I have built the frontend code in build folder and imported in this folder,
you can use it as it is if you want, otherwise skip it*/

app.use("/api", UserRoute);
app.use("/api/chat", ChatRoute);
app.use("/api/message", MessageRoute);
app.use(notFound);
app.use(errorHandler);
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);

  socket.on("setup", (userData) => {
    socket.join(userData._id);

    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log(`User connecte room : ${room}`);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    let chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`.yellow.bold);
});
