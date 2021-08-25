var express = require('express');
var router = express.Router();
const { auth } = require('../middleware/auth');
const allowedRoles = require('../middleware/roles');
var payments = require('../controllers/payments');

const userTypeAllowedParams = (req, res, next) => {
  if (
    ['teacher', 'student', 'admin', 'hr', 'hod', 'registrar'].includes(req.params.role)
  ) {
    return next()
  } else {
    return res.sendStatus(404)
  }
}

router.get('/', allowedRoles(['accountant', 'registrar', 'admin']), payments.getPayments);
router.post('/', allowedRoles(['accountant', 'registrar', 'admin']), payments.setPayments);
router.get('/:mode', (req, res, next) => {
  req.params.mode = 'online';
  next()
}, allowedRoles(['accountant', 'registrar', 'admin']), payments.getPayments);
router.get('/:mode', (req, res, next) => {
  req.params.mode = 'cash';
  next()
}, allowedRoles(['accountant', 'registrar', 'admin']), payments.getPayments);


module.exports = router;
