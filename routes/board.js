var express = require('express');
var mongoose = require('mongoose');
var requireLogin = require('../libs/requireLogin');

var Board = require('../models/board');

var router = express.Router();
router.use(requireLogin);

var boardpageStyle = '../stylesheets/boardpage.css';

function sendResource(err, resource, res) {
  if (err) {
    console.log(err);
  } else {
    res.json(resource);
  }
}

router.get('/', function (req, res) {
  Board.find({ creator: req.user.username }, function (err, boards) {
    sendResource(err, boards, res);
  });
});

router.post('/', function (req, res) {
  var newBoard = new Board({
    name: req.body.name,
    creator: req.user.username
  });
  newBoard.save(function (err, board) {
    sendResource(err, board, res);
  });
});

router.get('/:bid', function (req, res) {
  res.render('boardpage', { title: 'Prello', stylesheet: boardpageStyle });
});

router.delete('/:bid', function (req, res) {
  Board.findById(req.params.bid, function (err, board) {
    if (err) {
      console.log(err);
    } else {
      board.remove();
    }
  });
});

router.get('/:bid/list', function (req, res) {
  Board.findById(req.params.bid, function (err, board) {
    sendResource(err, board.lists, res);
  });
});

router.post('/:bid/list', function (req, res) {
  Board.findById(req.params.bid, function (err, board) {
    if (err) {
      console.log(err);
    } else {
      var newList = {
        name: req.body.name,
      };
      board.lists.push(newList);
      board.save(function (err, board) {
        sendResource(err, board.lists[board.lists.length - 1], res);
      });
    }
  });
});

router.delete('/:bid/list/:lid', function (req, res) {
  Board.findById(req.params.bid, function (err, board) {
    if (err) {
      console.log(err);
    } else {
      var list = board.lists.id(req.params.lid);
      if (list) {
        list.remove();
        board.save(function (err) {
          if (err) {
            console.log(err);
          }
        });
      }
    }
  });
  res.send();
});

router.patch('/:bid/list/:lid', function (req, res) {
  Board.findById(req.params.bid, function (err, board) {
    if (err) {
      console.log(err);
    } else {
      var list = board.lists.id(req.params.lid);
      if (list) {
        list.name = req.body.name;
        board.save(function (err, board) {
          sendResource(err, board.lists, res);
        });
      }
    }
  });
});

router.post('/:bid/list/:lid/card', function (req, res) {
  Board.findById(req.params.bid, function (err, board) {
    if (err) {
      console.log(err);
    } else {
      var list = board.lists.id(req.params.lid);
      if (list) {
        var newCard = {
          name: req.body.name,
          desc: req.body.desc,
          author: req.user.username
        }
        list.cards.push(newCard);
        board.save(function (err, board) {
          sendResource(err, list, res);
        });
      }
    }
  });
});

router.delete('/:bid/list/:lid/card/:cid', function (req, res) {
  Board.findById(req.params.bid, function (err, board) {
    if (err) {
      console.log(err);
    } else {
      var list = board.lists.id(req.params.lid);
      if (list) {
        var card = list.cards.id(req.params.cid);
        if (card) {
          card.remove();
          board.save(function (err) {
            if (err) {
              console.log(err);
            }
          });
        }
      }
    }
  });
  res.send();
});

router.patch('/:bid/list/:lid/card/:cid', function (req, res) {
  Board.findById(req.params.bid, function (err, board) {
    if (err) {
      console.log(err);
    } else {
      var list = board.lists.id(req.params.lid);
      if (list) {
        var card = list.cards.id(req.params.cid);
        if (card) {
          for (var key in req.body) {
            card[key] = req.body[key];
          }
          board.save(function (err, board) {
            sendResource(err, list, res);
          });
        }
      }
    }
  });
});

router.post('/:bid/list/:lid/card/:cid/comment', function (req, res) {
  Board.findById(req.params.bid, function (err, board) {
    if (err) {
      console.log(err);
    } else {
      var list = board.lists.id(req.params.lid);
      if (list) {
        var card = list.cards.id(req.params.cid);
        if (card) {
          var comment = {
            content: req.body.content,
            username: req.session.user.username,
            datetimePosted: new Date(),
          }
          card.comments.push(comment);
          board.save(function (err) {
            sendResource(err, card.comments[card.comments.length-1], res);
          });
        }
      }
    }
  });
});


module.exports = router;
