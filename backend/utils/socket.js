const socketio = require("socket.io");

let io; // Store io instance globally

module.exports = {
  init: (server) => {
    io = socketio(server, {
      cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log("New WebSocket connection");

      socket.on("disconnect", () => {
        console.log("User disconnected");
      });
    });

    return io;
  },

  getIO: () => {
    if (!io) {
      throw new Error("Socket.io is not initialized!");
    }
    return io;
  },
};
