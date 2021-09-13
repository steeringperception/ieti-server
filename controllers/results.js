const db = require('../models')
var base = require('base-converter');



module.exports = {
  results: async (req, res, next) => {
    let student = req.user.uid;
    if (req.params && req.params.uid) {
      student = req.params.uid;
    }
    db.results.findAll({
      where: { student },
      order: [['createdAt', 'DESC']]
    }).then(r => res.send(r)).catch(e => res.sendError(e))
  }
}