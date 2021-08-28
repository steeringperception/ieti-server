const db = require('../models')
var base = require('base-converter');

module.exports = {
  getAcademic: async (req, res, next) => {
    db.academicRecord.findOne({ where: { user: req.params.uid } })
      .then(r => res.send(r))
      .catch(e => res.sendError(e))
  },
  setAcademic: async (req, res, next) => {
    let data = req.body || {};
    db.academicRecord.findOrCreate({ where: { user: req.params.uid }, defaults: data })
      .then(async (r) => {
        await r[0].update(data)
        return res.send(r[0])
      })
      .catch(e => res.sendError(e))
  }
}