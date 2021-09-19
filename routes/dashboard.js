var express = require('express');
var router = express.Router();
const { auth } = require('../middleware/auth');
const allowedRoles = require('../middleware/roles');
var dashboard = require('../controllers/dashboard');

router.get('/', dashboard.dashbord);


module.exports = router;
