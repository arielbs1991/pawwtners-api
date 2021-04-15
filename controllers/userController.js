const router = require("express").Router();
const db = require("../models");
const bcrypt = require("bcrypt");
const getIGToken = require('../utils/facebookAPI/getIGToken.js');

const saltRounds = 12;

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

//create new user on signup -- TODO: may get FB or IG data

//tested +
router.post('/', (req, res, next) => {
    bcrypt.hash(req.body.password, saltRounds, (error, hash) => {

        db.User.create({
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            gender: req.body.gender,
            password: hash,
            city: req.body.city,
            State: req.body.State,
            postcode: req.body.postcode,
            phoneNumber: req.body.phoneNumber,
            bio: req.body.bio,
            tagline: req.body.tagline

        })
            .then(userData => {
                res.json(userData);
                res.status(201);
            })
            .catch(error => {
                console.log(error);
                next(error);
                res.status(500).end();
            })
    })
});
router.post('/fbCreate', (req, res, next) => {
    // bcrypt.hash(req.body.password, saltRounds, (error, hash) => {

        db.User.create({

            id: res.id,
            displayName: res.displayName,
            email: res.email,
            name: res.name,
            photos: res.photos

            // username: req.body.username,
            // firstName: req.body.firstName,
            // lastName: req.body.lastName,
            // email: req.body.email,
            // gender: req.body.gender,
            // password: hash,
            // city: req.body.city,
            // State: req.body.State,
            // postcode: req.body.postcode,
            // phoneNumber: req.body.phoneNumber,
            // bio: req.body.bio,
            // tagline: req.body.tagline

        })
            .then(userData => {
                res.json(userData);
                res.status(201);
            })
            .catch(error => {
                console.log(error);
                next(error);
                res.status(500).end();
            })
    // })
});

router.get('/readsessions', (req, res) => {

    if (!req.session.user) {
        res.status(403).end();
    } else {

        console.log("readsessions results back-end: ", req.session);
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

    // const user = req.session.user;

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
                // const { data: { access_token } } = await getIGToken()
                // user = {
                req.session.user = {
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    gender: user.gender,
                    email: user.email,
                    password: user.password,
                    city: user.city,
                    State: user.State,
                    postcode: user.postcode,
                    phoneNumber: user.phoneNumber,
                    UserId: user.id,
                    bio: user.bio,
                    tagline: user.tagline
                    // token: access_token
                }
                // console.log("login sessions data: ", req.session, "user:", user);
                console.log("login sessions data: ", req.session);
                // sessionStorage.setItem("user", JSON.stringify(user));
                console.log("user: ", user);
                res.json(user);
                // res.json(req.session);
            } else {
                res.status(401).send("Incorrect password")
            }
        }
    }).catch(err => {
        console.log(err);
        res.status(500).end()
    })
});

router.post('/fbLogin', (req, res) => {

    // const user = req.session.user;

    db.User.findOne({
        where: {
            email: res.email
        }
    }).then(async user => {
        if (!user) {
            res.status(404).send("No such user exists");
        } else {
            if (
                // bcrypt.compareSync
                    (res.email, user.email)) {
                // const { data: { access_token } } = await getIGToken()
                // user = {
                req.session.user = {
                    id: user.id,
                    displayName: user.displayName,
                    email: user.email,
                    name: user.name,
                    photos: user.photos,
                    // username: user.username,
                    // firstName: user.firstName,
                    // lastName: user.lastName,
                    // gender: user.gender,
                    // email: user.email,
                    // password: user.password,
                    // city: user.city,
                    // State: user.State,
                    // postcode: user.postcode,
                    // phoneNumber: user.phoneNumber,
                    // UserId: user.id,
                    // bio: user.bio,
                    // tagline: user.tagline
                    // token: access_token
                }
                // console.log("login sessions data: ", req.session, "user:", user);
                console.log("login sessions data: ", req.session);
                // sessionStorage.setItem("user", JSON.stringify(user));
                console.log("user: ", user);
                res.json(user);
                // res.json(req.session);
            } else {
                res.status(401).send("Incorrect user")
            }
        }
    }).catch(err => {
        console.log(err);
        res.status(500).end()
    })
});

//delete user tested+
router.delete('/', (req, res) => {
    if (!req.session.user) {
        res.status(403).end();
    } else {
        db.User.destroy({
            where: {
                // id: req.session.user.UserId
                id: req.body.id
            }
        })
            .then(userData => {
                res.json(userData)
            })
            .catch(err => {
                console.log(err);
                res.status(500).end();
            })
    }
});

//tested, getting 500 error, but it's working when you pull the user data up...
router.put('/updateAll/', (req, res) => {
    if (!req.session.user) {
        res.status(403).end();
    } else {
        db.User.update({
            // username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            gender: req.body.gender,
            email: req.body.email,
            password: req.body.password,
            city: req.body.city,
            State: req.body.State,
            postcode: req.body.postcode,
            phoneNumber: req.body.phoneNumber,
            bio: req.body.bio,
            tagline: req.body.tagline
        },
            {
                where: {
                    // id: req.params.id
                    id: req.session.user.UserId
                }
            })
            .then(dbUser => {
                req.session.user.firstName = req.body.firstName
                req.session.user.lastName = req.body.lastName
                req.session.user.gender = req.body.gender
                req.session.user.email = req.body.email
                req.session.user.password = req.body.password
                //TODO: update location data to use geolocation
                req.session.user.city = req.body.city
                req.session.user.State = req.body.State
                req.session.user.postcode = req.body.postcode
                req.session.user.phoneNumber = req.body.phoneNumber
                req.session.user.bio = req.body.bio
                req.session.user.tagline = req.body.tagline
                res.json(dbUser)
            })
            .catch(err => {
                console.log(err);
                res.status(500).end();
            })
    }

    //TODO: update user bio only
    //TODO: update user password with password confirmation through email
})

module.exports = router;