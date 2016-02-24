// app/models/user.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
            name        : { type: String, default: "" },
            email		: { type: String, default: "" },
            username    :{ type: String, default: "" },
            password: { type: String, default: "" },
            token: { type: String, default: "" },
            picture: { type: String, default: "default/avatarimg.jpeg" },
});

module.exports = mongoose.model('User', UserSchema);