const router = require("express").Router();
const db = require("../models");
const bcrypt = require("bcrypt");
const getIGToken = require('../utils/facebookAPI/getIGToken.js');

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

router.get('/readsessions', (req, res) => {
    if (!req.session.user) {
        res.status(403).end();
    } else {
        res.json(req.session.user)
    }
})

router.get("/logout", (req, res) => {
    // if (!req.session.user) {
    //     res.status(403).end();
    // } else {
        req.session.destroy();
        res.send("logout complete!")
    // }
})

router.post('/login', (req, res) => {
    db.User.findOne({
        where: {
            email: req.body.email
        }
    }).then(async user => {
        if (!user) {
            res.status(404).send("No such user exists");
        } else {
            if (
                bcrypt.compareSync
                    (req.body.password, user.password)) {
                const { data: { access_token } } = await getIGToken()
                req.session.user = {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    gender: user.gender,
                    email: user.email,
                    UserId: user.id,
                    city: user.city,
                    state: user.state,
                    postcode: user.postcode,
                    phoneNumber: user.phoneNumber,
                    token: access_token
                }
                res.json(req.session);
            } else {
                res.status(401).send("Incorrect password")
            }
        }
    }).catch(err => {
        console.log(err);
        res.status(500).end()
    })
})

module.exports = router;