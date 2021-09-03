var express = require('express');
var router = express.Router();
const db = require('../models')
const { multiPart2Json } = require('../lib/awsServices');
const niceInvoice = require("../lib/invoice");
// multiPart2Json('avatar', 'picture'),
router.get('/', (req, res, next) => {
  try {
    const invoiceDetail = {
      shipping: {
        name: "Micheal",
        address: "1234 Main Street",
        city: "Dubai",
        state: "Dubai",
        country: "UAE",
        postal_code: 94111
      },
      items: [
        {
          purpose: "Admisssion Fees",
          // description: "None",
          // quantity: 1,
          fees: 50.00,
          tax: "0"
        }
      ],
      subtotal: 156,
      total: 156,
      order_number: 1234222,
      header: {
        company_name: "",
        company_logo: "public/images/full-logo-black.png",
        company_address: "Nice Invoice. 123 William Street 1th Floor New York, NY 123456"
      },
      footer: {
        text: "This is footer - you can add any text here"
      },
      currency_symbol: "AED",
      date: {
        billing_date: "08 August 2020",
        due_date: "10 September 2020",
      }
    };

    niceInvoice(invoiceDetail, 'public/invoice/your-invoice-name.pdf')
    res.send('hello')
  } catch (error) {
    console.log(error)
  }
})

module.exports = router;
