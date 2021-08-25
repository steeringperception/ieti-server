const db = require('../models')

module.exports = {
  getPayments: async (req, res, next) => {
    return db.payment.findAll({ where: { payment_mode: `${req.params.mode}` } })
      .then(ress => res.send(ress))
      .catch(e => res.status(400).send({ error: `${e}` }))
  },
  setPayments: async (req, res, next) => {
    let data = req.body || {};
    data.accountant = req.user.uid;
    return db.payment.create(data)
      .then(ress => res.send(ress))
      .catch(e => res.status(400).send({ error: `${e}` }))
  }
}