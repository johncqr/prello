var express = require('express');
var mongoose = require('mongoose');
var requireLogin = require('../libs/requireLogin');

var Board = require('../models/board');
var User = require('../models/user');

var router = express.Router();
router.use(requireLogin);

var io = require('../libs/socketio');

var boardpageStyle = '../stylesheets/boardpage.css';
var errorStyle = '../stylesheets/error.css';
var errorRequestMessage = 'Error handling request!';

function sendResource(err, resource, res) {
  if (err) {
    console.log(err);
    res.status(500).send('Error handling your request!');
  } else {
    res.json(resource);
  }
}

function emitToBoard(bid, eventName, data) {
  io.getInstance().to(bid).emit(eventName, data);
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

function contains(arr, o) {
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] == o) {
      return true;
    }
  }
  return false;
}

function checkPermission(req, res, next) {
  Board.findById(req.params.bid, function (err, board) {
    if (checkExistResource(board, res)) {
      if (contains(board.members, req.user.username)) {
        next();
      } else {
        res.render('error', { title: 'Oops!', message: 'You do not have access to this board!', stylesheet: errorStyle });
      }
    }
  });
}

router.get('/', function (req, res) {
  Board.find({ members: req.user.username }, function (err, boards) {
    sendResource(err, boards, res);
  });
});

router.post('/', function (req, res) {
  var newBoard = new Board({
    name: req.body.name,
    creator: req.user.username,
    members: [req.user.username]
  });
  newBoard.save(function (err, board) {
    sendResource(err, board, res);
  });
});

router.get('/:bid', checkPermission, function (req, res) {
  Board.findById(req.params.bid, function (err, board) {
    if (checkExistResource(board, res)) {
      Board.find({ members: req.user.username }, function (err, boards) {
        res.render('boardpage', { title: board.name, boards, members: board.members, stylesheet: boardpageStyle });
      });
    }
  });
});

router.delete('/:bid', checkPermission, function (req, res) {
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

router.post('/:bid/member', checkPermission, function (req, res) {
  Board.findById(req.params.bid, function (err, board) {
    User.findOne({ username: req.body.username }, function (err, user) {
      if (user) {
        board.members.push(user.username);
        board.save(function (err) {
          if (err) {
            handleSaveError(err, res);
            res.json({ statusMsg: 'Failed to add user' });
          } else {
            res.json({ statusMsg: `${user.username} added`, username: user.username });
          }
        });
      } else {
        res.json({ statusMsg: 'Failed to add user' });
      }
    });
  });
});

router.get('/:bid/list', checkPermission, function (req, res) {
  Board.findById(req.params.bid, function (err, board) {
    if (checkExistResource(board, res)) {
      sendResource(err, board.lists, res);
    }
  });
});

router.post('/:bid/list', checkPermission, function (req, res) {
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
          var list = board.lists[board.lists.length-1];
          emitToBoard(req.params.bid, 'newList', list);
          sendResource(err, list, res);
        });
      }
    }
  });
});

router.delete('/:bid/list/:lid', checkPermission, function (req, res) {
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
              emitToBoard(req.params.bid, 'deleteList', {
                lid: req.params.lid
              });
              res.send();
            }
          });
        }
      }
    }
  });
});

router.patch('/:bid/list/:lid', checkPermission, function (req, res) {
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
            emitToBoard(req.params.bid, 'editList', {
              lid: req.params.lid,
              name: req.body.name
            });
            sendResource(err, board.lists, res);
          });
        }
      }
    }
  });
});

router.post('/:bid/list/:lid/card', checkPermission, function (req, res) {
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
            emitToBoard(req.params.bid, 'newCard', {
              cardData: list.cards[list.cards.length-1],
              lid: req.params.lid,
            });
            sendResource(err, list, res);
          });
        }
      }
    }
  });
});

router.delete('/:bid/list/:lid/card/:cid', checkPermission, function (req, res) {
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
              } else {
                emitToBoard(req.params.bid, 'deleteCard', {
                  lid: req.params.lid,
                  cid: req.params.cid
                });
              }
            });
          }
        }
      }
    }
  });
  res.send();
});

router.patch('/:bid/list/:lid/card/:cid', checkPermission, function (req, res) {
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
            if (req.body.labels == 0) {
              card[key] = [];
            }
            board.save(function (err, board) {
              if (err) {
                handleSaveError(err, res);
              }
              emitToBoard(req.params.bid, 'editCard', {
                lid: req.params.lid,
                cid: req.params.cid,
                cardData: req.body,
              });
              sendResource(err, list, res);
            });
          }
        }
      }
    }
  });
});

router.post('/:bid/list/:lid/card/:cid/comment', checkPermission, function (req, res) {
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
              var commentData = card.comments[card.comments.length - 1];
              emitToBoard(req.params.bid, 'newComment', {
                lid: req.params.lid,
                cid: req.params.cid,
                commentData: commentData,
              });
              sendResource(err, commentData, res);
            });
          }
        }
      }
    }
  });
});

module.exports = router;
