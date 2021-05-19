require('dotenv').config(); //added for mail

const express = require("express");
const app = express();
const db = require("./models");
const session = require('express-session')
const morgan = require("morgan"); //added for mail
const nodemailer = require("nodemailer"); //added for mail
const cors = require("cors"); //added for cors
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const InstagramStrategy = require('passport-instagram').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

var PORT = process.env.PORT || 3001;
// const sendSMS = require('./utils/twilioAPI/sendSMS');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Comment out on deployed
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 2 * 60 * 60 * 1000,
  }
}))

app.use(morgan('dev')) //added for mail

// TODO:change to front-end deployed link when front end is deployed
app.use(cors({
  origin: ["http://localhost:3000"],
  credentials: true
}))

// TODO: modify front end link when deployed
// app.use(cors({
//   origin: ["https://pawwtners.com"],
//   credentials: true
// }))

// USE ON DEPLOYED
// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false,
//   proxy: true,
//   cookie: {
//     maxAge: 2 * 60 * 60 * 1000,
//     sameSite: "none",
//     secure: true
//   }
// }))

app.get("/", (req, res) => {
  res.send("nothing to see here");
})

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: '/facebook/callback',
  profileFields: ['id', 'displayName', 'email', 'name', 'photos'],
  passReqToCallback: true,
},
  function (req, accessToken, refreshToken, profile, cb) {
    // save the profile on the Database
    // save the accessToken and refreshToken if you need to call facebook apis later on
    return cb(null, profile);
  }));

passport.use(new InstagramStrategy({
  clientID: process.env.INSTAGRAM_APP_ID,
  clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
  callbackURL: "https://localhost:3001/instagram/callback",
  passReqToCallback: true,
  skipUserProfile: true
},
  function (req, accessToken, refreshToken, params, _profile, cb) {
    console.log(params)
    if (typeof params === 'undefined' || params === null || params === {}) {
      return cb(new Error('invalid data from instagram'))
    }
    const profile = params;
    return cb(null, profile);
  }
));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_APP_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/google/callback",
  passReqToCallback: true,
},
  function (req, accessToken, refreshToken, profile, cb) {
    return cb(null, profile);
  }
));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

app.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
app.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: `${process.env.FRONTEND_HOST}/error` }), function (req, res) {
  res.redirect(`${process.env.FRONTEND_HOST}/facebook/success`);
});

app.get('/instagram', passport.authenticate('instagram', { scope: ['user_profile', 'user_media'] }));
app.get('/instagram/callback', passport.authenticate('instagram', { failureRedirect: `${process.env.FRONTEND_HOST}/error` }), function (req, res) {
  res.redirect(`${process.env.FRONTEND_HOST}/instagram/success`);
});

app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/google/callback', passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_HOST}/error` }), function (req, res) {
  res.redirect(`${process.env.FRONTEND_HOST}/google/success`);
});

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function (req, res) {
    res.status(200).send({ user: req.user });
  });


const userController = require("./controllers/userController.js");
app.use("/api/user", userController);
const matchController = require("./controllers/matchController.js");
app.use("/api/match", matchController);
const petController = require("./controllers/petController.js");
app.use("/api/pets", petController);
// const { use } = require("./controllers/userController.js");

//TODO: once our db is where we want it, change to force:false
db.sequelize.sync({ force: false }).then(function () {
  app.listen(PORT, function () {
    console.log("listen to me, heroku. Changes have been made, I swear");
    console.log("App listening on PORT " + PORT);
    //testing sms
    // sendSMS;
  });
});
