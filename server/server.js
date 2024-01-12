const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const cors = require('cors');
const bodyParser = require('body-parser');
const morganBody = require('morgan-body');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 3001;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors({origin: 'http://127.0.0.1:3000',credentials:true}));
morganBody(app);

// set up database
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = 'mongodb+srv://edwardpraschifka:oZOVIOEhdtHg4ehN@bonsoir-cluster.2neujbs.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
});
const database = client.db("bonsoir-db");
const users = database.collection("users");

app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ client })
  }));
  
app.use(passport.authenticate('session'));

passport.serializeUser(function(user, cb) {
    console.log("Serializing...")
    process.nextTick(function() {
      cb(null, { id: user._id, username: user.username });
    });
  });
  
passport.deserializeUser(function(user, cb) {
    console.log("Deserializing...")
    process.nextTick(function() {
      return cb(null, user);
    });
  });

passport.use(new LocalStrategy(async function verify(username, password, cb) {
    console.log("Using strategy 'LocalStrategy'");

    // check that the username is in the database
    let info = {success: false, message: ''};
    try {
        const userMatch = await users.findOne({username: username});

        if (!userMatch)
        {
            console.log("Reached here");
            info.message = 'Username not found';
            return cb(null,null,info);
        }
    } 
    catch (error) {
        info.message = 'There was an issue querying the database';
        return cb(error,null,info)
    }

    // check that the username and password are in the database
    let user;

    try {
        user = await users.findOne({username: username, password: password});
    } 
    catch (error) {
        info.message = 'There was an issue querying the database';
        return cb(error,null,info)
    }

    if (!user)
    {
        info.message = 'Incorrect password';
        return cb(error,null,info);
    }

    console.log("Success!");
    info.success = true;
    info.message = 'Successfully signed in';
    return cb(null,user,info);

  }));

  app.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        req.login(user, () => {
            console.log("Succesfully logged in user!");
            const body = JSON.stringify(info);

            if (err) {
                info.message = 'Internal server error';
                return res.status(500).send(body);
            }
            if (!user) {
                return res.status(401).send(body);
            }
            if (user) {
                return res.status(200).send(body);
            }
        })
    })(req, res, next);
});
   
  app.get('/username', function(req,res) {
    console.log(`req.user = ${req.user}`);
    res.send(JSON.stringify({'username':req.user}));
})



app.listen(PORT,() => {
    console.log(`Server listening on port ${PORT}...`);
})