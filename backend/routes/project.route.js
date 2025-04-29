const express = require('express');
const { createProject, getProjects, updateProject, deleteProject,getDashboardSummary,getUsers} = require('../controllers/project.controller.js');
const auth = require('../middlewares/auth.middleware.js');
const allowRoles = require('../middlewares/role.middleware.js');
const router = express.Router();

router.use(auth);

router.get('/', getProjects);
router.post('/', allowRoles('Admin'), createProject);
router.put('/:id', allowRoles('Admin'), updateProject);
router.delete('/:id', allowRoles('Admin'), deleteProject);
router.get('/getDashboardSummary',  getDashboardSummary);
router.get('/getuser',  getUsers);

module.exports = router;
