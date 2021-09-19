const db = require('../models');

async function resultQr(student_uid, limit = null) {

  return db.submission.findAll({
    where: { student_uid },
    attributes: [
      'marks', 'student_uid', 'result',
      [db.sequelize.col('practice.marks'), 'maxMarks'],
      [db.sequelize.col('practice.topic'), 'topic'],
      [db.sequelize.col('practice.subject'), 'subject'],
    ],
    include: [
      {
        model: db.practice,
        as: 'practice',
        required: true,
        attributes: []
      }
    ],
    order: [['createdAt', 'DESC']],
    limit: !!limit ? limit : 99999999999
  })
}



module.exports = {
  results: async (req, res, next) => {
    let student_uid = req.user.uid;
    if (req.params && req.params.uid) {
      student_uid = req.params.uid;
    }
    resultQr(student_uid).then(r => res.send(r)).catch(e => res.sendError(e))
  },
  resultQr
}