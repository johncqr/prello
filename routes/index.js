var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  if (req.user) {
    res.render('index', { title: 'Board Title', stylesheet: 'boardpage.css' });
  } else {
    res.redirect('/login');
  }
});

module.exports = router;
