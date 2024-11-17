//Requiring stuff//
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');

const initializedPassport = require('./passport-config');
initializedPassport(passport, 
  email => account.find(user => user.email === email),
  id => account.find(user => user.id === id)
)

//penyimpanan user
const account = [];

//setting stuff
app.set('views', path.join(__dirname, 'views'));
app.set('view-engine', 'ejs');

app.use(express.urlencoded({extended: false}))
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

//render frontend
app.get("/JobQues", (req, res) => {
  res.render('./landing page/landingPage.html.ejs');
})

app.get("/JobQues/sign-in", (req, res) => {
  res.render('./login/sign in page/signInPage.html.ejs');
})

app.get("/JobQues/sign-up", (req, res) => {
  res.render('./login/sign up page/signUpPage.html.ejs');
})

app.get("/JobQues/Home-Page", (req, res) => {
  res.render('./home page/homePage.html.ejs');
})

//sign in
app.post("/JobQues/sign-in", passport.authenticate('local', {
  successRedirect: '/JobQues/Home-Page',
  failureRedirect: '/JobQues/sign-in',
  failureFlash: true
}))

//sign up
app.post("/JobQues/sign-up", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.psw, 10)
    account.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    })
    res.redirect('/JobQues/sign-in')
  }
  catch {
    res.redirect('/JobQues/sign-up')
  }
})

//port
const port = 5000;
app.listen(port, () => {
console.log(`Aplikasi telah berjalan pada http://localhost:${port}/JobQues`);
})