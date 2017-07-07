var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schema = new Schema({
    cards: Array,
    name: String,
}, { versionKey: false });

module.exports = mongoose.model('List', schema);