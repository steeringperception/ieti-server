const db = require('../models')
var base = require('base-converter');

async function getCourses(cond = {}) {
  return db.course.findAll({
    where: cond,
    attributes: { include: [[db.sequelize.fn('concat_ws', ' ', db.sequelize.col('HOD.firstName'), db.sequelize.col('HOD.lastName')), 'hodName']] },
    include: {
      model: db.user,
      as: 'HOD', attributes: []
    }
  });
}
async function getSemesters(cond = {}) {
  return db.semester.findAll({
    where: cond,
    attributes: { include: [[db.sequelize.col('Course.title'), 'courseName']] },
    include: {
      model: db.course,
      as: 'Course', attributes: []
    }
  });
}
async function getSubjects(cond = {}) {
  return db.subject.findAll({
    where: cond,
    attributes: {
      include: [
        [db.sequelize.col('Course.title'), 'courseName'],
        [db.sequelize.col('Semester.title'), 'semesterName'],
        [db.sequelize.fn('concat_ws', ' ',
          db.sequelize.col('Teacher.firstName'),
          db.sequelize.col('Teacher.lastName')
        ), 'teacherName']
      ]
    },
    include: [{
      model: db.course,
      as: 'Course', attributes: []
    },
    {
      model: db.semester,
      as: 'Semester', attributes: []
    },
    {
      model: db.user,
      as: 'Teacher', attributes: []
    }
    ]
  })
}

module.exports = {
  getAcademic: async (req, res, next) => {
    db.academicRecord.findOne({ where: { user: req.params.uid } })
      .then(r => res.send(r))
      .catch(e => res.sendError(e))
  },
  setAcademic: async (req, res, next) => {
    let data = req.body || {};
    db.academicRecord.findOrCreate({ where: { user: req.params.uid }, defaults: data })
      .then(async (r) => {
        await r[0].update(data)
        return res.send(r[0])
      })
      .catch(e => res.sendError(e))
  },
  academicStructure: async (req, res, next) => {
    let courses = await getCourses();
    let semesters = await getSemesters();
    let subjects = await getSubjects();
    res.send({ courses, semesters, subjects })
  },
  getStructure: async (req, res, next) => {
    let inst = Promise.resolve([]);
    let params = req.params || {};
    let cd = {};
    let query = req.query || {};
    let { course, semester, subject, session } = query;
    if (params.type == 'courses') {
      inst = getCourses();
    }
    if (params.type == 'semesters') {
      if (!!course) cd = { course }
      inst = getSemesters(cd);
    }
    if (params.type == 'subjects') {
      if (!!course) cd.course = course;
      if (!!semester) cd.semester = semester;
      inst = getSubjects(cd);
    }
    inst.then(r => res.send(r)).catch(e => res.sendError(e))
  },
  getentityByid: async (req, res, next) => {
    let params = req.params || {};
    if (!!!params.model || !!!params.id) {
      return res.sendStatus(404)
    }
    console.log(params)
    return db[params.model].findOne({ where: { id: params.id } })
      .then(r => res.send(r))
      .catch(r => res.sendError(r))
  },
  addStructure: async (req, res, next) => {
    let model = req.params.model;
    let data = req.body;
    if (!!!model || !!!data) {
      return res.status(400).send({ error: "Invalid Payload" })
    }
    if (!!!data.uid) {
      data.uid = base.decTo62(Date.now());
    }
    return db[model].findOrCreate({ where: { uid: data.uid }, defaults: data })
      .then(r => db[model].update(data, { where: { uid: data.uid } }))
      .then(async () => {
        let inst = {};
        if (model == 'course') {
          inst = await getCourses();
        }
        if (model == 'semester') {
          inst = await getSemesters();
        }
        if (model == 'subject') {
          inst = await getSubjects();
        }
        res.send(inst)
      })
      .catch(e => res.sendError(e))
  },
  deleteEntity: async (req, res, next) => {
    let params = req.params || {};
    if (!!!params.model || !!!params.uid) {
      return res.status(400).send({ error: "Invalid Payload" })
    }
    return db[params.model].destroy({ where: { uid: params.uid } })
      .then(r => res.send({ status: true }))
      .catch(r => res.sendError(r))
  },
  addSchedules: async (req, res, next) => {
    let data = req.body || {};
    db.schedule.findOrCreate({
      where: { semester: data.semester, course: data.course, subject: data.subject },
      defaults: data
    })
      .then(re => {
        re[0].update(data);
        return re[0];
      })
      .then(r => {
        res.send(r)
      })
      .catch(r => res.sendError(r))
  },
  getSchedules: async (req, res, next) => {
    let params = req.params || {};
    let where = {};
    if (!!params.course) {
      where.course = params.course;
    }
    db.schedule.findAll({
      where,
      attributes: {
        include: [
          [db.sequelize.col('Subject.title'), 'subjectName'],
          [db.sequelize.fn('concat_ws', ' ',
            db.sequelize.col('Teacher.firstName'),
            db.sequelize.col('Teacher.lastName')
          ), 'teacherName']
        ]
      },
      include: [
        { as: 'Teacher', model: db.user, attributes: [] },
        { as: 'Subject', model: db.subject, attributes: [] }
      ]
    }).then(e => res.send(e)).catch(r => res.sendError(r));
  }

}