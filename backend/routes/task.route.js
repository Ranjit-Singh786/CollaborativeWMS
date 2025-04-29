const express = require('express');
const { createTask, getTasksByProject, updateTask, deleteTask } = require('../controllers/task.controller.js');
const auth = require('../middlewares/auth.middleware.js');
const router = express.Router();

router.use(auth);

router.post('/', createTask);
router.get('/project/:projectId', getTasksByProject);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
