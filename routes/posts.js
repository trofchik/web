const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const { checkAuthenticated } = require("../passport-config");

router.get('/posts', checkAuthenticated, async (req, res) => {
  const posts = await Post.find({})
  res.render('posts.ejs', {
    posts,
  })
})

router.get('/newPost', checkAuthenticated, (req, res) => {
  res.render('newPost.ejs', { name: req.user.name })
})

router.post('/newPost', checkAuthenticated, async (req, res) => {
  try {
    const post = new Post({
      user: req.user.id,
      title: req.body.title,
      info: req.body.info,
    })
    await post.save();
    res.redirect("/posts");
  } catch (e) {
    res.redirect("/posts");
  }
})

router.get('/delete/post/:_id', checkAuthenticated, (req, res) => {
  const {_id} = req.params; 
  Post.deleteOne({_id})
  .then (() => {
    console.log('deleted');
    res.redirect("/posts")
  })
  .catch(err => console.log(err))
})


module.exports = router;