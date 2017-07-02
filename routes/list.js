var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();

var List = require('../models/list');
var Card = require('../models/card');

router.get('/', function (req, res) {
    List.find({}, function (err, lists) {
        res.json(lists);
    });
});

router.post('/', function (req, res) {
    var newList = new List({
        name: req.body.name
    });
    newList.save(function (err, list) {
        if (err) {
            console.log(err);
        } else {
            res.json(list);
        }
    });
});

router.delete('/:lid', function (req, res) {
    List.findByIdAndRemove(mongoose.Types.ObjectId(req.params.lid), function (err) {
        if (err) {
            console.log('Error deleting list with id: ' + req.params.lid);
        }
    });
    res.send();
});

router.patch('/:lid', function (req, res) {
    List.findByIdAndUpdate(mongoose.Types.ObjectId(req.params.lid), { $set: { name: req.body.name } }, function (err) {
        if (err) {
            console.log('Error patching list with id: ' + req.params.lid);
        } else {
            List.find({}, function (err, lists) {
                res.json(lists);
            });
        }
    });
});

router.post('/:lid/card', function (req, res) {
    List.findById(mongoose.Types.ObjectId(req.params.lid), function (err, list) {
        if (err) {
            console.log('Error finding list with id: ' + req.params.lid);
        } else {
            var newCard = new Card(
                {
                    name: req.body.name,
                    desc: req.body.desc,
                    author: req.session.user.username
                }
            );
            console.log(newCard);
            list.cards.push(newCard);
            list.save(function (err) {
                if (err) {
                    console.log('Error adding card to list with id: ' + req.params.lid);
                }
            });
            res.send(list);
        }
    });
});

router.delete('/:lid/card/:cid', function (req, res) {
    List.findById(mongoose.Types.ObjectId(req.params.lid), function (err, list) {
        if (err) {
            console.log('Error finding list with id: ' + req.params.lid);
        } else {
            var indexToDelete = -1;
            for (var i = 0; i < list.cards.length; ++i) {
                if (list.cards[i]._id == req.params.cid) {
                    indexToDelete = i;
                    break;
                }
            }
            if (indexToDelete !== -1) {
                console.log(indexToDelete);
                list.cards.splice(indexToDelete, 1);
                list.save(function (err) {
                    if (err) {
                        console.log(`Error deleting card with id ${req.params.lid} from list with id ${req.params.cid}`);
                    }
                });
            }
        }
    });
    res.send();
});

router.patch('/:lid/card/:cid', function (req, res) {
    List.findById(mongoose.Types.ObjectId(req.params.lid), function (err, list) {
        if (err) {
            console.log('Error finding list with id: ' + req.params.lid);
        } else {
            var indexToUpdate = -1;
            for (var i = 0; i < list.cards.length; ++i) {
                if (list.cards[i]._id == req.params.cid) {
                    indexToUpdate = i;
                    break;
                }
            }
            if (indexToUpdate !== -1) {
                var card = req.body;
                card._id = mongoose.Types.ObjectId(req.body._id);
                list.cards.set(indexToUpdate, card);
                list.save(function (err) {
                    if (err) {
                        console.log(`Error patching card with id ${req.params.lid} from list with id ${req.params.cid}`);
                    }
                });
                res.send(list);
            }
        }
    });
});

router.post('/:lid/card/:cid/comment', function (req, res) {
    List.findById(mongoose.Types.ObjectId(req.params.lid), function (err, list) {
        if (err) {
            console.log('Error finding list with id: ' + req.params.lid);
        } else {
            var indexToUpdate = -1;
            for (var i = 0; i < list.cards.length; ++i) {
                if (list.cards[i]._id == req.params.cid) {
                    indexToUpdate = i;
                    break;
                }
            }
            if (indexToUpdate !== -1) {
                var card = list.cards[indexToUpdate];
                var commentData = {
                    content: req.body.content,
                    username: req.session.user.username,
                    datetimePosted: new Date().toLocaleString(),
                }
                if (!card.comments) {
                    card.comments = [];
                }
                card.comments.push(commentData);
                list.cards.set(indexToUpdate, card);
                list.save(function (err) {
                    if (err) {
                        console.log(`Error commenting card with id ${req.params.lid} from list with id ${req.params.cid}`);
                    } else {
                        res.send(commentData);
                    }
                });
            }
        }
    });
});


module.exports = router;
