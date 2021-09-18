const db = require('../models')
var base = require('base-converter');


module.exports = {
  practices: async (req, res, next) => {
    let query = req.query || {};
    let params = req.params || {};
    let where = {};
    if (!!query.subject) {
      where.subject = query.subject;
    }
    if (!!query.type) {
      where.type = query.type;
    }
    if (!!query.session) {
      where.session = query.session;
    }
    // else {
    //   where.session = query.session;
    // }
    if (!!params.type) {
      where.type = params.type;
    }
    if (!!params.subject) {
      where.subject = params.subject;
    }
    let attrInclude = [
      [
        db.sequelize.fn('concat_ws', ' ',
          db.sequelize.col('Teacher.firstName'),
          db.sequelize.col('Teacher.lastName')),
        'teacherName'
      ]
    ];
    let include = [
      {
        model: db.user,
        as: 'Teacher', attributes: []
      }
    ];
    if (req.user.role == 'student') {
      attrInclude.push(
        [
          db.sequelize.col('submission.createdAt'),
          'submitted'
        ]
      );
      include.push(
        {
          model: db.submission,
          required: false, seperate: true,
          as: 'submission', where: { student_uid: req.user.uid },
          attributes: []
        }
      )
    } else {
      attrInclude.push(
        [
          db.sequelize.fn('count',
            db.sequelize.col('Submissions.id')),
          'submitted'
        ]
      );
      include.push(
        {
          model: db.submission,
          required: false, seperate: true,
          as: 'Submissions', attributes: []
        }
      )
    }

    return db.practice.findAll({
      where,
      attributes: {
        include: attrInclude,
        exclude: ['updatedAt', 'content']
      },
      include: include,
      order: [['createdAt', 'DESC']]
    }).then(r => res.send(r)).catch(e => res.sendError(e))
  },
  getContentById: async (req, res, next) => {
    db.practice.findByPk(req.params.id, {
      include: [
        {
          model: db.submission,
          as: 'submission',
          required: false,
          where: { student_uid: req.user.uid }
        }]
    }).then(e => res.send(e)).catch(e => res.sendError(e))
  },
  submitPractice: async (req, res, next) => {
    let data = req.body || {};
    data.student_uid = req.user.uid;
    return db.submission.findOrCreate({
      where: { practice_id: data.practice_id, student_uid: data.student_uid },
      defaults: data
    }).then(r => {
      r[0].update(data,
        // { where: { parctice_id: data.parctice_id, student_uid: data.student_uid } }
      );
      return r[0]
    })
      .then(e => res.send(e)).catch(e => res.sendError(e))
  }
}