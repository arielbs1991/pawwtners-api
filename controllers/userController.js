const router = require("express").Router();
const db = require("../models");
const bcrypt = require("bcrypt");

//BASE ROUTE FOR THIS FILE: /api/user

//TESTING ROUTE TODO: Remove or comment out upon deployment for security
//tested + 
router.get('/userlist/', (req, res) => {
    // if (!req.session.user) {
    //     res.status(403).end();
    // } else {
    db.User.findAll({})
        .then(userList => {
            res.json(userList);
        })
        .catch(err => {
            console.log(err);
            res.status(500).end();
        })
    // }
});

//tested +
router.get('/finduser/:id', (req, res) => {
    db.User.findOne({
        where: {
            id: req.params.id
        }
    })
        .then(dbUser => {
            res.json(dbUser)
        })
        .catch(err => {
            console.log(err);
            res.status(500).end();
        })
});

//Return user and pet data by user id tested+
router.get('/userpets/', (req, res) => {
    db.User.findOne({
        where: {
            id: req.body.id
        },
        include: {
            model: db.Pet
        }
    })
    .then(dbUser => {
        console.log("User Pets: ", dbUser);
        res.json(dbUser);
    })
    .catch(err => {
        console.log(err);
        res.status(500).end();
    })
})

//TODO: Sessions, login, logout, update, delete

//create new user on signup -- TODO: may get FB or IG data

//tested +
router.post('/', (req, res) => {
    db.User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        gender: req.body.gender,
        password: req.body.password,
        city: req.body.city,
        state: req.body.state,
        postcode: req.body.postcode,
        phoneNumber: req.body.phoneNumber
    })
    .then(userData => {
        res.json(userData)
    })
    .catch(err => {
        console.log(err);
        res.status(500).end();
    })
});

module.exports = router;