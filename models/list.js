var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schema = new Schema({
    name: String,
    cards: Array,
}, { versionKey: false });

module.exports = mongoose.model('List', schema);