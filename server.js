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

//penyimpanan user
const users = [];

// Array untuk menyimpan daftar pekerjaan
const jobPostings = [];

//setting stuff
const initializePassport = require('./passport-config');
initializePassport(passport, 
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

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
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    })
    console.log(users)
    res.redirect('/JobQues/sign-in')
  }
  catch {
    res.redirect('/JobQues/sign-up')
  }
})

// Data pekerjaan (simpan di memori sementara)
let jobList = [];

// Endpoint untuk mendapatkan semua pekerjaan
app.get('/api/jobs', (req, res) => {
    res.json(jobList);
});

// Endpoint untuk menambahkan pekerjaan baru
app.post('/api/jobs', (req, res) => {
    const { title, description, salary } = req.body;
    if (!title || !description || !salary) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const newJob = {
        id: jobList.length + 1,
        title,
        description,
        salary,
    };

    jobList.push(newJob);
    res.status(201).json(newJob);
});

// Endpoint untuk menghapus pekerjaan berdasarkan ID
app.delete('/api/jobs/:id', (req, res) => {
    const { id } = req.params;
    const jobIndex = jobList.findIndex(job => job.id === parseInt(id));

    if (jobIndex === -1) {
        return res.status(404).json({ error: 'Job not found' });
    }

    jobList.splice(jobIndex, 1);
    res.status(204).send();
});

app.use(session({ secret: 'secret' }));
//port
const port = 5000;
app.listen(port, () => {
console.log(`Aplikasi telah berjalan pada http://localhost:${port}/JobQues`);
})