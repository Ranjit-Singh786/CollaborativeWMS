const { Server } = require("socket.io");
const User = require("./models/user.model.js");
const mongoose = require("mongoose");

let io;
const userSocketMap ={}; // userId => socketId

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*", // Use your frontend origin in production
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    // Register user
    socket.on('register_user', (userId) => {
        userSocketMap[userId] = socket.id;
        console.log(`User ${userId} registered with socket ${socket.id}`);
      });

      socket.on('assign_task', ({ assignedUser, message, projectid }) => {
        console.log(assignedUser, message, projectid, 'assignedUser, message, projectid');
        const targetSocketId = userSocketMap[assignedUser];
        console.log(userSocketMap, 'targetSocketId');
        if (targetSocketId) {
          io.to(targetSocketId).emit('task_assigned', {message, projectid, assignedUser});
        } else {
          console.log(`User ${assignedUser} is not online`);
        }
      });

    // Cleanup on disconnect
    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
     
    });
  });
}

module.exports = {
  initSocket,
  io
};
