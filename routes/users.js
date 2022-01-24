// подключаем внешние библиотеки
const express = require("express");
const router = express.Router();
const passport = require("passport"); // для авторизации
const { checkNotAuthenticated, checkAuthenticated } = require("../passport-config");
const bcrypt = require("bcrypt"); // шифрование пароля

// Подключаем модель данных пользователя для базы данных
const User = require("../models/user");

// Renders page for authorisation
router.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login.ejs");
});

// Does authorisation
router.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

// Renders page for registration
router.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register.ejs");
});

// Does registration
router.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    await user.save();
    res.redirect("/login"); // redirects to /login on successful registration
  } catch (e) {
    res.redirect("/register"); // redirects to /register on error
  }
});

// Деавторизация
router.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/login");
});

// Изменения профиля
router.post("/editProfile", checkAuthenticated, async (req, res) => {
  try {
    await User.updateOne(
      {
        _id: req.user.id
      },
      req.body
    );
    res.redirect("/profile");
  } catch (e) {
    console.error(ejs)
  }
});

module.exports = router;
