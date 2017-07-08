var express = require('express');
var mongoose = require('mongoose');
var requireLogin = require('../libs/requireLogin');

var Board = require('../models/board');

var router = express.Router();
router.use(requireLogin);

var boardpageStyle = '../stylesheets/boardpage.css';
var errorRequestMessage = 'Error handling request!';

function sendResource(err, resource, res) {
  if (err) {
    console.log(err);
    res.status(500).send('Error handling your request!');
  } else {
    res.json(resource);
  }
}

function checkExistResource(resource, res) {
  if (!resource) {
    res.status(404).send('Resource not found!');
    return false;
  } 
  return true;
}

function handleSaveError(err, res) {
  console.log(err);
  res.status(500).send('Error handling your request!');
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
  Board.findById(req.params.bid, function (err, board) {
    if (checkExistResource(board, res)) {
      Board.find({ creator: req.user.username }, function (err, boards) {
        res.render('boardpage', { title: board.name, boards, stylesheet: boardpageStyle });
      });
    }
  });
});

router.delete('/:bid', function (req, res) {
  Board.findById(req.params.bid, function (err, board) {
    if (err) {
      console.log(err);
    } else {
      if (!board) {
        res.status(500).send(errorRequestMessage);
      }
      board.remove();
    }
  });
});

router.get('/:bid/list', function (req, res) {
  Board.findById(req.params.bid, function (err, board) {
    if (checkExistResource(board, res)) {
      sendResource(err, board.lists, res);
    }
  });
});

router.post('/:bid/list', function (req, res) {
  Board.findById(req.params.bid, function (err, board) {
    if (err) {
      console.log(err);
    } else {
      if (checkExistResource(board, res)) {
        var newList = {
          name: req.body.name,
        };
        board.lists.push(newList);
        board.save(function (err, board) {
          if (err) {
            handleSaveError(err, res);
          }
          sendResource(err, board.lists[board.lists.length - 1], res);
        });
      }
    }
  });
});

router.delete('/:bid/list/:lid', function (req, res) {
  Board.findById(req.params.bid, function (err, board) {
    if (err) {
      console.log(err);
    } else {
      if (checkExistResource(board, res)) {
        var list = board.lists.id(req.params.lid);
        if (checkExistResource(list, res)) {
          list.remove();
          board.save(function (err) {
            if (err) {
              handleSaveError(err, res);
            } else {
              res.send();
            }
          });
        }
      }
    }
  });
});

router.patch('/:bid/list/:lid', function (req, res) {
  Board.findById(req.params.bid, function (err, board) {
    if (err) {
      console.log(err);
    } else {
      if (checkExistResource(board, res)) {
        var list = board.lists.id(req.params.lid);
        if (checkExistResource(list, res)) {
          list.name = req.body.name;
          board.save(function (err, board) {
            if (err) {
              handleSaveError(err, res);
            }
            sendResource(err, board.lists, res);
          });
        }
      }
    }
  });
});

router.post('/:bid/list/:lid/card', function (req, res) {
  Board.findById(req.params.bid, function (err, board) {
    if (err) {
      console.log(err);
    } else {
      if (checkExistResource(board, res)) {
        var list = board.lists.id(req.params.lid);
        if (checkExistResource(list, res)) {
          var newCard = {
            name: req.body.name,
            desc: req.body.desc,
            author: req.user.username
          }
          list.cards.push(newCard);
          board.save(function (err, board) {
            if (err) {
              handleSaveError(err, res);
            }
            sendResource(err, list, res);
          });
        }
      }
    }
  });
});

router.delete('/:bid/list/:lid/card/:cid', function (req, res) {
  Board.findById(req.params.bid, function (err, board) {
    if (err) {
      console.log(err);
    } else {
      if (checkExistResource(board, res)) {
        var list = board.lists.id(req.params.lid);
        if (checkExistResource(list, res)) {
          var card = list.cards.id(req.params.cid);
          if (card) {
            card.remove();
            board.save(function (err) {
              if (err) {
                handleSaveError(err, res);
              }
            });
          }
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
      if (checkExistResource(board, res)) {
        var list = board.lists.id(req.params.lid);
        if (checkExistResource(list, res)) {
          var card = list.cards.id(req.params.cid);
          if (checkExistResource(card, res)) {
            for (var key in req.body) {
              card[key] = req.body[key];
            }
            board.save(function (err, board) {
              if (err) {
                handleSaveError(err, res);
              }
              sendResource(err, list, res);
            });
          }
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
      if (checkExistResource(board, res)) {
        var list = board.lists.id(req.params.lid);
        if (checkExistResource(list, res)) {
          var card = list.cards.id(req.params.cid);
          if (checkExistResource(card, res)) {
            var comment = {
              content: req.body.content,
              username: req.session.user.username,
              datetimePosted: new Date(),
            }
            card.comments.push(comment);
            board.save(function (err) {
              if (err) {
                handleSaveError(err, res);
              }
              sendResource(err, card.comments[card.comments.length - 1], res);
            });
          }
        }
      }
    }
  });
});


module.exports = router;
