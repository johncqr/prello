var express = require('express');
var router = express.Router();
var requireLogin = require('../libs/requireLogin');

var User = require('../models/user');

router.get('/', requireLogin, function(req, res) {
  res.render('index', { title: 'Boards', stylesheet: 'stylesheets/boards.css' });
});

router.get('/login', function (req, res, next) {
  if (req.user) {
    res.redirect('/')
  } else {
    res.render('login', { title: 'Log In', stylesheet: 'stylesheets/login.css', notice: '' });
  }
});

router.post('/login', function (req, res, next) {
  var notice;
  if (req.body['reg-username']) {
    User.findOne({ email: req.body['reg-email'] }, function (err, user) {
      if (!user) {
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
            notice = `Account "${req.body['reg-email']}" created sucessfully!`;
          }
          res.render('login', { title: 'Log In', stylesheet: 'login.css', notice: notice });
        });
      } else {
        notice = `Account with the email "${req.body['reg-email']}" already exists!`
        res.render('login', { title: 'Log In', stylesheet: 'login.css', notice: notice });
      }
    });
  }
  else if (req.body['login-email']) {
    User.findOne({ email: req.body['login-email'] }, function (err, user) {
      if (user && req.body['login-password'] === user.password) {
        // set cookie with user info
        req.session.user = user;
        res.redirect('/');
      } else {
        notice = 'Invalid username or password';
        res.render('login', { title: 'Log In', stylesheet: 'login.css', notice: notice });
      }
    });
  }
});

router.get('/logout', function (req, res, next) {
    req.session.reset();
    res.redirect('/login');
});

module.exports = router;
