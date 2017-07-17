var express = require('express');
var router = express.Router();
var makeHash = require('../libs/makeHash');

var User = require('../models/user');
var ForgotKey = require('../models/forgotKey');

var loginStyle = '/stylesheets/login.css';
var forgotStyle = '/stylesheets/login.css';
var forgotLinkStyle = '/stylesheets/forgot.css';
var forgotChangeStyle = '/stylesheets/login.css';

router.get('/', function (req, res, next) {
  res.render('forgot', { title: 'Forgot Password', stylesheet: forgotStyle, notice: '' });
});

router.post('/', function (req, res, next) {
    User.findOne({ email: req.body.email }, function (err, user) {
        if (!user) {
            res.render('forgot', {
                title: 'Forgot Password',
                stylesheet: forgotStyle,
                notice: 'We could not find that email in our records.' });
        } else {
            var hash = makeHash(req.body.email + Date.now().toString());
            // var notDuplicate = false;

            // while (!notDuplicate) {
            //     ForgotKey.findOne({ hashCode: hash }, function (err, key) {
            //         console.log('yes');
            //         if (!key) {
            //             notDuplicate = true;
            //         } else {
            //             makeHash(hash);
            //         }
            //     });
            // }

            var newForgotKey = new ForgotKey({
                hashCode: hash,
                email: req.body.email,
                used: false,
            });

            newForgotKey.save(function (err, key) {
                if (err) {
                    res.render('forgot', {
                        title: 'Forgot Password',
                        stylesheet: forgotStyle,
                        notice: 'We could not reset your password at this time.'
                    });
                } else {
                    res.render('forgotLink', {
                        title: 'Link to Reset',
                        stylesheet: forgotLinkStyle,
                        hash: key.hashCode,
                    });
                }
            });
        }
    });
});

router.get('/:hash', function (req, res, next) {
    ForgotKey.findOne({ hashCode: req.params.hash }, function (err, key) {
        if (err || !key || key.used) {
            res.redirect('/');
        } else {
            res.render('forgotChange', {
                title: 'Change Password',
                stylesheet: forgotChangeStyle,
            });
        }
    });
});

router.post('/:hash', function (req, res, next) {
    ForgotKey.findOne({ hashCode: req.params.hash }, function (err, key) {
        if (err || !key || key.used) {
            res.redirect('/');
        } else {
            User.findOne({ email: key.email }, function (err, user) {
                user.password = makeHash(req.body.password);
                key.used = true;
                key.save();
                user.save(function (err) {
                    if (err) {
                        res.render('login', { title: 'Log In', stylesheet: loginStyle, notice: 'Your password could not be changed at this time.' });
                    }
                    res.render('login', { title: 'Log In', stylesheet: loginStyle, notice: 'You successfully changed your password!' });
                });
            });
        }
    });
});


module.exports = router;