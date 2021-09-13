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
  let no = `${name.substr(0, 1)}${year.toString().substr(-2)}${course}${index}`;
  console.log(name, year, course)
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
    db.document.destroy({ where: { user_uid: uid }, force: true }),
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
    let keyword = 'approved_by';
    if (req.user.role == 'registrar') {
      keyword = 'enrolled_by';
    }
    if (req.user.role == 'accountant') {
      where = {
        ...where, [Op.and]: db.sequelize.literal('payment.admission_no IS NULL')
      }
    }

    db.user.findAll({
      where,
      include: [
        {
          as: 'academicRecord',
          model: db.academicRecord,
          attributes: ['user', 'course', 'session', 'year']
        },
        {
          model: db.payment, as: 'payment', required: false,
          where: { payment_cause: 'admission_fees' },
          attributes: ['admission_no', 'accountant']
        },
        {
          model: db.user_meta, as: 'userMeta', required: false,
          where: { keyword: keyword },
          attributes: ['user_uid', 'content'],
          include: ['user']
        },
      ],
      group: ['uid']
    })
      .then(r => res.send(r))
      .catch(e => res.status(400).send({ error: `${e}` }))
  },
  setUser: async (req, res, next) => {
    let data = req.body || {};
    if (!!!data.uid) {
      if (data.role == 'student') {
        return res.sendStatus(403);
      } else {
        data.uid = base.decTo62(Date.now());
      }
    }
    db.user.scope('').findOrCreate({
      where: {
        uid: data.uid
      },
      defaults: data
    }).then(async (r) => {
      await r[0].update(data);
      if (req.user.role == 'hr' && !!data.course && data.role == 'hod') {
        await db.course.update({ hod: data.uid }, { where: { uid: data.course } })
      }
      res.send(r[0])
    })
      .catch(e => res.sendError(e))
  },

  refreshUserData: (req, res, next) => {
    return db.user.findOne({
      attributes: ['firstName', 'lastName', 'uid', 'role', 'email', 'phone', 'gender', 'dob', 'picture'],
      where: { uid: req.user.uid }
    })
      .then(async (rr) => {
        rr = JSON.parse(JSON.stringify(rr));
        if (rr.role == 'student') {
          let academicRecord = await db.academicRecord.findOne({ where: { user: rr.uid }, attributes: ['semester', 'course', 'year'] });
          if (!!academicRecord) {
            academicRecord = JSON.parse(JSON.stringify(academicRecord));
            rr.academicRecord = academicRecord;
          }
        }
        return rr;
      })
      .then(r => res.send(r))
      .catch(e => res.status(400).send({ error: `${e}` }))
  },
  getUserByUid: (req, res, next) => {
    let include = [];
    if (!!req.query && !!req.query.include) {
      include = req.query.include.split(',');
    }
    return db.user.findOne({
      where: {
        uid: req.params.uid,
      },
      include
    })
      .then(async (r) => {
        let rs = JSON.parse(JSON.stringify(r))
        if (rs.role == "hod") {
          let courseD = await db.course.findOne({ where: { hod: rs.uid } });
          if (!!courseD) {
            rs.course = courseD.uid
          }
        }
        return res.send(rs)
      })
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
    let uid = req.user.uid;
    if (!!req.params && !!req.params.uid) {
      uid = req.params.uid
    }
    db.user.findOne({
      where: { uid: uid },
      include: ['identity', 'education', 'academicRecord', 'emergency_contact', 'checklist', 'experience', 'documents',
        'payments',
        {
          model: db.payment, as: 'payment', required: false,
          where: { payment_cause: 'admission_fees' },
          attributes: ['admission_no', 'accountant']
        },
        {
          model: db.user_meta, as: 'user_meta', required: false,
          where: {
            keyword: { [Op.in]: ['approved_by', 'enrolled_by', 'reject_resion'] }
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
    await destroyUserData(data.uid);
    let t = await db.sequelize.transaction();
    db.user.create(data, {
      include: ['identity', 'education', 'academicRecord', 'emergency_contact', 'checklist', 'experience', 'documents', 'user_meta']
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
      await t.commit();
      return res.send(r)
    })
      .catch(async (e) => {
        await t.rollback();
        return res.sendError(e)
      })
  }

}