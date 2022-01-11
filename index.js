if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
// setting
const express = require('express')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const mongoose = require('mongoose')

// models
const User = require('./models/user')

// my
const { checkNotAuthenticated, checkAuthenticated } = require ('./passport-config')

const app = express()

// connect to db
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection

const { initialize: initializePassport } = require('./passport-config')
initializePassport(
  passport,
  async function (email) {
    const user = await User.findOne({ email })
    return user
  },
  async function (id) {
    const user = await User.findOne({ _id: id })
    return user
  }
)

// routes
const usersRouter = require('./routes/users')
const postsRouter = require('./routes/posts')

app.set('view-engine', 'ejs') // use ejs
app.use(express.static(__dirname + '/public')); //use path for folders

app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

// use routes
app.use('/', usersRouter)
app.use('/', postsRouter)

// pages
app.get('/', checkAuthenticated, (req, res) => {
  res.render('index.ejs', {
    name: req.user.name,
  })
})

app.get('/about', checkAuthenticated, (req, res) => {
  res.render('about.ejs')
})

app.get('/profile', checkAuthenticated, (req, res) => {
  res.render('profile.ejs', {
    name: req.user.name,
    lastName: req.user.lastName,
    secondName: req.user.secondName,
    email: req.user.email,
    phone: req.user.phone,
  })
})

app.get('/editProfile', checkAuthenticated, (req, res) => {
  res.render('editProfile.ejs', {
    name: req.user.name,
    lastName: req.user.lastName,
    secondName: req.user.secondName,
    email: req.user.email,
    phone: req.user.phone,
  })
})

app.get("*", function (req, res) {
  res.render("404.ejs");
});

const port = process.env.PORT || 4000

app.listen(port, () => console.log(`server started on http://localhost:${port}`))