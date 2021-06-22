const router = require('express').Router();
const db = require('../models');


//BASE URL FOR ALL ROUTES ON THIS PAGE: /api/pets

//TESTING ROUTE -- return list of all pets (remove upon deployment) tested+
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

//return one pet by id
router.get('/:id', (req, res) => {
    db.Pet.findOne({
        where: {
            id: req.params.id
        }
    })
        .then(petData => {
            console.log("pet information: ", petData);
            res.json(petData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).end();
        })
})

//return all pets for a user by id (covered in user routes '/api/user/userpets/')
// router.get('/:id', (req, res) => {
//     db.Pet.findAll({
//         where: {
//             id: req.params.id
//         }
//     })
//     .then(dbUserPets => {
//         res.json(dbUserPets);
//     })
//     .catch(err => {
//         console.log(err);
//         res.status(500).end();
//     })
// });

//create new pet tested +
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
        bio: req.body.bio,
        UserId: req.body.UserId
    })
        .then(petData => {
            console.log("New Pet:", petData);
            res.json(petData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).end();
        })
});

router.delete('/', (req, res) => {
    db.Pet.destroy({
        where: {
            id: req.body.id
        }
    })
        .then(petData => {
            res.json(petData)
        })
        .catch(err => {
            console.log(err);
            res.status(500).end();
        })
});

router.put('/updateAll/:id', (req, res) => {
    db.Pet.update({
        name: req.body.name,
        type: req.body.type,
        imageSrc: req.body.imageSrc,
        breed: req.body.breed,
        secondaryBreed: req.body.secondaryBreed,
        age: req.body.age,
        sex: req.body.sex,
        size: req.body.size,
        bio: req.body.bio
    },
        {
            where: {
                id: req.params.id
            }
        })
        .then(dbPet => {
            res.json(dbPet)
        })
        .catch(err => {
            console.log(err);
            res.status(500).end();
        })
});


router.get('/getPetByUserId/:id', (req, res) => {
    db.Pet.findOne(
        {
            where: {
                userId: req.params.id
            }
        })
        .then(dbPet => {
            res.json({ response_code: 'E_SUCCESS', dbPet })
        })
        .catch(err => {
            console.log(err);
            res.status(500).end();
        })
});

//TODO: update, delete, picture uploads

module.exports = router;