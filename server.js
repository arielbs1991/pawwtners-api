const express = require("express");
const app = express();
const db = require("./models");
const session = require('express-session')
var PORT = process.env.PORT || 3001;
const morgan = require("morgan"); //added for mail
const nodemailer = require("nodemailer"); //added for mail
const cors = require("cors"); //added for cors
require('dotenv').config(); //added for mail
const passport = require('passport');
const Strategy = require('passport-facebook').Strategy;

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

passport.use(new Strategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: '/facebook/callback',
  profileFields: ['id', 'displayName', 'email', 'name', 'photos'],
  passReqToCallback: true,
},
function(req, accessToken, refreshToken, profile, cb) {
  // save the profile on the Database
  // save the accessToken and refreshToken if you need to call facebook apis later on
  return cb(null, profile);
}));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

app.get('/facebook', passport.authenticate('facebook'));
app.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: `${process.env.FRONTEND_HOST}/error`}), (req, res) => {
  res.send(`${process.env.FRONTEND_HOST}/success`);
});

const userController = require("./controllers/userController.js");
app.use("/api/user", userController);
const matchController = require("./controllers/matchController.js");
app.use("/api/match", matchController);
const petController = require("./controllers/petController.js");
const { use } = require("./controllers/userController.js");
app.use("/api/pets", petController);


//TODO: once our db is where we want it, change to force:false
db.sequelize.sync({ force: false }).then(function () {
  app.listen(PORT, function () {
    console.log("listen to me, heroku. Changes have been made, I swear");
    console.log("App listening on PORT " + PORT);
    //testing sms
    // sendSMS;
  });
});