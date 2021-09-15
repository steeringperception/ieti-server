var express = require('express');
var router = express.Router();
const { auth } = require('../middleware/auth');
const allowedRoles = require('../middleware/roles');
var acadamics = require('../controllers/acadamics');

const modeAllowed = (req, res, next) => {
  if (
    ['subject', 'course', 'semester', 'schedule'].includes(req.params.model)
  ) {
    return next()
  } else {
    return res.sendStatus(404)
  }
}



router.get('/structure', acadamics.academicStructure);
router.get('/entity/:type', acadamics.getStructure);
router.get('/entity/:model/:id', modeAllowed, acadamics.getentityByid);
router.post('/entity/:type', modeAllowed, allowedRoles(['hr', 'admin']), acadamics.addStructure);
router.delete('/entity/:model/:uid', modeAllowed, acadamics.deleteEntity);
router.post('/schedule', acadamics.addSchedules);
router.get('/schedules', acadamics.getSchedules);
router.get('/:uid', acadamics.getAcademic);
router.post('/:uid', allowedRoles(['hr', 'admin']), acadamics.setAcademic);

module.exports = router;
