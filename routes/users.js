var express = require('express');
var router = express.Router();
const { auth } = require('../middleware/auth');
const allowedRoles = require('../middleware/roles');
var users = require('../controllers/user');
var userAction = require('../controllers/userAction');
var address = require('../controllers/address');
var acadamics = require('../controllers/acadamics');
var enquiry = require('../controllers/enquiry');
const authentication = require('../controllers/authentication');

const userTypeAllowedParams = (req, res, next) => {
  if (
    ['teacher', 'student', 'admin', 'hr', 'hod', 'registrar', 'accountant'].includes(req.params.role)
  ) {
    return next()
  } else {
    return res.sendStatus(404)
  }
}


router.get('/', users.getUsers);
router.post('/', allowedRoles(['admin', 'hr', 'registrar'], 'uid'), users.setUser);
router.get('/refresh', authentication.refreshUserData);
router.get('/by-uid/:uid', allowedRoles(['admin', 'accountant', 'registrar', 'hr'], 'uid'), users.getUserByUid);
router.get('/pay-for/:uid', allowedRoles(['admin', 'accountant', 'registrar'], 'uid'), users.getUserByUidForPayment);
router.get('/address/:uid', address.getAddress);
router.post('/address/:uid', address.setAddress);
router.get('/academics/:uid', acadamics.getAcademic);
router.post('/academics/:uid', acadamics.setAcademic);
router.get('/enquiries', allowedRoles(['admin', 'hr', 'registrar']), enquiry.getUsers);
router.get('/enquiry/:uid', allowedRoles(['admin', 'hr', 'registrar']), enquiry.getUser);
router.post('/enquiry', users.setUser);
router.get('/enrollment/:uid?', users.getEnrolment);
router.post('/enrollment', allowedRoles(['admin', 'hr', 'registrar']), users.setEnrolment);
router.get('/approve/:uid', allowedRoles(['registrar']), userAction.approveStudent);
router.post('/reject', allowedRoles(['registrar']), userAction.rejectStudent);
router.post('/toggle-access', allowedRoles(['hr']), userAction.toggleStatus);
router.get('/activate/:uid', allowedRoles(['registrar']), userAction.activateStudent);
router.get('/:role', userTypeAllowedParams, users.getUsers);

module.exports = router;
