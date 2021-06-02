const router = require("express").Router();
const db = require("../models");
const sequelize = require('../models')
const Op = sequelize.Sequelize.Op;
const bcrypt = require("bcrypt");
const getIGToken = require('../../utils/facebookAPI/getIGToken.js');
const helpers = require('../helpers/helpers');
const authorize = require("../middlewares/authorize");

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
router.get('/finduser/:id', authorize(), (req, res) => {
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

// To get user data after signup or login through facebook or google 
router.get('/userByEmail/:email', authorize(), (req, res) => {
    db.User.findOne({
        where: {
            email: req.params.email
            //UserId: req.session.user.UserId
        }
    })
        .then(dbUser => {
            console.log(`Match data for user: `, dbUser);
            res.json(dbUser);
        })
        .catch(err => {
            console.log(err);
            res.status(500).end();
        })
});

//Return user and pet data by user id tested+
router.get('/userpets/', authorize(), (req, res) => {
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
            tagline: req.body.tagline,
            provider: 'manual',
            is_manual: true,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            maximumDistance: req.body.maximumDistance
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

//tested +
router.put('/enableManualLogin', authorize(), (req, res) => {

    db.User.update({
        is_manual: true,
        password: bcrypt.hashSync(req.body.password, 10)
    },
        {
            where: {
                email: req.body.email
            }
        })
        .then(dbUser => {
            db.User.findOne({
                where: {
                    email: req.body.email
                }
            })
                .then(async userData => {
                    req = await helpers.sessionUpdate(req, userData)
                    res.json({
                        response_code: '1'
                    })
                }).catch(err => {
                    console.log(err);
                    res.status(500).end();
                })
        })
        .catch(err => {
            console.log(err);
            res.status(500).end();
        })
});

//tested +
router.put('/disableManualLogin', authorize(), (req, res) => {

    db.User.update({
        is_manual: false
    },
        {
            where: {
                email: req.body.email
            }
        })
        .then(dbUser => {
            db.User.findOne({
                where: {
                    email: req.body.email
                }
            })
                .then(async userData => {
                    req = await helpers.sessionUpdate(req, userData)
                    res.json({
                        response_code: '1'
                    })
                }).catch(err => {
                    console.log(err);
                    res.status(500).end();
                })
        })
        .catch(err => {
            console.log(err);
            res.status(500).end();
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

router.get("/userDataByToken", authorize(), (req, res) => {
    db.User.findOne({
        where: {
            id: req.userDetails.UserId
        }
    }).then(async user => {
        if (!user) {
            res.status(404).send("No such user exists");
        } else {
            res.json(user);
        }
    }).catch(err => {
        console.log(err);
        res.status(500).end()
    })
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
                    UserId: user.id,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    gender: user.gender,
                    email: user.email,
                    city: user.city,
                    State: user.State,
                    postcode: user.postcode,
                    phoneNumber: user.phoneNumber,
                    bio: user.bio,
                    tagline: user.tagline,
                    is_manual: user.is_manual,
                    provider: user.provider,
                    latitude: user.latitude,
                    longitude: user.longitude,
                    maximumDistance: user.maximumDistance
                    // token: access_token
                }

                let token = helpers.generateUserToken(
                    user.id,
                    user.username,
                    user.firstName,
                    user.lastName,
                    user.gender,
                    user.email,
                    user.city,
                    user.State,
                    user.postcode,
                    user.phoneNumber,
                    user.is_manual,
                    user.provider,
                    user.latitude,
                    user.longitude,
                    user.maximumDistance
                    //  access_token
                )
                // console.log("login sessions data: ", req.session, "user:", user);
                console.log("login sessions data: ", req.session);
                // sessionStorage.setItem("user", JSON.stringify(user));
                console.log("user: ", user);
                let result =
                {
                    token: token,
                    user: user
                }
                res.json(result);
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
router.put('/updateAll/', authorize(), (req, res) => {
    if (!req.userDetails) {
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
            tagline: req.body.tagline,
            maximumDistance: req.body.maximumDistance
        },
            {
                where: {
                    // id: req.params.id
                    id: req.userDetails.UserId
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
                req.session.user.maximumDistance = req.body.maximumDistance
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

//tested +
router.put('/updateUser/', authorize(), (req, res) => {
    if (!req.userDetails.UserId) {
        res.status(403).end();
    } else {

        let result = {}

        if (req.body.firstName) {
            result.firstName = req.body.firstName
        }
        if (req.body.lastName) {
            result.lastName = req.body.lastName
        }
        if (req.body.gender) { result.gender = req.body.gender }
        if (req.body.emai) { result.email = req.body.emai }
        if (req.body.city) { result.city = req.body.city }
        if (req.body.State) { result.State = req.body.State }
        if (req.body.postcode) { result.postcode = req.body.postcode }
        if (req.body.phoneNumber) { result.phoneNumber = req.body.phoneNumber }
        if (req.body.bio) { result.bio = req.body.bio }
        if (req.body.tagline) { result.tagline = req.body.tagline }
        if (req.body.latitude) { result.latitude = req.body.latitude }
        if (req.body.longitude) { result.longitude = req.body.longitude }
        if (req.body.maximumDistance) { result.maximumDistance = req.body.maximumDistance }
        db.User.update(result,
            {
                where: {
                    // id: req.params.id
                    id: req.userDetails.UserId
                }
            })
            .then(dbUser => {
                db.User.findOne({
                    where: {
                        id: req.userDetails.UserId
                    }
                })
                    .then(async userData => {
                        req = await helpers.sessionUpdate(req, userData)
                        res.json({
                            response_code: '1',
                            dbUser
                        })
                    }).catch(err => {
                        console.log(err);
                        res.status(500).end();
                    })
            })
            .catch(err => {
                console.log(err);
                res.status(500).end();
            })
    }
})

//tested +
router.get('/nearestUsersByLocation?:latitude?:longitude?:page?:size', /* authorize(), */(req, res) => {
    const { page, size, latitude, longitude } = req.query;
    let km = /* req.userDetails.maximumDistance ? req.userDetails.maximumDistance : */ 27
    km = (km * 10 / 100) + km

    const { limit, offset } = helpers.getPagination(page, size);

    var attributes = ["id", "firstName", "lastName", "photo"]

    var distance = db.sequelize.literal("6371 * acos(cos(radians(" + latitude + ")) * cos(radians(latitude)) * cos(radians(" + longitude + ") - radians(longitude)) + sin(radians(" + latitude + ")) * sin(radians(latitude)))")
    attributes.push([distance, 'distance']);

    var query = {
        attributes: attributes,
        order: distance,
        where: db.sequelize.where([distance, { [Op.lte]: km }]),
        limit,
        offset
    }

    db.User.findAndCountAll(query)
        .then(function (data) {
            console.log(data);
            data = helpers.getPagingData(data, page, limit);
            res.json({
                response_code: '1',
                data: data,
                totalItems: data.totalItems,
                totalPages: data.totalPages,
                currentPage: data.currentPage,
                nextPage: data.nextPage,
                previousPage: data.previousPage
            });
        }).catch(err => {
            console.log(err);
            res.status(500).end();
        })
})

//tested +
router.put('/updateUserLocation', authorize(), (req, res) => {
    let lat = req.body.latitude
    let lng = req.body.longitude

    db.User.update({
        latitude: lat,
        longitude: lng
    },
        {
            where: {
                email: req.userDetails.email
            }
        })
        .then(function (data) {
            console.log(data);
            res.json({
                response_code: '1',
                data
            });
        }).catch(err => {
            console.log(err);
            res.status(500).end();
        })
})

router.get('/search-users', authorize(), async (req, res) => {
    try {
        const users = await db.User.findAll({
            where: {
                // by using sequelize Op or we can search the user by first name, last name and email
                [Op.or]: {
                    // namesConcated will join first and last name for eg if someone's first and last name is 'Animish' and 'Sharma' it will concat it as 'Animish Sharma'
                    namesConcated: db.sequelize.where(
                        // sequelize fn means function concat and sequelize col means column in database
                        db.sequelize.fn('concat', db.sequelize.col('firstName'), ' ', db.sequelize.col('lastName')),
                        {
                            // in these brackets operators will perform to find user
                            // sequelize.Op.iLike is the function which does not care for upper aur lowercase for iLike animish = Animish = ANIMISH
                            [Op.iLike]: `%${req.query.term}%`
                        }
                    ),
                    email: {
                        // there are % beacuse it will be a get request and data will be in url surrounded with %
                        [Op.iLike]: `%${req.query.term}%`
                    }
                },
                [Op.not]: {
                    // OP not is used to exclude us (user who is sending search requests)
                    id: `${req.userDetails.UserId}`
                }
            },
            limit: 10
        })

        return res.status(200).json(users)

    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
})

module.exports = router;