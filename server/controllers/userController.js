const router = require("express").Router();
const db = require("../models");
const sequelize = require('../models')
const Op = sequelize.Sequelize.Op;
const bcrypt = require("bcryptjs");
const helpers = require('../helpers/helpers');
const authorize = require("../middlewares/authorize");
const jwt = require('jsonwebtoken');
const env = process.env.NODE_ENV || 'development';
const config = require("../config/config.js")[env];;
const saltRounds = 12;

//BASE ROUTE FOR THIS FILE: /api/user

//TESTING ROUTE TODO: Remove or comment out upon deployment for security
//tested + 
router.get('/userlist/', authorize(), (req, res) => {
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
        },
        include: {
            model: db.Pet
        },
        attributes: { exclude: ['password'] }
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
        },
        attributes: { exclude: ['password'] }
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

//tested -
router.post('/signUp', (req, res, next) => {
    bcrypt.hash(req.body.password, saltRounds, (error, hash) => {
        db.User.findOne({
            email: req.body.email,
        }).then(user => {
            if (user) {
                res.status(401).send({ response_code: "E_USER_PRESENT", message: "User Already Present With This Email" })
            }
            db.User.create({
                username: req.body.username,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                photo: req.body.photo ? req.body.photo : [],
                media: req.body.media ? req.body.media : [],
                gender: req.body.gender,
                height: req.body.heights,
                password: hash,
                city: req.body.city,
                state: req.body.state,
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
                    res.json({ response_code: "E_SUCCESS", userData });
                    res.status(201);
                })
                .catch(error => {
                    console.log(error);
                    next(error);
                    res.status(500).end();
                })
        })
            .catch(error => {
                console.log(error);
                next(error);
                res.status(500).end();
            })
    })
});

//create new user on signup

// tested +
router.post('/', (req, res) => {
    db.User.findAll({
        where: {
            email: req.body.email
        }
    }).then(async user => {
        if (req.body.isPrivacyPolicyAccepted) {
            if (user.length == 0) {
                let password = await helpers.hashPassword(req.body.password);
                let location = await helpers.locationFromPostalCode(req);
                db.User.create({
                    username: req.body.username,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    photo: req.body.photo ? req.body.photo : [],
                    media: req.body.media ? req.body.media : [],
                    gender: req.body.gender,
                    isPrivacyPolicyAccepted: req.body.isPrivacyPolicyAccepted,
                    height: req.body.heights,
                    password: password,
                    city: req.body.city,
                    state: req.body.state,
                    postcode: req.body.postcode,
                    phoneNumber: req.body.phoneNumber,
                    bio: req.body.bio,
                    tagline: req.body.tagline,
                    provider: 'manual',
                    is_manual: true,
                    latitude: location.latitude,
                    longitude: location.longitude,
                    maximumDistance: req.body.maximumDistance
                })
                    .then(userData => {
                        res.json({ response_code: "E_SUCCESS" });
                        res.status(201);
                    })
                    .catch(error => {
                        console.log(error);
                        res.status(500).end();
                    })
            } else {
                res.status(403).send({ response_code: "E_USER_PRESENT", message: "User Already Present With This Email" })
            }
        } else {
            res.status(403).send({ response_code: "E_PRIVACY_POLICY_ACCEPT", message: "Please Accept Privacy Policy" })
        }
    })
})

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

                    res.json({
                        response_code: "E_SUCCESS"
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
        is_manual: false,
        password: null
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

                    res.json({
                        response_code: "E_SUCCESS"
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
        // state: req.body.state,
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

// tested+
router.get("/userDataByToken", authorize(), (req, res) => {
    db.User.findOne({
        where: {
            id: req.userDetails.UserId
        },
        include: [
            { model: db.Pet }
        ],
        attributes: { exclude: ['password'] },
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

// tested+
router.put("/updatePrivacyPolicy", (req, res) => {
    // for Google Facebook Login
    if (req.body.token) {
        try {
            let result = jwt.verify(req.body.token, config.jwt_secret, {
                expiresIn: 60 * 60 * 24,
                issuer: config.jwt_issuer
            });
            req.userDetails = result;
        } catch (err) {
            return res.status(401).json({
                status: 401,
                code: "E_UNAUTHORIZED",
                data: err,
                message: "Jwt token is missing in request"
            });
        }
        db.User.findOne({
            where: {
                id: req.userDetails.UserId
            },
            attributes: { exclude: ['password'] },
        }).then(async user => {
            if (!user) {
                res.status(404).send("No such user exists");
            } else {

                db.User.update({
                    isPrivacyPolicyAccepted: true
                }, {
                    where: {
                        id: req.userDetails.UserId
                    }
                })
                    .then(user => {
                        let result = {
                            response_code: "E_SUCCESS",
                            data: user
                        }
                        res.status(200).send(result)
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).end()
                    })
            }
        }).catch(err => {
            console.log(err);
            res.status(500).end()
        })
    } else if (req.body.email) {
        // for Manual Login
        db.User.findOne({
            where: {
                email: req.body.email
            },
            attributes: { exclude: ['password'] },
        }).then(async user => {
            if (!user) {
                res.status(404).send("No such user exists");
            } else {

                db.User.update({
                    isPrivacyPolicyAccepted: true
                }, {
                    where: {
                        email: req.body.email
                    }
                })
                    .then(user => {
                        let result = {
                            response_code: "E_SUCCESS",
                            data: user
                        }
                        res.status(200).send(result)
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).end()
                    })
            }
        }).catch(err => {
            console.log(err);
            res.status(500).end()
        })
    }
})

// tested+
router.post('/login', (req, res) => {

    // const user = req.session.user;

    db.User.findOne({
        where: {
            email: req.body.email
        }
    }).then(async user => {

        if (!user) {
            let result = {
                response_code: "E_USER_NOT_EXIST",
                message: "No such user exists with this e-mail"
            }
            res.status(404).send(result);
        }
        else if (user.is_manual === false) {
            let result = {
                response_code: "E_MANUAL_LOGIN",
                message: "Manual Login not Enabled for This User"
            }
            res.status(401).send(result);
        }
        else if (user.isPrivacyPolicyAccepted == false || !user.isPrivacyPolicyAccepted) {
            res.status(401).send({ response_code: "E_PRIVACY_POLICY_ACCEPT", message: "Please Accept Privacy Policy" })
        }
        else {
            if (
                helpers.comparePassword(user.password, req.body.password)) {
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
                    state: user.state,
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
                    user.firstName,
                    user.lastName,
                    user.gender,
                    user.email,
                    user.city,
                    user.state,
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
                let result = {
                    response_code: "E_SUCCESS",
                    token: token
                }
                res.json(result);
                // res.json(req.session);
            } else {
                let result = {
                    response_code: "PASSWORD_MISSMATCH",
                    message: "Invalid Password"
                }
                res.status(401).send(result)
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
                    // state: user.state,
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
            city: req.body.city,
            state: req.body.state,
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
                req.session.user.city = req.body.city
                req.session.user.state = req.body.state
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
router.put('/updateUser/', authorize(), async (req, res) => {
    if (!req.userDetails.UserId) {
        res.status(403).end();
    } else {

        let result = {}
        let pet = {
            UserId: req.userDetails.UserId
        }
        if (req.body.firstName) {
            result.firstName = req.body.firstName
        }
        if (req.body.lastName) {
            result.lastName = req.body.lastName
        }
        if (req.body.gender) { result.gender = req.body.gender }
        if (req.body.height) { result.height = req.body.height }
        if (req.body.email) { result.email = req.body.email }
        if (req.body.photo) { result.photo = req.body.photo }
        if (req.body.media) { result.media = req.body.media }
        if (req.body.city) { result.city = req.body.city }
        if (req.body.state) { result.state = req.body.state }
        if (req.body.postcode) {
            let data = await helpers.locationFromPostalCode(req);
            req.body.latitude = data.latitude
            req.body.longitude = data.longitude
            result.postcode = req.body.postcode
        }
        if (req.body.phoneNumber) { result.phoneNumber = req.body.phoneNumber }
        if (req.body.bio) { result.bio = req.body.bio }
        if (req.body.tagline) { result.tagline = req.body.tagline }
        if (req.body.latitude) { result.latitude = req.body.latitude }
        if (req.body.longitude) { result.longitude = req.body.longitude }
        if (req.body.maximumDistance) { result.maximumDistance = req.body.maximumDistance }
        if (req.body.pet) {
            if (req.body.pet.name) { pet.name = req.body.pet.name }
            if (req.body.pet.nickName) { pet.nickName = req.body.pet.nickName }
            if (req.body.pet.type) { pet.type = req.body.pet.type }
            if (req.body.pet.photo) { pet.photo = req.body.pet.photo }
            if (req.body.pet.video) { pet.video = req.body.pet.video }
            if (req.body.pet.breed) { pet.breed = req.body.pet.breed }
            if (req.body.pet.secondaryBreed) { pet.secondaryBreed = req.body.pet.secondaryBreed }
            if (req.body.pet.age) { pet.age = req.body.pet.age }
            if (req.body.pet.size) { pet.size = req.body.pet.size }
            if (req.body.pet.sex) { pet.sex = req.body.pet.sex }
            if (req.body.pet.bio) { pet.bio = req.body.pet.bio }
            if (req.body.pet.description) { pet.description = req.body.pet.description }
            if (req.body.pet.personality) { pet.personality = req.body.pet.personality }
            if (req.body.pet.adoptionStory) { pet.adoptionStory = req.body.pet.adoptionStory }
            if (req.body.pet.humanPersonality) { pet.humanPersonality = req.body.pet.humanPersonality }
            if (req.body.pet.favoriteFood) { pet.favoriteFood = req.body.pet.favoriteFood }
        }
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
                    },
                    attributes: { exclude: ['password'] }
                })
                    .then(async userData => {
                        db.Pet.findOne({
                            where: {
                                UserId: req.userDetails.UserId
                            }
                        }).then(data => {
                            if (data) {
                                db.Pet.update(pet, {
                                    where: {
                                        UserId: req.userDetails.UserId
                                    }
                                }).then(async pet => {
                                    console.log(pet)

                                    res.json({
                                        response_code: "E_SUCCESS",
                                        dbUser
                                    })
                                }).catch(err => {
                                    console.log(err);
                                })
                            } else {
                                pet.UserId = req.userDetails.UserId
                                db.Pet.create(pet).then(async pet => {
                                    console.log(pet);

                                    res.json({
                                        response_code: "E_SUCCESS",
                                        dbUser
                                    })
                                }).catch(err => {
                                    console.log(err);
                                })
                            }
                        }).catch(err => {
                            console.log(err);
                            res.status(500).end();
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
router.get('/nearestUsersByLocation?:latitude?:longitude?:page?:size', authorize(), (req, res) => {
    const { page, size } = req.query;
    const { latitude, longitude } = req.userDetails
    let km = req.userDetails.maximumDistance ? req.userDetails.maximumDistance : 27
    km = (km * 10 / 100) + km

    const { limit, offset } = helpers.getPagination(page, size);
    db.User.count({
        where: db.sequelize.literal(`3959 * acos(cos(radians(${latitude})) * cos(radians(latitude)) * cos(radians(${longitude}) - radians(longitude)) + sin(radians(${latitude})) * sin(radians(latitude))) <= ${km} AND "id" != ${req.userDetails.UserId} AND "id" NOT IN (SELECT "likedUserId" FROM "Likes" AS "Like" WHERE "UserId" = ${req.userDetails.UserId})`),
    }).then(count => {
        db.User.findAll({
            attributes: ["id", "firstName", "lastName", "photo", [db.sequelize.literal("3959 * acos(cos(radians(" + latitude + ")) * cos(radians(latitude)) * cos(radians(" + longitude + ") - radians(longitude)) + sin(radians(" + latitude + ")) * sin(radians(latitude)))"), 'distance']],
            order: [[db.sequelize.literal(`"distance"`), 'ASC']],
            where: db.sequelize.literal(`3959 * acos(cos(radians(${latitude})) * cos(radians(latitude)) * cos(radians(${longitude}) - radians(longitude)) + sin(radians(${latitude})) * sin(radians(latitude))) <= ${km} AND "id" != ${req.userDetails.UserId} AND "id" NOT IN (SELECT "likedUserId" FROM "Likes" AS "Like" WHERE "UserId" = ${req.userDetails.UserId})`),
            include: [{
                model: db.Pet
            }],
            limit,
            offset
        })
            .then(function (data) {
                console.log(count)
                console.log(data);
                let pagination = {
                    count: count,
                    rows: data
                }
                data = helpers.getPagingData(pagination, page, limit);
                res.json({
                    response_code: "E_SUCCESS",
                    data: data.data,
                    totalItems: data.totalItems,
                    totalPages: data.totalPages,
                    currentPage: data.currentPage,
                    isNextPage: count - limit > 0 ? true : false,
                    nextPage: data.nextPage,
                    previousPage: data.previousPage
                });

            }).catch(err => {
                console.log(err);
                res.status(500).end();
            })

    })
        .catch(err => {
            console.log(err);
            res.status(500).end();
        })
})



//tested +
router.put('/updateUserLocation', authorize(), (req, res) => {
    // let lat = req.body.latitude
    // let lng = req.body.longitude

    // db.User.update({
    //     latitude: lat,
    //     longitude: lng
    // },
    //     {
    //         where: {
    //             email: req.userDetails.email
    //         }
    //     })
    //     .then(function (data) {
    //         console.log(data);
    res.json({
        response_code: "E_SUCCESS",
        // data
    });
    // }).catch(err => {
    //     console.log(err);
    //     res.status(500).end();
    // })
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