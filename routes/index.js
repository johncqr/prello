var express = require('express');
var router = express.Router();
var requireLogin = require('../libs/requireLogin');
var sequelize = require('../db');

var User = require('../models/user');

var boardStyle = 'stylesheets/boards.css';
var loginStyle = 'stylesheets/login.css';

router.get('/', requireLogin, function(req, res) {
  res.render('index', { title: 'Boards', stylesheet: boardStyle });
});

router.get('/login', function (req, res, next) {
  if (req.user) {
    res.redirect('/')
  } else {
    res.render('login', { title: 'Log In', stylesheet: loginStyle, notice: '' });
  }
});

router.post('/login', function (req, res, next) {
    var body = req.body;
    var query = `SELECT id, username, email
      FROM users
      WHERE email='${body['login-email']}'
      AND password='${body['login-password']}'`;
    
    sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
      .then(function (user) {
        console.log(user);
        req.session.user = user;
      })
      .catch(function (e) {
        notice = 'Invalid username or password';
        res.render('login', { title: 'Log In', stylesheet: loginStyle, notice: notice });
        console.log(e);
      });
});

router.post('/register', function (req, res, next) {
  var body = req.body;
  var query = `INSERT INTO users(username, email, password) VALUES
        ('${body['reg-username']}', '${body['reg-email']}', '${body['reg-password']}');`;

  sequelize.query(query, { type: sequelize.QueryTypes.INSERT })
    .then(function (user) {
      console.log(user);
      res.status(201).json();
    })
    .catch(function (e) {
      console.log(e);
      res.status(500).send();
    });

  // User.findOne({ email: req.body['reg-email'] }, function (err, user) {
  //   if (!user) {
  //     var newUser = new User({
  //       username: req.body['reg-username'],
  //       email: req.body['reg-email'],
  //       password: req.body['reg-password']
  //     });
  //     newUser.save(function (err) {
  //       if (err) {
  //         console.log(err);
  //         notice = 'Could not create account at this time.';
  //       } else {
  //         notice = `Account "${req.body['reg-email']}" created sucessfully!`;
  //       }
  //       res.render('login', { title: 'Log In', stylesheet: loginStyle, notice: notice });
  //     });
  //   } else {
  //     notice = `Account with the email "${req.body['reg-email']}" already exists!`
  //     res.render('login', { title: 'Log In', stylesheet: loginStyle, notice: notice });
  //   }
  // });
});

router.get('/logout', function (req, res, next) {
    req.session.reset();
    res.redirect('/login');
});

module.exports = router;
