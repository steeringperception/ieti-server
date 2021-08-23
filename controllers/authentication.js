const db = require('../models')
const { Op } = require('sequelize');
var bcrypt = require('bcrypt');
var { sign } = require('../middleware/auth');

module.exports = {
  login: (req, res, next) => {
    let { loginId, password } = req.body || {};
    db.user.scope('').findOne({
      where: {
        [Op.or]: [
          { email: loginId }, { phone: loginId }
        ]
      }
    }).then(async (r) => {
      if (!!r) {
        let { firstName, lastName, uid, role, email, phone, gender, dob, picture } = r;
        let user = { firstName, lastName, uid, password, role, email, phone, gender, dob, hash: r.password, picture }
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
    let { password, confirm_password, oldPassword } = req.body || {};
    if (password !== confirm_password) {
      return res.status(403).send({ error: 'password and confirm_password should be equal' })
    }
    return db.user.scope('').findOne({ where: { uid: req.user.uid } })
      .then(r => {
        bcrypt.compare(data.password, data.hash, (err, result) => {
          if (!!result) {
            return r.update({ password })
              .then(() => res.send({ satus: true, message: 'Password updated successfully' }))
              .catch(e => res.status(400).send(e))
          } else {
            return res.status(403).send({ error: "oldPassword is incorrect" })
          }
        })
      })
  }
}