var express = require('express');
var router = express.Router();
const { auth } = require('../middleware/auth');
const allowedRoles = require('../middleware/roles');
var teacher = require('../controllers/teacher');

const modeAllowed = (req, res, next) => {
  if (
    ['subject', 'course', 'semester', 'schedule'].includes(req.params.model)
  ) {
    return next()
  } else {
    return res.sendStatus(404)
  }
}



router.get('/subjects', teacher.subjects);


module.exports = router;
