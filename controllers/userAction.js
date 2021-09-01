const db = require('../models')
const { Op } = require('sequelize');
var base = require('base-converter');
var bcrypt = require('bcrypt');

const { sendMailTemplate } = require('../helpers');

module.exports = {
  approveStudent: async (req, res, next) => {
    db.user.update({ approvalDate: new Date() }, { where: { uid: req.params.uid } }).then(async (r) => {
      await db.user_meta.findOrCreate({ where: { keyword: 'approved_by', user_uid: req.params.uid } })
        .then(re => re[0].update({ content: req.user.uid }));
      let user = await db.user.findOne({ where: { uid: req.params.uid } });
      if (!!user) {
        await sendMailTemplate('EMAIL_ON_APPLICATION_APPROVAL', user.email, {
          name: `${user.firstName} ${user.lastName}`,
          fees: `2000AED`,
          admisiionNo: req.params.uid
        }, 'Application Approved')
      }
      return res.send({ status: true })
    })
      .catch(e => res.sendError(e))
  },
  rejectStudent: async (req, res, next) => {
    try {
      await db.user_meta.findOrCreate({ where: { keyword: 'reject_resion', user_uid: req.body.uid } })
        .then(re => re[0].update({ content: req.body.resion }));
      await db.user.update({ status: -1 }, { where: { uid: req.body.uid } })
      return res.send({ status: true })
    } catch (e) {
      return res.sendError(e);
    }
  },

  activateStudent: async (req, res, next) => {
    try {
      return db.user.findOne({ where: { uid: req.params.uid } }).then(async (user) => {
        if (!!user) {
          let password = await Buffer.from(req.params.uid).toString('base64').replace('==', '');
          let hash = await bcrypt.hash(password, 10);
          await user.update({ status: 1, password: hash });
          await sendMailTemplate('EMAIL_ON_STUDENT_ACTIVATED', user.email, {
            name: `${user.firstName} ${user.lastName}`,
            username: user.email,
            password: password
          }, 'Application Approved')
        }
      })
    } catch (error) {
      return res.sendError(error);
    }
  }

}