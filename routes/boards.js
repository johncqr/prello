var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  if (req.user) {
    res.render('boards', { title: 'Boards', stylesheet: 'boards.css' });
  } else{
    res.redirect('/login');
  }
});

module.exports = router;
