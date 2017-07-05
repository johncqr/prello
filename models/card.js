var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schema = new Schema({
    name: String,
    desc: String,
    labels: [],
    author: String,
    comments: Array,
}, { versionKey: false});

module.exports = mongoose.model('Card', schema);