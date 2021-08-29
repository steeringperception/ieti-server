const { simpleUpload } = require('../lib');
const formidable = require('formidable');

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


      var fileName = '';
      let filePath = files.file.path;
      let type = files.file.type;
      if (!!files.file) {
        fileName = files.file.name;
        let folder = fields.path || 'storage';
        const key = `${folder}/${fileName}`;
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
}