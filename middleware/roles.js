const allowedRoles = (roles, key = null) => (req, res, next) => {
  if (!!key) {
    let params = req.params || {};
    let body = req.body || {};
    if (params[key] == req.user[key] || body[key] == req.user[key])
      return next();
  }
  if (!!roles.includes(req.user.role)) {
    return next()
  } else {
    return res.sendStatus(403)
  }
}
module.exports = allowedRoles;