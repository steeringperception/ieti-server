const db = require('../models')
var base = require('base-converter');

module.exports = {
  getAddress: async (req, res, next) => {
    db.address.findOne({ where: { user_uid: req.params.uid } })
      .then(r => res.send(r))
      .catch(e => res.sendError(e))
  },
  setAddress: async (req, res, next) => {
    let data = req.body || {};
    db.address.findOrCreate({ where: { user_uid: req.params.uid }, defaults: data })
      .then(async (r) => {
        r[0].update(data)
        res.send(r[0])
      })
      .catch(e => res.sendError(e))
  }
}