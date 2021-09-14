"use strict";
require('dotenv').config();
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + "/../config/config.json")[env];
const Sequelize = require("sequelize");
// const { sendMail } = require('./awsServices');
const { sendMail } = require('./mailer');

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}
Sequelize.Model.prototype.notify = function (options, field = 'email') {
  return new sendMail().to(this[field])
    .subject(options.subject)
    .send(options.message)
}
module.exports = {
  sequelize
};