// app/models/user.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ActivityComeSchema   = new Schema({
            owner        : {type: mongoose.Schema.Types.ObjectId, ref: 'Activity'},
            create_date		: { type: Date, default: Date.now },
            text_cotent: String,
            resurl: String,
            restype: String,
            talker: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
});

module.exports = mongoose.model('ActivityCome', ActivityCome);