require('dotenv').config();
var AWS = require('aws-sdk');
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  apiVersion: "2010-12-01"
});
module.exports = AWS