const db = require('../models')
const { Op } = require('sequelize');
var bcrypt = require('bcrypt');
var { sign } = require('../middleware/auth');

module.exports = {
  login: (req, res, next) => {
    let { loginId, password } = req.body || {};
    db.user.scope('').findOne({
      where: {
        status: 1,
        [Op.or]: [
          { email: loginId }, { phone: loginId }
        ]
      }
    }).then(async (r) => {
      if (!!r) {
        let { firstName, lastName, uid, role, email, phone, gender, dob, picture } = r;
        let user = { firstName, lastName, uid, password, role, email, phone, gender, dob, hash: r.password, picture }
        if (role == 'student') {
          let academicRecord = await db.academicRecord.findOne({ where: { user: uid }, attributes: ['semester', 'course', 'year'] });
          if (!!academicRecord) {
            academicRecord = JSON.parse(JSON.stringify(academicRecord));
            user.academicRecord = academicRecord;
          }
        }
        if (role == 'hod') {
          let course = await db.course.findOne({ where: { hod: uid } });
          if (!!course) {
            course = JSON.parse(JSON.stringify(course));
            user.department = course.uid;
          }
        }
        return sign(user)
          .then(r => res.set('authorization', r.token).send(r.user))
          .catch(e => res.status(403).send(e))
      } else {
        return res.status(406).send({ error: "User name is not valid" })
      }
    })
  },
  logout: (req, res, next) => {

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
        if (rr.role == 'hod') {
          let course = await db.course.findOne({ where: { hod: rr.uid } });
          if (!!course) {
            course = JSON.parse(JSON.stringify(course));
            rr.department = course.uid;
          }
        }
        return rr;
      })
      .then(r => res.send(r))
      .catch(e => res.status(400).send({ error: `${e}` }))
  },
  changeSecurity: (req, res, next) => {
    let { new_password, confirm_password, current_password } = req.body || {};
    if (new_password !== confirm_password) {
      return res.status(403).send({ error: 'password and confirm_password should be equal' })
    }
    return db.user.scope('').findOne({ where: { uid: req.user.uid } })
      .then(async (r) => {
        bcrypt.compare(current_password, r.password, async (err, result) => {
          if (!!result) {
            let password = await bcrypt.hash(new_password, 10);
            return r.update({ password })
              .then(() => res.send({ satus: true, message: 'Password updated successfully' }))
              .catch(e => res.status(400).send(e))
          } else {
            return res.status(403).send({ error: "Current Password is incorrect" })
          }
        })
      })
  }
}