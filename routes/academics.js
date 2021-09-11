var express = require('express');
var router = express.Router();
const { auth } = require('../middleware/auth');
const allowedRoles = require('../middleware/roles');
var acadamics = require('../controllers/acadamics');

const userTypeAllowedParams = (req, res, next) => {
  if (
    ['teacher', 'student', 'admin', 'hr', 'hod', 'registrar', 'accountant'].includes(req.params.role)
  ) {
    return next()
  } else {
    return res.sendStatus(404)
  }
}



router.get('/structure', acadamics.academicStructure);
router.get('/structure/:type', acadamics.getStructure);
router.post('/structure/:type', acadamics.addStructure);
router.delete('/structure/:model/:uid', acadamics.deleteEntity);
router.get('/:uid', acadamics.getAcademic);
router.post('/:uid', acadamics.setAcademic);

module.exports = router;
