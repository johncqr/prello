var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schema = new Schema({
    name: String,
    desc: String,
    labels: Array,
});

module.exports = mongoose.model('Card', schema);