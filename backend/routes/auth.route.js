const express = require('express');
const { register, login,editUser,deleteUser,getUser, logout } = require('../controllers/auth.controller.js');
const router = express.Router();
const auth = require('../middlewares/auth.middleware.js');
const allowRoles = require('../middlewares/role.middleware.js');
router.post('/register', register);
router.post('/login', login);
router.get('/', getUser);
router.use(auth);
router.put('/:userId',allowRoles("Admin"), editUser);
router.delete('/:userId',allowRoles("Admin"), deleteUser);
router.get('/logout',allowRoles("User","Admin"), logout);     

module.exports = router;
