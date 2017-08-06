var express = require('express');
var router = express.Router();
var makeHash = require('../../libs/makeHash');

var User = require('../../models/user');
var Board = require('../../models/board');

router.get('/', function (req, res, next) {
  if (req.user) {
    res.json({ username: req.user.username });
  } else {
    res.json({ username: '' });
  }
});

router.post('/login', function (req, res, next) {
    User.findOne({ email: req.body.email }, function (err, user) {
      if (user && makeHash(req.body.password) === user.password) {
        // set cookie with user info
        req.session.user = user;
        res.json({ username: user.username});
      } else {
        res.json({ username: '', notice: 'Invalid username or password'});
      }
    });
});

router.post('/register', function (req, res, next) {
  var notice;
  User.findOne({ email: req.body.email }, function (err, user) {
    if (!user) {
      User.findOne({ username: req.body.username }, function (err, user) {
        if (!user) {
          var newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: makeHash(req.body.password),
          });
          newUser.save(function (err, user) {
            if (err) {
              console.log(err);
              notice = 'Could not create account at this time.';
              res.json({ username: '', notice });
            } else {
              req.session.user = user;
              res.json({ username: user.username });
            }
          });
        } else {
          notice = `Account with the username "${req.body.username}" already exists!`
          res.json({ username: '', notice });
        }
      });
    } else {
      notice = `Account with the email "${req.body.email}" already exists!`
      res.json({ username: '', notice });
    }
  });
});

router.get('/logout', function (req, res, next) {
    req.session.reset();
    res.json({ 'notice': 'Logout successful'});
});

module.exports = router;