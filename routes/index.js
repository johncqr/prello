var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index', { title: 'Board Title', stylesheet: 'boardpage.css' });
});

module.exports = router;
