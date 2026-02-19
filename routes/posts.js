const express= require('express');
const Post = require('../models/Post');

const router = express.Router();

router.post('/create', async (req,res) => {
    try{
     const {title, body} =req.body
     const newPost = await Post.create({title, body});
     res.status(201).json(newPost);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

router.get('/', async (req, res) => {
    try{
     const posts = await Post.find();
     res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

router.get('/id/:_id', async (req, res) => {
    try{
        const posts = await Post.findById(req.params._id);
        if (!posts) {
            return res.status(404).json({error: 'Post not found'});
        } res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

router.get('/title/:title', async (req,res) => {
    try{
        const input = req.params.title.replace(/\s+/g, '').toLowerCase();
        const regex = new RegExp(input.split(' ').join('\\s*'), 'i');
        const posts = await Post.findOne({ $expr: {
                $eq: [
                    { $replaceAll: { input: { $toLower: "$title" }, find: " ", replacement: "" } },
                    input ]
            }
        });
        if (!posts) {
            return res.status(404).json({error: 'Post not found'});
        } res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

router.put('/id/:_id', async (req, res) =>{
    try {
        const {title, body} =req.body;
        if(!title || !body){
            return res.status(400).json({error: 'The update needs a body and title'});
        }
        const updatedPost = await Post.findByIdAndUpdate(req.params._id,
            {title,body}, {new: true, runValidators: true}
        );
        if(!updatedPost){
            return res.status(404).json({error: 'Post not found'});
        }
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/id/:_id', async (req, res) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params._id);

        if (!deletedPost) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.status(200).json({ message: 'Post deleted successfully', deletedPost });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/postsWithPagination', async (req,res) => {
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page -1) * limit;

        const posts = await Post.find()
        .skip(skip)
        .limit(limit)
        .sort({createdAt: -1});
      const totalPosts = await Post.countDocuments();
      const totalPages = Math.ceil(totalPosts/limit);
      
      res.status(200).json({
        page,
        totalPages,
        totalPosts,
        posts
      });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

module.exports = router;