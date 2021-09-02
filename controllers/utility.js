const db = require('../models')
var base = require('base-converter');

module.exports = {
  getGlobalList: async (req, res, next) => {
    return Promise.all([
      db.class.findAll().catch(e => { return { classes: [] } }),
      db.course.findAll().catch(e => { return { courses: [] } }),
      db.academic_year.findAll().catch(e => { return { academic_years: [] } }),
    ]).then(([classes, courses, academic_years]) => {
      res.send({ classes, courses, academic_years })
    })
  }
}