var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
    email: String,
    password: String,
    username: String,
}, { versionKey: false });

module.exports = mongoose.model('User', userSchema);