const db = require('../models')
var base = require('base-converter');
const { resultQr } = require('./results');
const { Op } = require('sequelize');

async function student(user) {
  let where = {
    semester: user.academicRecord.semester,
    course: user.academicRecord.course,
    // startTime: { [Op.gte]: db.sequelize.fn('TIME', (new Date().toTimeString())) },
    // [Op.and]: [db.sequelize.literal(`days->"$.mon"=false`)],
  }
  let schedules = await db.schedule.findAll({
    where,
    attributes: {
      include: [
        [db.sequelize.fn('concat_ws', ' ',
          db.sequelize.col('Teacher.firstName'),
          db.sequelize.col('Teacher.lastName')
        ), 'teacherName']
      ]
    },
    include: { as: 'Teacher', model: db.user, attributes: [] }
  }).catch(e => []);
  let results = await resultQr(user.uid, 3);

  let practices = await db.sequelize.query(`
      SELECT p.id,p.subject,p.type,p.topic,p.lastDate FROM practices p
      LEFT JOIN submissions s ON s.practice_id = p.id
      WHERE s.id IS NULL AND subject IN
      (SELECT uid FROM subjects WHERE course = "${user.academicRecord.course}" AND semester="${user.academicRecord.semester}")`)
    .then((r, m) => r[0])

  return { schedules, results, practices }

}
async function teacher(user) {
  let where = {
    teacher: user.uid,
    // startTime: { [Op.gte]: db.sequelize.fn('TIME', (new Date().toTimeString())) }
  }
  let schedules = await db.schedule.findAll({ where }).catch(e => []);

  let practices = await db.practice.findAll({
    where: {
      lastDate: { [Op.gte]: new Date() },
      teacher: user.uid
    },
    attributes: {
      include: [
        [
          db.sequelize.fn('count',
            db.sequelize.col('Submissions.id')),
          'submitted'
        ]
      ]
    },
    include: [
      {
        model: db.submission,
        required: false, seperate: true,
        as: 'Submissions', attributes: []
      }
    ]
  })

  return { schedules, practices }
}
function hod(uid) {

}
function hr(uid) {

}


module.exports = {
  dashbord: async (req, res, next) => {
    let data = {};
    let user = req.user || '';
    switch (req.user.role) {
      case 'student':
        data = await student(user)
        break;
      case 'teacher':
        data = await teacher(user)
        break;
      case 'hod':
        data = await hod(user)
        break;
      case 'hr':
        data = await hr(user)
        break;
      default:
        break;
    }
    res.send(data)
  }
}