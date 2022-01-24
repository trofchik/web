
const express = require("express");
const { Mongoose } = require("mongoose");
const router = express.Router();
const Post = require("../models/post");
const User = require("../models/user");
const { checkAuthenticated, checkPostOwnership } = require("../passport-config");

// Go to section "Posts"
router.get('/posts', checkAuthenticated, async (req, res) => {
  const posts = await Post.find({})
  
  const users = []
  for (let i = 0; i < posts.length; i++) {
    const user = await User.findById(posts[i].user)
    users.push(user)
  }

  res.render('posts.ejs', {posts, users} )
})

// On GET request to /newPost render page for post creation
router.get('/newPost', checkAuthenticated, (req, res) => {
  res.render('newPost.ejs', { name: req.user.name })
})

// Create a new post
router.post('/newPost', checkAuthenticated, async (req, res) => {
  try {
    const post = new Post({
      user: req.user.id,  
      title: req.body.title,
      info: req.body.info,
    })
    await post.save();
    res.redirect("/posts"); // redirects to /posts after a post creation...
  } catch (e) {
    res.redirect("/posts"); // and in case of error as well
  }
})

// Seemlessly delete post by id. User stays at the same page.
router.get('/delete/post/:_id', checkAuthenticated, checkPostOwnership, async (req, res) => {
  const {_id} = req.params; 
  Post.deleteOne({_id}) // turns out to be mongo document deletion since Post actually exports mongo model
  .then (() => {
    console.log('deleted');
    res.redirect("/posts") // redirects back to /posts after post deletion
  })
  .catch(err => console.log(err))
})

module.exports = router;