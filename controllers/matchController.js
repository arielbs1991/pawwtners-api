const router = require('express').Router();
const db = require('../models');

//BASE URL FOR ALL ROUTES ON THIS PAGE: /api/match

//route to pass map api key to front end
router.get('/mapAPI', (req, res) => {
    // if (!req.session.user || !req.session.shelter) {
    //     res.status(403).end();
    // } else {
    res.json(process.env.MAP_API);
    // }
})

//create a new match tested+
router.post('/', (req, res) => {
    db.Match.create({
        isLiked: req.body.isLiked,
        matchedUserId: req.body.matchedUserId,
        UserId: req.body.UserId
        //UserId: req.session.user.UserId
    })
        .then(dbMatch => {
            res.json(dbMatch);
        })
        .catch(err => {
            console.log(err);
            res.status(500).end();
        })
})

//testing route to see all matches tested+
router.get('/all/', (req, res) => {
    db.Match.findAll({})
        .then(matchList => {
            console.log('all matches:', matchList);
            res.json(matchList);
        })
        .catch(err => {
            console.log(err);
            res.status(500).end();
        })
})

//find all matches by user id (TODO: change to use sessions data) tested+
router.get('/:id', (req, res) => {
    db.Match.findAll({
        where: {
            UserId: req.params.id
            //UserId: req.session.user.UserId
        }
    })
        .then(dbMatches => {
            console.log(`Match data for user: `, dbMatches);
            res.json(dbMatches);
        })
        .catch(err => {
            console.log(err);
            res.status(500).end();
        })
});

//unmatch (updates liked to disliked) tested+
router.put('/unmatch/:matchedUserId', (req, res) => {
    db.Match.update({
        isLiked: false
    },
        {
            where: {
                matchedUserId: req.params.matchedUserId,
                UserId: req.body.UserId,
                //UserId: req.session.user.UserId
            }
        })
        .then(dbMatches => {
            res.json(dbMatches);
        })
        .catch(err => {
            console.log(err);
            res.status(500).end();
        })
});

//block user by id (deletes match) TODO: look up standard method for blocking users and update
router.delete('/block/:id', (req, res) => {
    db.Match.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbBlock => {
            res.json(dbBlock);
        })
        .catch(err => {
            console.log(err);
            res.status(500).end();
        })
});

module.exports = router;