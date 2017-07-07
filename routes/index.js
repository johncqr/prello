var express = require('express');
var router = express.Router();
var requireLogin = require('../libs/requireLogin');

var User = require('../models/user');
var Board = require('../models/board');

var boardStyle = 'stylesheets/boards.css';
var loginStyle = 'stylesheets/login.css';

router.get('/', requireLogin, function(req, res) {
  Board.find({ creator: req.user.username }, function (err, boards) {
    res.render('index', { title: 'Boards', boards, stylesheet: boardStyle });
  });
});

router.get('/login', function (req, res, next) {
  if (req.user) {
    res.redirect('/')
  } else {
    res.render('login', { title: 'Log In', stylesheet: loginStyle, notice: '' });
  }
});

router.post('/login', function (req, res, next) {
    User.findOne({ email: req.body.email }, function (err, user) {
      if (user && req.body.password === user.password) {
        // set cookie with user info
        req.session.user = user;
        res.redirect('/');
      } else {
        notice = 'Invalid username or password';
        res.render('login', { title: 'Log In', stylesheet: loginStyle, notice: notice });
      }
    });
});

router.post('/register', function (req, res, next) {
  var notice;
  User.findOne({ email: req.body.email }, function (err, user) {
    if (!user) {
      var newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      });
      newUser.save(function (err) {
        if (err) {
          console.log(err);
          notice = 'Could not create account at this time.';
        } else {
          notice = `Account "${req.body.email}" created sucessfully!`;
        }
        res.render('login', { title: 'Log In', stylesheet: loginStyle, notice: notice });
      });
    } else {
      notice = `Account with the email "${req.body.email}" already exists!`
      res.render('login', { title: 'Log In', stylesheet: loginStyle, notice: notice });
    }
  });
});

router.get('/logout', function (req, res, next) {
    req.session.reset();
    res.redirect('/login');
});

module.exports = router;
