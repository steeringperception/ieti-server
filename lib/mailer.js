require('dotenv').config();
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: process.env.SMTP,
  port: process.env.SMTP_PORT,
  secure: true, // false for 587, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  },
});

function main() {
  this.object = {
    from: '"IETI Support 👻" <support.ieti@yopmail.com>',
    to: "",
    subject: "IETI Notification",
    text: "",
    html: "",
  }
}
main.prototype.to = function (email) {
  this.object.to = email;
  return this;
}
main.prototype.subject = function (subject) {
  this.object.subject = subject;
  return this;
}
main.prototype.send = function (message) {
  this.object.html = message;
  return transporter.sendMail(this.object).catch(e => console.log(e));
}

module.exports = {
  sendMail: main
}