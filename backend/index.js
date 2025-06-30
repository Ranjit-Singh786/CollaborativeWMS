require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.route.js');
const projectRoutes = require('./routes/project.route.js');
const taskRoutes = require('./routes/task.route.js');
const notificationRoutes = require('./routes/notification.route.js');
const connectDB = require('./config/db.js');
const { initSocket } = require('./socket');
const app = express();
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);

initSocket(server);

app.use(express.json());
app.use(cors());
connectDB();
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notifications', notificationRoutes);

app.get("/",(req,res)=>{
       res.send({server:true})
})


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
