const Task = require('../models/task.model.js');
const Notification = require('../models/notification.model.js');
exports.createTask = async (req, res) => {
  const { title, description, priority, status, project, assignedUser } = req.body;
const task =  await Task.create({
    title,
    description,
    priority,
    status,
    project,
    assignedUser
  });

 await Notification.create({
    user: assignedUser,
    message: `New task "${title}" has been assigned to you.`,
    projectid: project,
  });
   
  res.status(201).json(task);
};

exports.getTasksByProject = async (req, res) => {
    try {
      const { projectId } = req.params;
      const {status} = req.query;
      const { role, _id: userId } = req.user;
  
      let query = { project: projectId };

      if (status) {
        query.status = status; // Filter by status if provided
      }
  
      // If not admin (case-insensitive), limit to tasks assigned to the user
      if (role.toLowerCase() !== 'admin') {
        query.assignedUser = userId;
      }
  
      const tasks = await Task.find(query).populate('assignedUser');
      res.json(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  

exports.updateTask = async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(task);
};

exports.deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};
