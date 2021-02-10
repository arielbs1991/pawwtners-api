const express = require("express");
const app = express();
const db = require("./models");
const session = require('express-session')
var PORT = process.env.PORT || 3001;
const morgan = require("morgan"); //added for mail
const nodemailer = require("nodemailer"); //added for mail
const cors = require("cors"); //added for cors
require('dotenv').config(); //added for mail
// const sendSMS = require('./utils/twilioAPI/sendSMS');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Comment out on deployed
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
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
//   origin: ["https://pawsitivity-atack.herokuapp.com"],
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

// TODO: change to our controller routes
const userController = require("./controllers/userController.js");
app.use("/api/user", userController);
const matchController = require("./controllers/matchController.js");
app.use("/api/match", matchController);
const petController = require("./controllers/petController.js");
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