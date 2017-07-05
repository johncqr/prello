var express = require('express');
var router = express.Router();
var requireLogin = require('../libs/requireLogin');

router.get('/', requireLogin, function(req, res) {
  res.render('index', { title: 'Boards', stylesheet: 'stylesheets/boards.css' });
});

module.exports = router;
