// dependencies
const express = require('express');
const session = require('express-session');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt');
const flash = require('connect-flash');
const app = express();
const PORT = 3001;
const saltRounds = 10;

app.use(cors());
app.use(express.json());

// database stuff
const uri = "mongodb+srv://epraschifka:ec94wEXSUDeHPENR@cluster0.g5jtbq3.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
const database = client.db('bonsoir');
const users = database.collection('users');
const statements = database.collection('statements');

// set up sessions
app.use(express.urlencoded({extended: true}));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// set up passport strategy
passport.use(new LocalStrategy(
  function(username,password,done) {
    const user = users.findOne({'username': username});

    if (!user)
    {
      return done(null,false);
    }

    bcrypt.compare(password,user.password,(err,result) => {
      if (!user)
      {
        return done(null,false);
      }

      return done(null,user);
    })
  }
))

// serialization stuff (yikes!)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = users.find(u => u.id === id);
  done(null, user);
});

app.post('/register', async (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  const existingUser = await users.findOne({'username': username});

  if (existingUser)
  {
    console.log("exists")
    res.status(400).set('Content-Type','application/json').send({success: false, message: 'User already exists'});
  }
  else
  {
    console.log("does not exist");
    bcrypt.hash(password, saltRounds, (err,hash) => {
      users.insertOne({'username': username, 'password': hash});
      console.log(`Sending back a response...`)
      res.status(200).set('Content-Type','json/application').send({
        success: true,
        message: 'Successfully logged in'
      })
    })
  }

})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/register',
  failureFlash: true
}))

app.get('/dashboard', (req,res) => {
  if (req.isAuthenticated())
  {
    res.send(`Welcome, ${req.user.username}!`);
  }
  else
  {
    res.redirect('/login');
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
})


