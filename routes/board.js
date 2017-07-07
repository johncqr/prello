var express = require('express');
var mongoose = require('mongoose');
var requireLogin = require('../libs/requireLogin');

var Board = require('../models/board');
var List = require('../models/list');
var Card = require('../models/card');

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
      var newList = new List({
        name: req.body.name
      });
      board.lists.push(newList);
      board.save(function (err, board) {
        sendResource(err, board.lists[board.lists.length-1], res);
      });
    }
  });
});

router.delete('/:bid/list/:lid', function (req, res) {
  Board.findById(req.params.bid, function (err, board) {
    if (err) {
      console.log(err);
    } else {
      var indexToDelete = board.lists.findIndex(function (l) {
        return l._id == req.params.lid;
      });
      if (indexToDelete !== undefined) {
        board.lists.splice(indexToDelete, 1);
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
      var indexToUpdate = board.lists.findIndex(function (l) {
        return l._id == req.params.lid;
      });
      if (indexToUpdate !== undefined) {
        var list = board.lists[indexToUpdate];
        list.name = req.body.name;
        board.lists.set(indexToUpdate, list);
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
      var indexToUpdate = board.lists.findIndex(function (l) {
        return l._id == req.params.lid;
      });
      if (indexToUpdate !== undefined) {
        var list = board.lists[indexToUpdate];
        var newCard = new Card(
          {
            name: req.body.name,
            desc: req.body.desc,
            author: req.user.username
          }
        );
        list.cards.push(newCard);
        board.lists.set(indexToUpdate, list);
        board.save(function (err, board) {
          sendResource(err, board.lists[indexToUpdate], res);
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
      var indexToUpdate = board.lists.findIndex(function (l) {
        return l._id == req.params.lid;
      });
      if (indexToUpdate !== undefined) {
        var list = board.lists[indexToUpdate];
        var cardIndexToDelete = list.cards.findIndex(function (c) {
          return c._id == req.params.cid;
        });
        if (cardIndexToDelete !== undefined) {
          list.cards.splice(cardIndexToDelete, 1);
          board.lists.set(indexToUpdate, list);
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
      var indexToUpdate = board.lists.findIndex(function (l) {
        return l._id == req.params.lid;
      });
      if (indexToUpdate !== undefined) {
        var list = board.lists[indexToUpdate];
        var cardIndexToUpdate = list.cards.findIndex(function (c) {
          return c._id == req.params.cid;
        });
        if (cardIndexToUpdate !== undefined) {
          var card = list.cards[cardIndexToUpdate];
          for (var key in req.body) {
            card[key] = req.body[key];
          }
          list.cards[cardIndexToUpdate] = card;
          board.lists.set(indexToUpdate, list);
          board.save(function (err, board) {
            sendResource(err, board.lists[indexToUpdate], res);
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
      var indexToUpdate = board.lists.findIndex(function (l) {
        return l._id == req.params.lid;
      });
      if (indexToUpdate !== undefined) {
        var list = board.lists[indexToUpdate];
        var cardIndexToUpdate = list.cards.findIndex(function (c) {
          return c._id == req.params.cid;
        });
        if (cardIndexToUpdate !== undefined) {
          var card = list.cards[cardIndexToUpdate];
          var commentData = {
            content: req.body.content,
            username: req.session.user.username,
            datetimePosted: new Date(),
          }
          if (!card.comments) {
            card.comments = [];
          }
          card.comments.push(commentData);
          list.cards[cardIndexToUpdate] = card;
          board.lists.set(indexToUpdate, list);
          board.save(function (err) {
            sendResource(err, commentData, res);
          });
        }
      }
    }
  });
});


module.exports = router;
