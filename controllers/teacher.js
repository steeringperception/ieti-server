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
  }
}