var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var forgotKeySchema = new Schema({
    hashCode: String,
    userId: String,
    used: Boolean
}, { versionKey: false });

module.exports = mongoose.model('ForgotKey', forgotKeySchema);