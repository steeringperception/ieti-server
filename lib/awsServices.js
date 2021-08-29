
const AWS = require('./awsConfig');
const multer = require('multer')
var multerS3 = require('multer-s3')

function sendMail() {
  this.params = {
    Destination: {
      CcAddresses: [],
      ToAddresses: []
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8", Data: ''
        },
        Text: {
          Charset: "UTF-8", Data: ''
        }
      },
      Subject: {
        Charset: 'UTF-8', Data: 'IETI Notification'
      }
    },
    Source: 'support@ieti.institute',
    ReplyToAddresses: ['support@ieti.institute'],
  };
  if (!!process.env.REPLY_ADDRESS) {
    this.params.ReplyToAddresses.push(process.env.REPLY_ADDRESS)
  }
  if (!!process.env.SENDER_EMAIL_ADDRESS) {
    this.params.Source = process.env.SENDER_EMAIL_ADDRESS
  }
};
sendMail.prototype.to = function (email) {
  this.params.Destination.ToAddresses.push(email);
  return this;
};
sendMail.prototype.cc = function (email) {
  this.params.Destination.CcAddresses.push(email);
  return this;
};

sendMail.prototype.subject = function (subject) {
  this.subject = subject;
  return this;
};
sendMail.prototype.send = function (message) {
  this.params.Message.Body.Html.Data = message;
  return new AWS.SES().sendEmail(this.params).promise();
};

const multiPart2Json = (fileKey, fileUrlKey) => async (req, res, next) => {
  var s3 = new AWS.S3()
  let ops = {
    storage: multerS3({
      s3: s3,
      bucket: 'ieti-assets',
      acl: 'public-read',
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        cb(null, file.originalname)
      }
    })
  }
  const upload = multer(ops).single(fileKey);
  upload(req, res, function (err) {
    // if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading.
    // } else if (err) {
    // An unknown error occurred when uploading.
    // }
    if (!!err) {
      return res.status(500).send({ error: `${err}` })
    }
    req.header('Content-Type', 'application/json');
    req.body = {
      [fileUrlKey]: req.file.location,
      ...req.body
    };
    next()
  })
}

const simpleUpload = async (key, data, type) => {
  var s3 = new AWS.S3()
  const params = {
    Bucket: 'ieti-assets',
    Key: key,
    Body: data,
    ACL: 'public-read',
    ContentType: type
  };
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (!!err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

module.exports = {
  sendSesMail: sendMail,
  multiPart2Json, simpleUpload
}