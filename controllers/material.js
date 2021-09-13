const db = require('../models');
const { Op } = require('sequelize');
var base = require('base-converter');


module.exports = {
  getCourseTree: async (req, res, next) => [
    db.material.findAll({
      where: {
        subject: req.params.subject,
        parent: null
      },
      // attributes: ['id', 'topic', 'parent', 'subject'],
      include: [
        {
          model: db.material.scope('tree'),
          as: 'children',
          required: false, seperate: true
        }
      ]

    }).then(e => res.send(e)).catch(e => res.sendError(e))
  ]
}