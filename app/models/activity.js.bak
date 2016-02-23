// app/models/user.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ActivitySchema   = new Schema({
            owner        : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
            create_date		: { type: Date, default: Date.now },
            end_date    : Date,
            curr_num	: { type: Number, default: 0 },
            max_num	: { type: Number, default: 10 },
            title: String,
            text_cotent: String,
            topic: String,
            pictures: String,
            joiner: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
            video: String,
});

module.exports = mongoose.model('Activity', ActivitySchema);