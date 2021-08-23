var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var jwtsecret = "abcdefghijklmnop";

const auth = (req, res, next) => {
  try {
    let token = req.headers.authorization || req.headers.Authorization;
    var decoded = jwt.verify(token, jwtsecret);
    if (!!decoded) {
      req.user = decoded.data;
      next()
    } else {
      return res.sendStatus(406)
    }
  } catch (error) {
    console.log(error)
    return res.sendStatus(406)

  }
}

const sign = async (data) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(data.password, data.hash, function (err, result) {
      if (!!result) {
        delete data.password;
        delete data.hash;
        resolve({
          user: data,
          token: jwt.sign({
            data: data
          }, jwtsecret, { expiresIn: '1h' })
        });
      } else {
        reject({
          error: "Invalid Password"
        })
      }
    });
  })

}
module.exports = { auth, sign };