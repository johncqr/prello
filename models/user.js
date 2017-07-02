var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schema = new Schema({
    username: String,
    email: String,
    password: String
}, { versionKey: false });

module.exports = mongoose.model('User', schema);