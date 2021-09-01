const db = require('../models');
const { sendSesMail } = require('../lib')

module.exports = {
  prepareMail: async (template, data = {}) => {
    let tem = await db.templates.findOne({ where: { code: template } });
    let content = ''
    if (!!tem) {
      content = tem.content;
      for (let key in data) {
        let k = "${" + key + "}";
        content = content.split(k).join(data[key])
      }
    } else {
      for (let key in data) {
        content = content + `<tr><td>${key}</td><td>${data[key]}</td></tr>`;
      }
      content = `<table>${content}</table>`
    }
    return content;
  },
  sendMailTemplate: async (template, email, data, subject) => {
    let mail = await module.exports.prepareMail(template, data);
    if (!!mail) {
      return new sendSesMail().subject(subject)
        .to(email).send(mail)
    } else {
      return Promise.resolve();
    }
  }
}