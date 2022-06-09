const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({

    title : { type: String, required: true},
    content : { type: String, required: true},
    viewCount: {
        type: Number,
        default: 0,
     },
    like : {
        type: Number,
        default: 0,
    },
    time : { type : Date, default: Date.now }
});

module.exports = mongoose.model('Article', articleSchema);