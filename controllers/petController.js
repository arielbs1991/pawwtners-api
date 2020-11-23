const router = require('express').Router();
const db = require('../models');


//BASE URL FOR ALL ROUTES ON THIS PAGE: /api/pets

//TESTING ROUTE -- return list of all pets (remove upon deployment)
router.get('/petlist/', (req, res) => {
    db.Pet.findAll({})
    .then(petList => {
        res.json(petList);
    })
    .catch(err => {
        console.log(err);
        res.status(500).end();
    })
});

//return all pets for a user by id
router.get('/pets/:id', (req, res) => {
    db.Pet.findAll({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserPets => {
        res.json(dbUserPets);
    })
    .catch(err => {
        console.log(err);
        res.status(500).end();
    })
});

//create new pet
router.post('/newpet/', (req, res) => {
    db.Pet.create({
        name: req.body.name,
        type: req.body.type,
        imageSrc: req.body.imageSrc,
        breed: req.body.breed,
        secondaryBreed: req.body.secondaryBreed,
        age: req.body.age,
        sex: req.body.sex,
        size: req.body.size,
        bio: req.body.bio
    })
    .then(petData => {
        res.json(petData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).end();
    })
});

//TODO: update, delete, picture uploads