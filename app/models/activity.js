// app/models/user.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ActivitySchema   = new Schema({
            creator: {
            	type: mongoose.Schema.Types.ObjectId, 
            	ref: 'User'
            },
            create_date		: { type: Date, default: Date.now },
            start_date		: { type: Date, default: Date.now },
            end_date    : { type: Date, default: Date.now },
            curr_num	: { type: Number, default: 0 },
            max_num	: { type: Number, default: 10 },
            title: { type: String, default: "" },
            description: { type: String, default: "" },
            address: { type: String, default: "" },
            contact: {type: String, default: ""},
            picture: { type: String, default: "" },
            fee: { type: Number, default: 0 },
            joiner: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
            video: { type: String, default: "" },
});

module.exports = mongoose.model('Activity', ActivitySchema);