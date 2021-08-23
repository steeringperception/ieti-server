var express = require('express');
var router = express.Router();
var user = require('./users')
var utility = require('../controllers/utility');
var authentication = require('../controllers/authentication');
var enquiry = require('../controllers/enquiry');
const { auth } = require('../middleware/auth');

router.get('/essential-list', utility.getGlobalList)
router.post('/enquiry', enquiry.setUser);
router.post('/login', authentication.login)
router.post('/update-security', authentication.changeSecurity)
router.use('/users', auth, user);

module.exports = router;
