var express = require('express');
var router = express.Router();
var user = require('./users')
var utility = require('../controllers/utility');
var authentication = require('../controllers/authentication');
var enquiry = require('../controllers/enquiry');
var payments = require('./payments');
const { auth } = require('../middleware/auth');

router.get('/essential-list', utility.getGlobalList)
router.post('/enquiry', enquiry.setUser);
router.post('/login', authentication.login)
router.post('/update-security', auth, authentication.changeSecurity)
router.use('/users', auth, user);
router.use('/payments', auth, payments);

module.exports = router;
