//server.js

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
const methodOverride = require('method-override')

//penyimpanan user
const users = [];

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
app.use(methodOverride('_method'))

//render frontend
app.get("/JobQues", (req, res) => {
  res.render('./landing page/landingPage.html.ejs');
})

app.get("/JobQues/sign-in", checkNotAuthenticated,(req, res) => {
  res.render('./login/sign in page/signInPage.html.ejs');
})

app.get("/JobQues/sign-up", checkNotAuthenticated,(req, res) => {
  res.render('./login/sign up page/signUpPage.html.ejs');
})

app.get("/JobQues/Home-Page", checkAuthenticated, (req, res) => {
  res.render('./home page/homePage.html.ejs', {name: req.user.name });
})

app.get("/JobQues/Apply/:id", checkAuthenticated,(req, res) => {
  res.render('./form lamaran/formLamaran.html.ejs');
})

//sign in
app.post("/JobQues/sign-in", passport.authenticate('local', {
  successRedirect: '/JobQues/Home-Page',
  failureRedirect: '/JobQues/sign-in',
  failureFlash: true
}))

//sign up
app.post("/JobQues/sign-up", checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    })
    //console.log(users) Nyalakan untuk melihat data users
    res.redirect('/JobQues/sign-in')
  }
  catch {
    res.redirect('/JobQues/sign-up')
  }
})

//authenticate
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/JobQues/sign-up')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/JobQues/Home-Page')
  }
  next()
}

//log out
app.delete('/logout', (req, res) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/JobQues');
  });
});

// Data pekerjaan (simpan di memori sementara)
let jobList = [
  { id: 1, title: 'Google', 
    description: 'Frontend developer, Full time', 
    salary: '4000000'},
  { id: 2, title: 'Meta', 
    description: 'Backend developer', 
    salary: '5000000'},
  { id: 3, title: 'Mandiri', 
    description: 'Android developer', 
    salary: '7000000'},
  { id: 4, title: 'BCA', 
    description: 'Apple developer', 
    salary: '8000000'},
  { id: 5, title: 'Kominfo', 
    description: 'Cyber security', 
    salary: '10000000'},
  { id: 6, title: 'Meta', 
    description: 'Frontend developer', 
    salary: '4000000'},
  { id: 7, title: 'Meta', 
    description: 'Satpam', 
    salary: '5000000'},
  { id: 8, title: 'Mandiri', 
    description: 'Office Boy', 
    salary: '7000000'},
  { id: 9, title: 'Google', 
    description: 'Project Manager', 
    salary: '8000000'},
  { id: 10, title: 'Kominfo', 
    description: 'White hat Hacker', 
    salary: '10000000'}
];

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
    //console.log(jobList); Nyalakan untuk melihat data pekerjaan
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

//job form container
let jobApply = [];

//job form
app.post('/JobQues/Apply/:id', (req, res) => {
  res.send('apply have been sent')
})

//code biar nyala
app.use(session({ secret: 'secret' }));

//port
const port = 5000;
app.listen(port, () => {
console.log(`Aplikasi telah berjalan pada http://localhost:${port}/JobQues`);
})
