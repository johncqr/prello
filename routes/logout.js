var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    req.session.reset();
    res.redirect('/login');
});

module.exports = router;