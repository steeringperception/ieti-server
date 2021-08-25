const db = require('../models')
var base = require('base-converter');

module.exports = {
  getUsers: async (req, res, next) => {
    let where = {};
    let params = req.params || {};
    if (!!params.role) {
      where.role = params.role;
    }
    db.user.findAll({ where })
      .then(r => res.send(r))
      .catch(e => res.status(400).send({ error: `${e}` }))
  },
  setUser: async (req, res, next) => {
    let data = req.body || {};
    if (!!!data.uid) {
      data.uid = base.decTo62(Date.now());
    }
    db.user.scope('').findOrCreate({
      where: {
        uid: data.uid
      },
      defaults: data
    }).then(async (r) => {
      await r[0].update(data)
      res.send(r[0])
    })
      .catch(e => res.sendError(e))
  },

  refreshUserData: (req, res, next) => {
    return db.user.findOne({ where: { uid: req.user.uid } })
      .then(r => res.send(r))
      .catch(e => res.status(400).send({ error: `${e}` }))
  },
  getUserByUid: (req, res, next) => {
    return db.user.findOne({ where: { uid: req.params.uid, role: 'student' } })
      .then(r => res.send(r))
      .catch(e => res.status(400).send({ error: `${e}` }))
  },
  getEnrolment: (req, res, next) => {
    db.user.findOne({
      where: { uid: req.params.uid },
      include: ['identity', 'education', 'academicRecord', 'emergency_contact']
    }).then(r => res.send(r))
      .catch(e => res.status(400).send({ error: `${e}` }))
  },
  setEnrolment: (req, res, next) => {
    let data = req.body || {};
    if (!!!data.uid) {
      data.uid = base.decTo62(Date.now());
    }
    if (!!!data.gender) {
      data.gender = "";
    }
    if (!!!data.role) {
      data.role = "student";
    }
    db.user.create(data, {
      include: ['identity', 'education', 'academicRecord', 'emergency_contact']
    }).then(r => res.send(r))
      .catch(e => res.sendError(e))
  }

}