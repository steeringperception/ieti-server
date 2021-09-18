const db = require('../models')


async function mySubject(cond = {}) {
  return db.schedule.findAll({
    where: cond,
    attributes: [
      ['subject', 'uid'],
      [db.sequelize.col('Subject.title'), 'title'],
    ],
    include: [{
      model: db.subject,
      as: 'Subject', attributes: []
    }]
  })
}

module.exports = {
  subjects: async (req, res, next) => {
    mySubject({ teacher: req.user.uid }).then(resp => {
      res.send(resp)
    }).catch(e => res.sendError(e))
  },
  submissions: async (req, res, next) => {
    let where = {};
    if (!!req.params && req.params.practiceId) {
      where = { id: req.params.practiceId }
    }
    db.practice.findOne({
      where,
      include: [{
        model: db.submission,
        as: 'Submissions',
        include: {
          model: db.user.scope('minimum'),
          as: 'student'
        }
      }]
    })
      .then(resp => res.send(resp))
      .catch(resp => res.sendError(resp))
  },
  awardMarks: async (req, res, next) => {
    db.submission.update({ marks: req.body.marks, result: (req.body.result || '') }, { where: { id: req.body.id } })
      .then(resp => res.send(resp))
      .catch(resp => res.sendError(resp))
  },
  addPractice: async (req, res, next) => {
    let data = req.body || {};
    let inst;
    data.teacher = req.user.uid;
    if (!!data.id) {
      inst = db.practice.update(data, { where: { id: data.id } })
    } else {
      inst = db.practice.create(data);
    }
    inst.then(resp => res.send(resp)).catch(e => res.sendError(e))
  }
}