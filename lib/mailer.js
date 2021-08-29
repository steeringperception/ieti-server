const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 465,
  secure: true, // false for 587, false for other ports
  auth: {
    user: "apikey", // generated ethereal user
    pass: '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', // generated ethereal password
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