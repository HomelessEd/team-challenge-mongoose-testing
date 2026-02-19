const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
 title: {
    type: String,
    required: [true, 'You need a title'],
    trim: true 
 },
 body: {
    type: String,
    required: true,
    trim: true 
 }
}, { timestamps: true});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;