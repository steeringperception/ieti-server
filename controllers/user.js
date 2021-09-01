const db = require('../models')
const { Op } = require('sequelize');
var base = require('base-converter');

async function getAdmissionNo(name, year, course) {
  let ls = await db.admission_no_index.findOne({ where: { year, course } });
  let index = 001
  if (!!ls && !!ls.last_index) {
    index = parseInt(ls.last_index) + 1;
  }
  index = ('000' + index).substr(-3);
  let no = `${name.substr(0, 1)}${year.toString().substr(-2)}${course}${index}`
  return { uid: no, index }
}

async function destroyUserData(uid) {
  return Promise.all([
    db.user.destroy({ where: { uid: uid }, force: true }),
    db.identity.destroy({ where: { user_uid: uid }, force: true }),
    db.education.destroy({ where: { user_uid: uid }, force: true }),
    db.academicRecord.destroy({ where: { user: uid }, force: true }),
    db.emergency_contacts.destroy({ where: { user_uid: uid }, force: true }),
    db.checklist.destroy({ where: { user_uid: uid }, force: true }),
    db.experience.destroy({ where: { user_uid: uid }, force: true }),
    db.user_meta.destroy({ where: { user_uid: uid, keyword: 'enrolled_by' }, force: true })
  ])
}

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
        attributes: ['user', 'course', 'session', 'year']
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
      include: ['identity', 'education', 'academicRecord', 'emergency_contact', 'checklist', 'experience',
        {
          model: db.user_meta, as: 'user_meta', required: false,
          where: {
            keyword: { [Op.in]: ['approved_by', 'enrolled_by'] }
          }
        }
      ]
    }).then(r => res.send(r))
      .catch(e => res.status(400).send({ error: `${e}` }))
  },
  setEnrolment: async (req, res, next) => {
    let data = req.body || {};
    let index = null;
    if (!!!data.uid) {
      // data.uid = base.decTo62(Date.now());
      let d = await getAdmissionNo(data.firstName, data.academicRecord.year, data.academicRecord.course);
      data.uid = d.uid;
      index = d.index;
    }
    if (!!!data.gender) {
      data.gender = "";
    }
    if (!!!data.role) {
      data.role = "student";
    }
    data.user_meta = [{
      keyword: 'enrolled_by', content: req.user.uid
    }]
    await destroyUserData(data.uid)
    db.user.create(data, {
      include: ['identity', 'education', 'academicRecord', 'emergency_contact', 'checklist', 'experience', 'user_meta']
    }).then(async (r) => {
      if (!!index) {
        await db.admission_no_index.findOrCreate({
          where: {
            year: data.academicRecord.year,
            course: data.academicRecord.course
          }
        }).then(r => r[0].update({ last_index: index }));
      }
      if (!!data.request && !!data.request.uid) {
        await db.enquiry.destroy({ where: { uid: data.request.uid } })
      }
      return res.send(r)
    })
      .catch(e => res.sendError(e))
  }

}