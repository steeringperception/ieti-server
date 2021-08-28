const db = require('../models')
const { Op } = require('sequelize');
var base = require('base-converter');

module.exports = {
  getUsers: async (req, res, next) => {
    let where = {};
    let params = req.params || {};
    let query = req.query || {};
    if (!!params.role) {
      where.role = params.role;
    }
    if (!!query.approved) {
      if (!!eval(query.approved)) {
        where.approvalDate = { [Op.ne]: null };
      } else {
        where.approvalDate = { [Op.eq]: null };
      }
    }
    db.user.findAll({
      where, include: [{
        as: 'academicRecord',
        model: db.academicRecord,
        attributes: ['user', 'class', 'session', 'year']
      }]
    })
      .then(r => res.send(r))
      .catch(e => res.status(400).send({ error: `${e}` }))
  },
  setUser: async (req, res, next) => {
    let data = req.body || {};
    if (!!!data.uid) {
      // data.uid = base.decTo62(Date.now());
      return res.sendStatus(403)
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
    let include = [];
    if (!!req.query && !!req.query.include) {
      include = req.query.include.split(',');
    }
    console.log(include)
    return db.user.findOne({
      where: {
        uid: req.params.uid,
      },
      include
    })
      .then(r => res.send(r))
      .catch(e => res.status(400).send({ error: `${e}` }))
  },
  getUserByUidForPayment: (req, res, next) => {
    return db.user.findOne({
      where: { uid: req.params.uid, role: 'student', approvalDate: { [Op.ne]: null } },
      attributes: {
        include: [
          [db.sequelize.col('academicRecord.course'), 'course'],
          [db.sequelize.col('academicRecord.year'), 'academic_year']
        ]
      },
      include: [{
        model: db.academicRecord, as: 'academicRecord', attributes: []
      }]
    })
      .then(r => res.send(r))
      .catch(e => res.status(400).send({ error: `${e}` }))
  },
  getEnrolment: (req, res, next) => {
    db.user.findOne({
      where: { uid: req.params.uid },
      include: ['identity', 'education', 'academicRecord', 'emergency_contact', 'checklist']
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
      include: ['identity', 'education', 'academicRecord', 'emergency_contact', 'checklist']
    }).then(async (r) => {
      if (!!data.request && !!data.request.uid) {
        await db.enquiry.destroy({ where: { uid: data.request.uid } })
      }
      return res.send(r)
    })
      .catch(e => res.sendError(e))
  }

}