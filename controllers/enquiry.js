const db = require('../models')
const { Op } = require('sequelize')
var base = require('base-converter');

module.exports = {
  getUsers: async (req, res, next) => {
    let where = {};
    let params = req.params || {};
    let query = req.qyery || {};
    if (!!query.status && query.status == 'closed') {
      where.status = 1
      console.log(1)
    } else {
      console.log(2)
      where = { [Op.or]: [{ status: 0 }, { status: null }] }
    }
    db.enquiry.findAll({
      where,
      attibutes: {
        exclude: ['datadump', 'updatedAt']
      }
    })
      .then(r => res.send(r))
      .catch(e => res.status(400).send({ error: `${e}` }))
  },
  getUser: async (req, res, next) => {
    // let where = {};
    let params = req.params || {};
    db.enquiry.findOne({ where: { uid: params.uid } })
      .then(r => res.send(r))
      .catch(e => res.status(400).send({ error: `${e}` }))
  },
  setUser: async (req, res, next) => {
    let data = req.body || {};
    if (!!!data.uid) {
      data.uid = base.decTo62(Date.now());
    }
    data.datadump = JSON.parse(JSON.stringify(data));
    db.enquiry.create(data).then(r => res.send(r))
      .catch(e => res.send(`${e}`))
  }
}