var express = require('express');
var router = express.Router();
var user = require('./users');
var utility = require('../controllers/utility');
var authentication = require('../controllers/authentication');
var enquiry = require('../controllers/enquiry');
var file = require('./file');
var payments = require('./payments');
var student = require('./student');
var academics = require('./academics');
var classRoom = require('./classRoom');
var test = require('./test');

const { auth } = require('../middleware/auth');

router.get('/essential-list', utility.getGlobalList)
router.post('/enquiry', enquiry.setUser);
router.post('/login', authentication.login)
router.post('/update-security', auth, authentication.changeSecurity)
router.use('/users', auth, user);
router.use('/payments', auth, payments);
router.use('/student', auth, student);
router.use('/academics', auth, academics);
router.use('/class-room', auth, classRoom);

router.use('/files', file)
router.use('/test', test)

module.exports = router;
