var express = require('express');
var router = express.Router();
const { auth } = require('../middleware/auth');
const allowedRoles = require('../middleware/roles');
var lecture = require('../controllers/lecture');
var practices = require('../controllers/practices');
var material = require('../controllers/material');
var results = require('../controllers/results');

const userTypeAllowedParams = (req, res, next) => {
  if (
    ['teacher', 'student', 'admin', 'hr', 'hod', 'registrar', 'accountant'].includes(req.params.role)
  ) {
    return next()
  } else {
    return res.sendStatus(404)
  }
}


// Lectures
router.get('/lectures', lecture.lectures);
router.get('/lectures/:subject', lecture.lectures);
router.get('/lectures/:subject/:type', lecture.lectures);

// Practice
router.get('/practices', practices.practices);
router.get('/practices/content/:id', practices.getContentById);
router.get('/practices/:subject', practices.practices);
router.get('/practices/:subject/:type', practices.practices);
router.post('/practices/submit', practices.submitPractice);

// Matterial
router.get('/material-tree/:subject', material.getCourseTree);

// Results
router.get('/results', results.results);
router.get('/results/:uid', results.results);

module.exports = router;
