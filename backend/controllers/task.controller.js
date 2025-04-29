const Task = require('../models/task.model.js');

exports.createTask = async (req, res) => {
  const task = await Task.create(req.body);
  res.status(201).json(task);
};

exports.getTasksByProject = async (req, res) => {
    try {
      const { projectId } = req.params;
      const { role, _id: userId } = req.user;
  
      let query = { project: projectId };
  
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
