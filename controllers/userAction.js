const db = require('../models')
const { Op } = require('sequelize');
var base = require('base-converter');

module.exports = {

  approveStudent: async (req, res, next) => {
    db.user.update({ approvalDate: new Date() }, { where: { uid: req.params.uid } }).then(async (r) => {
      res.send({ status: true })
    })
      .catch(e => res.sendError(e))
  },

}