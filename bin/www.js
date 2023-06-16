import dotenv from "dotenv/config";
import app from "../app.js";
import http from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";
// import config from "../Utils/config.js";

mongoose.set("strictQuery", false);
import { addUser, saveMessage } from "../Utils/chatUsers.js";

var port = normalizePort(process.env.PORT || "5000");
app.set("port", port);

var server = http.createServer(app);

const io = new Server(server);

io.on("connection", (socket) => {
  socket.on("join", (chatData, callback) => {
    const { error, user } = addUser({ id: socket.id, chatData });
    if (error) return callback(error);
    let { user1ID, user2ID } = chatData;
    const roomId = `${user1ID}_${user2ID}`;
    socket.join(roomId);
    console.log(`User1 ${user1ID} and User2 ${user2ID} joined room ${roomId}`);
    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const { user, error } = saveMessage(message);
    if (error) {
      return callback(error);
    }

    io.to(`${message.sender}_${message.receiver}`).emit("message", {
      user: message.name,
      text: message.message,
    });
  });

  socket.on("disconnect", () => {
    console.log("user gone");
  });
});

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  console.log("Listening on " + bind);
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("Database connection established");
    })
    .catch((err) => console.log(err));
}
