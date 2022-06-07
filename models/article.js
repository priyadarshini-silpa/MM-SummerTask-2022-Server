const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
    //_id : mongoose.Schema.Types.ObjectId,
    title : String,
    content : String
});

module.exports = mongoose.model('Article', articleSchema);