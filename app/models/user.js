// app/models/user.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
            name        : String,
            email		: String,
            username    :String,
            password: String,
            token: String,
            picture: String,
});

module.exports = mongoose.model('User', UserSchema);