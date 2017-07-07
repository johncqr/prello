var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var requireLogin = require('../libs/requireLogin');

var Board = require('../models/board');
var List = require('../models/list');
var Card = require('../models/card');
var boardpageStyle = '../stylesheets/boardpage.css';

router.use(requireLogin);

router.get('/', function (req, res) {
  Board.find({ creator: req.user.username }, function (err, boards) {
    res.json(boards);
  });
});

router.post('/', function (req, res) {
  var newBoard = new Board({
    name: req.body.name,
    creator: req.user.username
  });
  newBoard.save(function (err, board) {
    if (err) {
      console.log(err);
    } else {
      res.json(board);
    }
  });
});

router.get('/:bid', function (req, res) {
  res.render('boardpage', { title: 'Prello', stylesheet: boardpageStyle });
});

router.get('/:bid/list', function (req, res) {
  Board.findById(req.params.bid, function (err, board) {
    if (err) {
      console.log(err);
    } else {
      res.json(board.lists);
    }
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
        if (err) {
          console.log(err);
        } else {
          res.json(board.lists[board.lists.length-1]);
        }
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
          if (err) {
            console.log(err);
          } else {
            res.json(board.lists);
          }
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
          if (err) {
            console.log(err);
          } else {
            res.json(board.lists[indexToUpdate]);
          }
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
          var card = req.body;
          card._id = mongoose.Types.ObjectId(req.body._id);
          board.lists[indexToUpdate].cards[cardIndexToUpdate] = card;
          board.lists.set(indexToUpdate, list);
          board.save(function (err, board) {
            if (err) {
              console.log(err);
            } else {
              res.json(board.lists[indexToUpdate]);
            }
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
            if (err) {
              console.log(err);
            } else {
              res.json(commentData);
            }
          });
        }
      }
    }
  });
});


module.exports = router;
