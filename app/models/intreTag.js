// app/models/user.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var IntreTagSchema   = new Schema({
            create_date		: Date,
            spot_num	: Number,
            title: String,
            text_cotent: String,
            topic: String,
            picture: String,
            video: String,
});

module.exports = mongoose.model('IntreTag', IntreTagSchema);