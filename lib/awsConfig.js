require('dotenv').config();
var AWS = require('aws-sdk');
let config = { apiVersion: "2010-12-01" };
if (!!process.env) {
  if (!!process.env.AWS_REGION) config.region = process.env.AWS_REGION;
  if (!!process.env.AWS_ACCESS_KEY_ID) config.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  if (!!process.env.AWS_SECRET_ACCESS_KEY) config.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
}
AWS.config.update(config);
module.exports = AWS