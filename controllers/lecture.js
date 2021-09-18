const db = require('../models')
var base = require('base-converter');



module.exports = {
  lectures: async (req, res, next) => {
    let query = req.query || {};
    let params = req.params || {};
    let where = {};

    if (!!query.subject) {
      where.subject = query.subject;
    }
    if (!!query.type) {
      where.type = query.type;
    }
    if (!!query.teacher) {
      where.teacher = query.teacher;
    }
    // if (!!query.session) {
    //   where.session = query.session;
    // }
    // else {
    //   where.session = query.session;
    // }
    if (!!params.type) {
      where.type = params.type;
    }
    if (!!params.subject) {
      where.subject = params.subject;
    }

    return db.lecture.findAll({
      where,
      attributes: {
        include: [
          [
            db.sequelize.fn('concat_ws', ' ',
              db.sequelize.col('Teacher.firstName'),
              db.sequelize.col('Teacher.lastName')),
            'teacherName'
          ]
        ]
      },
      include: {
        model: db.user,
        as: 'Teacher', attributes: []
      },
      order: [['createdAt', 'DESC']]
    }).then(r => res.send(r)).catch(e => res.sendError(e))
  }
}