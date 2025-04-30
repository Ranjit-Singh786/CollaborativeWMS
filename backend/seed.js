import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Task from './models/task.model.js'; 
import User from './models/user.model.js';
import Project from './models/project.model.js';
import bcrypt from 'bcryptjs';
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected'))
  .catch((err) => console.error('Database connection error:', err));

// Dummy data
const users = [
  { name: 'John Doe', email: 'johnadmin@example.com', password: 'password123', role: 'Admin' },
  { name: 'Jane Smith', email: 'jane@example.com', password: 'password123', role: 'User' },
];

// Hash passwords
const hashPassword = async (users) => {
  for (let user of users) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  return users;
};


const hashedUsers = await hashPassword(users);

// Dummy tasks and projects


const tasks = [
  { title: 'Task 1', description: 'Description for Task 1', priority: 'high', status: 'to-do' },
  { title: 'Task 2', description: 'Description for Task 2', priority: 'medium', status: 'in-progress' },
];
const projects = [
  { name: 'Project 1', description: 'Description for Project 1', status: 'open', teamMembers: ["680f9154f06422d405b4c74e"] },
  { name: 'Project 2', description: 'Description for Project 2', status: 'in-progress', teamMembers: ["680fb30336bceef1b291c9d8"] },
];

// Seed function
const seedDatabase = async () => {
  try {
    await User.deleteMany();
    await Task.deleteMany();
    await Project.deleteMany();
    const createdUsers = await User.insertMany(hashedUsers);
    const userId = createdUsers[0]._id;
    const projecthandle = await Project.insertMany(projects); // In
    const projectid = projecthandle[0]._id;
    const tasksWithProject = tasks.map((task) => ({ ...task, project: projectid,assignedUser: userId }));
    await Task.insertMany(tasksWithProject);

    console.log('Database seeded successfully');
    process.exit();
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDatabase();