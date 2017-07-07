var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    content: String,
    username: String,
    datetimePosted: Date
}, { versionKey: false });

var cardSchema = new Schema({
    author: String,
    comments: [commentSchema],
    desc: String,
    labels: Array,
    name: String,
}, { versionKey: false});

var listSchema = new Schema({
    cards: [cardSchema],
    name: String,
}, { versionKey: false });

var boardSchema = new Schema({
    creator: String,
    lists: [listSchema],
    members: Array,
    name: String,
}, { versionKey: false});

module.exports = mongoose.model('Board', boardSchema);