var express = require('express');
var router = express.Router();
const { auth } = require('../middleware/auth');
const allowedRoles = require('../middleware/roles');
var users = require('../controllers/user');
var address = require('../controllers/address');
var acadamics = require('../controllers/acadamics');
var enquiry = require('../controllers/enquiry');

const userTypeAllowedParams = (req, res, next) => {
  if (
    ['teacher', 'student', 'admin', 'hr', 'hod', 'registrar'].includes(req.params.role)
  ) {
    return next()
  } else {
    return res.sendStatus(404)
  }
}


router.get('/', users.getUsers);
router.post('/', allowedRoles(['admin', 'hr', 'registrar'], 'uid'), users.setUser);
router.get('/refresh', users.refreshUserData);
router.get('/address/:uid', address.getAddress);
router.post('/address/:uid', address.setAddress);
router.get('/academics/:uid', acadamics.getAcademic);
router.post('/academics/:uid', acadamics.setAcademic);
router.get('/enquiries', allowedRoles(['admin', 'hr', 'registrar']), enquiry.getUsers);
router.get('/enquiry/:uid', allowedRoles(['admin', 'hr', 'registrar']), enquiry.getUser);
router.post('/enquiry', enquiry.setUser);
router.get('/:role', userTypeAllowedParams, users.getUsers);

module.exports = router;
