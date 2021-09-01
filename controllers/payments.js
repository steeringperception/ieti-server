const db = require('../models')
const { sendMailTemplate } = require('../helpers');

module.exports = {
  getPayments: async (req, res, next) => {
    let params = req.params || {};
    // let where = {};
    // if (params.mode) {
    //   where.payment_mode = `${params.mode}`;
    // }
    // if (params.uid) {
    //   where.admission_no = `${params.uid}`;
    // }
    let sql = `SELECT p.admission_no,paid_amount,payment_mode,payment_cause,p.createdAt,firstName,lastName,email,class,course,academic_year FROM payments p
            JOIN users u ON u.uid = p.admission_no
            LEFT JOIN academic_records ar ON ar.user = p.admission_no
            where payment_mode like "%${(params.mode || '')}%" and admission_no like "%${(params.uid || '')}"`;
    // return db.payment.findAll({ wheres })
    return db.sequelize.query(sql)
      // .spread((r, m) => r)
      .then(ress => res.send(ress[0]))
      .catch(e => res.status(400).send({ error: `${e}` }))
  },
  setPayments: async (req, res, next) => {
    let data = req.body || {};
    data.accountant = req.user.uid;
    return db.payment.create(data)
      .then(async (ress) => {
        let user = await db.user.findOne({ where: { uid: data.admission_no } });
        await sendMailTemplate('EMAIL_ON_FEE_REMMITANCE', user.email, {
          name: `${user.firstName} ${user.lastName}`, email: user.email
        }, 'Payment Submitted')
        return res.send(ress)
      })
      .catch(e => res.status(400).send({ error: `${e}` }))
  }
}