// app/models/user.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var IntreTag = require('./intreTag.js');

var IntreSpotSchema   = new Schema({
            owner       : [{type: mongoose.Schema.Types.ObjectId, ref: 'IntreTag'}],
            create_date		: Date,
            spot_num	: Number,
            title: String,
            text_cotent: String,
            address: String,
            start_time: Date,
            end_time: Date,
            picture: String,
            video: String,
            loc: {type: [Number], index: '2d'},
});

module.exports = mongoose.model('IntreSpot', IntreSpotSchema);