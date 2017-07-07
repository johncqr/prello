var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schema = new Schema({
    author: String,
    comments: Array,
    desc: String,
    labels: Array,
    name: String,
}, { versionKey: false});

module.exports = mongoose.model('Card', schema);