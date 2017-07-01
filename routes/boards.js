var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('boards', { title: 'Boards', stylesheet: 'boards.css' });
});

module.exports = router;
