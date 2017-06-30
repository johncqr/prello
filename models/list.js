var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schema = new Schema({
    name: String,
    cards: Array,
});

module.exports = mongoose.model('List', schema);