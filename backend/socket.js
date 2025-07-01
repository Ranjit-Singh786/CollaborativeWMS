const { Server } = require("socket.io");
const User = require("./models/user.model.js");
const mongoose = require("mongoose");
const Notification = require("./models/notification.model.js");
let io;
const userSocketMap ={}; // userId => socketId

function initSocket(server,corsOptions) {
  io = new Server(server, {
    cors: {
      origin: "https://collaborative-wms-8q6y.vercel.app/", // Use your frontend origin in production
      methods: ["GET", "POST"],
      credentials: true,

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
          io.to(targetSocketId).emit('task_assigned', {message, projectid, assignedUser,read:false});
        } else {
          console.log(`User ${assignedUser} is not online`);
        }
      });

      socket.on('read_task',(task) => {
        console.log('Task read:', task._id);
       const update = task.map(async(task) => {
        console.log(task._id, 'task._id test over here');
       return await Notification.findByIdAndUpdate(task._id, { read: true }, { new: true });
        });
 
        if (!update) {
          console.log('Notification not found');
          return;
        }
        console.log('Notification updated:', update);
      })

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
