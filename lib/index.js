"use strict";
const { middleware } = require(__dirname + "/response");
const { sequelize } = require(__dirname + "/sequelize");
const { sendSesMail, simpleUpload } = require(__dirname + "/awsServices");
const { sendMail } = require(__dirname + "/mailer");
module.exports = {
    middleware, sequelize, sendMail, sendSesMail, simpleUpload
};