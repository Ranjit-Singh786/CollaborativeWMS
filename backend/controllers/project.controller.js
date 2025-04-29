const Project = require('../models/project.model');
const Task = require('../models/task.model');
const User = require('../models/user.model');
const mongoose = require('mongoose');
const moment = require('moment');

exports.createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getProjects = async (req, res) => {
  const { status, member } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (member) filter.teamMembers = member;

  const projects = await Project.find(filter).populate('teamMembers');
  res.json(projects);
};

exports.updateProject = async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(project);
};

exports.deleteProject = async (req, res) => {
  await Project.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};

exports.getDashboardSummary = async (req, res) => {
    try {
      // 1. Project Summary (by Status)
      const projectSummary = await Project.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);
  
      const projectStatusSummary = projectSummary.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {});
  
      const projectStatusList = ['open', 'in-progress', 'completed'];
      projectStatusList.forEach(status => {
        if (!projectStatusSummary[status]) projectStatusSummary[status] = 0;
      });
  
      // 2. Task Summary (by Status)
      const taskSummary = await Task.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);
  
      const taskStatusSummary = taskSummary.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {});
  
      const taskStatusList = ['to-do', 'in-progress', 'done'];
      taskStatusList.forEach(status => {
        if (!taskStatusSummary[status]) taskStatusSummary[status] = 0;
      });
  
      // 3. Upcoming Deadlines (Next 7 Days)
      const today = moment();
      const nextWeek = moment().add(7, 'days');
  
      const upcomingTasks = await Task.find({
        dueDate: { $gte: today.toDate(), $lte: nextWeek.toDate() }
      });
  
      // Combine all data and return the response
      const dashboardSummary = {
        projectSummary: projectStatusSummary,
        taskSummary: taskStatusSummary,
        upcomingDeadlines: upcomingTasks,
      };
  
      res.json(dashboardSummary);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch dashboard summary' });
    }
  };

exports.getUsers = async (req, res) => {
    try {
      const users = await User.find({ role: { $ne: 'Admin' } }); // toJSON method is applied automatically
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
