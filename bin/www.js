import dotenv from "dotenv/config";
import app from "../app.js";
import http from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";
// import config from "../Utils/config.js";

mongoose.set("strictQuery", false);
import { addUser, findUser, saveMessage } from "../Utils/chatUsers.js";

var port = normalizePort(process.env.PORT || "5000");
app.set("port", port);

var server = http.createServer(app);

const io = new Server(server);

io.on("connection", (socket) => {
  console.log("connection Established");
  socket.on("join", async (chatData, callback) => {
    console.log(chatData);
    let { user1, user2 } = chatData;
    const { user, error } = await findUser({ id: socket.id, chatData });
    if (error) return callback(error);

    if (Object.keys(user).length === 0) {
      const { success, error } = await addUser({ id: socket.id, chatData });
      if (success) {
        const roomId = `${user1.id}_${user2.id}`;
        socket.join(roomId);
        console.log(
          `User1 ${user1.id} and User2 ${user2.id} joined room ${roomId}`
        );
        return callback && callback(user);
      } else {
        return callback && callback(error);
      }
    } else {
      socket.join(user.roomID);
      console.log(
        `User1 ${user1.id} and User2 ${user2.id} joined room ${user.roomID}`
      );
      return callback && callback(user);
    }
  });

  socket.on("sendMessage", async (message, callback) => {
    const { error, user } = await findUser({
      id: socket.id,
      chatData: message,
    });
    let { name, text } = message;
    if (error) {
      return callback && callback(error);
    }
    if (user?.lockedBy) {
      return callback && callback("Sorry! Chat Locked");
    } else {
      const { user0, error0 } = saveMessage(message, user);
      if (error0) {
        return callback && callback(error0);
      }

      io.to(user.roomID).emit("message", {
        user: name,
        text: text,
      });
    }
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
