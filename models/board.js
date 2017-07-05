var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schema = new Schema({
    name: String,
    creator: String,
    members: Array,
    lists: [] 
}, { versionKey: false});

module.exports = mongoose.model('Board', schema);