var express = require('express');
var router = express.Router();
const { auth } = require('../middleware/auth');
const allowedRoles = require('../middleware/roles');
var files = require('../controllers/file');

router.post('/upload', files.upload);


module.exports = router;
