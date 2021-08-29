var express = require('express');
var router = express.Router();
const db = require('../models')
const { multiPart2Json } = require('../lib/awsServices')

router.post('/', multiPart2Json('avatar', 'picture'), (req, res, next) => {
  try {
    return db.user.update(req.body, { where: { id: 1 } })
      .then(async (u) => {
        return res.send({ d: req.body })
      }).catch(e => console.log(e))
  } catch (error) {
    console.log(error)
  }
})

module.exports = router;
