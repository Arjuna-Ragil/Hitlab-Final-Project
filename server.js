const express = require('express');
const app = express();
const path = require('path');

app.set('views', path.join(__dirname, 'views'));
app.set('view-engine', 'ejs');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/JobQues", (req, res) => {
  res.render('./landing page/landingPage.html.ejs');
})

app.get("/JobQues/sign-in", (req, res) => {
  res.render('./login/sign in page/signInPage.html.ejs');
})

app.get("/JobQues/sign-up", (req, res) => {
  res.render('./login/sign up page/signUpPage.html.ejs');
})

const port = 5000;
app.listen(port, () => {
console.log(`Aplikasi telah berjalan pada http://localhost:${port}/JobQues`);
})