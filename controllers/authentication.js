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