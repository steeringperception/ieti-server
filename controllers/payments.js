const db = require('../models')
const { sendMailTemplate } = require('../helpers');
const { simpleUpload } = require('../lib');
const niceInvoice = require("../lib/invoice");
var fs = require('fs');
const path = require('path');


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
    let user = await db.user.findOne({ where: { uid: data.admission_no } });
    return db.payment.create(data)
      .then(async (ress) => {
        let invoiceId = `${ress.id}`
        if (invoiceId.length < 3) invoiceId = ("000" + invoiceId).substr(-3);
        await generateInvoice(`${user.firstName} ${user.lastName}`,
          user.postboxNo, data.payment_cause, data.payment_mode, parseInt(data.paid_amount), invoiceId)
        let link = `https://ieti-assets.s3.us-east-2.amazonaws.com/invoice/${invoiceId}.pdf`
        await ress.update({ invoice: link, invoice_no: invoiceId })
        await sendMailTemplate('EMAIL_ON_FEE_REMMITANCE', user.email, {
          name: `${user.firstName} ${user.lastName}`, email: user.email, invoice: link
        }, 'Payment Submitted')
        return res.send(ress)
      })
      .catch(e => res.status(400).send({ error: `${e}` }))
  }
}

async function generateInvoice(name, postboxNo, purpose, mode, amount, no) {
  const invoiceDetail = {
    shipping: {
      name: name,
      address: "",
      city: "",
      state: "",
      country: "",
      postal_code: postboxNo
    },
    items: [
      {
        purpose: purpose,
        fees: amount,
        mode: mode,
        tax: "0"
      }
    ],
    subtotal: amount,
    total: amount,
    order_number: no,
    header: {
      company_name: "",
      company_logo: "public/images/full-logo-black.png",
      company_address: "Dubai Academic city, Block 10, Office No.803"
    },
    footer: {
      text: ""
    },
    currency_symbol: "AED",
    date: {
      billing_date: new Date().toDateString(),
      due_date: "",
    }
  };
  let fl = `public/invoice/${no}.pdf`;
  await niceInvoice(invoiceDetail, fl);
  setTimeout(async () => {
    await new Promise(res => {
      fs.readFile(path.resolve(__dirname, `../public/invoice/${no}.pdf`), function (err, data) {
        if (err) {
          return res('')
        }
        return simpleUpload(`invoice/${no}.pdf`, data, 'application/pdf')
          .then(response => {
            fs.unlink(path.resolve(__dirname, `../public/invoice/${no}.pdf`), (e, d) => { })
            return res(response.Location);
          })
          .catch(e => {
            return res('');
          })
      })
    })
  }, 2000)

}