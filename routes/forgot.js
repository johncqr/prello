var express = require('express');
var router = express.Router();

var forgotStyle = '/stylesheets/login.css';

router.get('/', function (req, res, next) {
  res.render('forgot', { title: 'Forgot Password', stylesheet: forgotStyle, notice: '' });
});

module.exports = router;