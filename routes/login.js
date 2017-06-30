var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('login', { title: 'Log In', stylesheet: 'login.css' });
});

module.exports = router;
