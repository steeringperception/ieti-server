var express = require('express');
var router = express.Router();
const { auth } = require('../middleware/auth');
const allowedRoles = require('../middleware/roles');
var student = require('../controllers/student');

const userTypeAllowedParams = (req, res, next) => {
  if (
    ['teacher', 'student', 'admin', 'hr', 'hod', 'registrar'].includes(req.params.role)
  ) {
    return next()
  } else {
    return res.sendStatus(404)
  }
}


router.post('/update-enrollment', allowedRoles(['admin', 'hr', 'registrar']), student.updateEnrollment);

module.exports = router;
