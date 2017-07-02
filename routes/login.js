var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

var User = require('../models/user');

router.get('/', function (req, res, next) {
  res.render('login', { title: 'Log In', stylesheet: 'login.css', notice: '' });
});

router.post('/', function (req, res, next) {
  var notice;
  var newUser = new User({
    username: req.body['reg-username'],
    email: req.body['reg-email'],
    password: req.body['reg-password']
  });
  newUser.save(function (err) {
    if (err) {
      console.log(err);
      notice = 'Could not create account at this time.';
    } else {
      notice = `Account "${newUser.username}" created sucessfully!`;
    }
    res.render('login', { title: 'Log In', stylesheet: 'login.css', notice: notice });
  });
});

module.exports = router;