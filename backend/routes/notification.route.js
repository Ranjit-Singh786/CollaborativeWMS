const express = require('express');
const { getNotifications } = require('../controllers/notification.controller.js');
const router = express.Router();
const auth = require('../middlewares/auth.middleware.js');
const allowRoles = require('../middlewares/role.middleware.js');
router.use(auth);
router.get('/',allowRoles("User","Admin"), getNotifications);     

module.exports = router;
