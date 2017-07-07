var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schema = new Schema({
    creator: String,
    lists: Array,
    members: Array,
    name: String,
}, { versionKey: false});

module.exports = mongoose.model('Board', schema);