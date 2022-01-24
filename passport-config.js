
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const Post = require("./models/post");

function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    const user = await getUserByEmail(email)
    if (user == null) {
      return done(null, false, { message: 'No user with that email' })
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (e) {
      return done(e)
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser(async (id, done) => {
    const user = await getUserById(id)
    return done(null, user)
  })
}

module.exports.checkPostOwnership =  async function (req, res, next) {
  const post = await Post.findById(req.params._id)
  if (post.user === req.user.id) { // is comparison done correctly here?
    next()
  }
  else {
    console.log('forbidden')
    res.redirect('/posts')
  }
}

module.exports.checkAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

module.exports.checkNotAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

module.exports.initialize = initialize