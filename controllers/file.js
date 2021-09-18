const { simpleUpload } = require('../lib');
const formidable = require('formidable');
var base = require('base-converter');
const db = require('../models');
const { Op } = require('sequelize');

module.exports = {
  upload1: (req, res, next) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        res.writeHead(err.httpCode || 400, { 'Content-Type': 'text/plain' });
        res.end(String(err));
        return;
      }
      console.log(fields.path, files.file)
      res.send('55')
    });
  },
  upload: (req, res, next) => {
    const form = formidable({ multiples: true });

    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(400).send({
          status: false, error: err, message: `${err}`
        });
      }

      let fx = base.decTo62(Date.now());
      var fileName = '';
      let filePath = files.file.path;
      let type = files.file.type;
      if (!!files.file) {
        fileName = files.file.name;
        let folder = fields.path || 'storage';
        const key = `${fx}fx_${folder}/${fileName}`;
        var fs = require('fs');
        fs.readFile(filePath, function (err, data) {
          if (err) {
            return res.status(400).send({
              status: false, error: err, message: `${err}`
            });
          }
          simpleUpload(key, data, type).then((response) => {
            fs.unlink(filePath, function (err) {
              if (err) {
                console.error(err);
              }
            });
            res.send(response)
          }).catch(e => {
            res.status(400).send(e)
          })
        })
      }
    });
  },
  uploadBuffer: (req, res, next) => {
    let data = req.body || { imageBinary: '', path: 'avatar' };
    try {
      let buf = Buffer.from(data.imageBinary.replace(/^data:image\/\w+;base64,/, ""), 'base64')
      let type = data.imageBinary.substring(data.imageBinary.indexOf(":") + 1, data.imageBinary.indexOf(';'))
      let Key = `${data.path || 'avatar'}/${req.user.uid}.${type.replace('image/', '')}`;
      simpleUpload(Key, buf, type)
        .then(async (response) => {
          if (data.path == 'avatar' && !!response.Location) {
            await db.user.update({ picture: response.Location }, { where: { uid: req.user.uid } })
          }
          res.send(response)
        })
        .catch(r => {
          console.log(r)
          res.sendError(r)
        })
    } catch (error) {
      console.log(error);
      res.sendError(error)
    }

  }
}