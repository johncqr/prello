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

function performRehash(req, res, base) {
    var hash = makeHash(base + Date.now().toString());
    ForgotKey.findOne({ hashCode: hash }, function (err, key) {
        if (key) {
            performRehash(req, res, hash);
        } else {
            User.findOne({ email: req.body.email }, function (err, user) {
                var newForgotKey = new ForgotKey({
                    hashCode: hash,
                    userId: user._id,
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
                            title: 'Forgot Password',
                            stylesheet: forgotLinkStyle,
                            hash: key.hashCode,
                        });
                    }
                });
            });
        }
    });
}


router.post('/', function (req, res, next) {
    User.findOne({ email: req.body.email }, function (err, user) {
        if (!user) {
            res.render('forgot', {
                title: 'Forgot Password',
                stylesheet: forgotStyle,
                notice: 'We could not find that email in our records.' });
        } else {
            performRehash(req, res, req.body.email);
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
            User.findById(key.userId, function (err, user) {
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