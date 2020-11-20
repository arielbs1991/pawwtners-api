const router = require("express").Router();
const db = require("../models");
const bcrypt = require("bcrypt");

//TODO: Determine base route for this file

//TESTING ROUTE TODO: Remove or comment out upon deployment for security
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

router.get('/finduser/', (req, res) => {
    db.User.findOne({
        where: {
            id: req.body.id
            //odd chance may need to use userId, who knows
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

//TODO: Sessions, login, logout

//create new user on signup -- may get FB or IG data

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