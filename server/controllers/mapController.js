const axios = require('axios')
const router = require('express').Router()
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const authorize = require('../middlewares/authorize');

router.get('/petShops', authorize(), async (req, res, next) => {
    try {
        let radius = req.userDetails.maximumDistance * 1609.34
        const data = await axios.get(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${req.userDetails.latitude},${req.userDetails.longitude}&radius=${radius}&types=pet_store&name=pet&key=${config.GOOGLE_MAP_TOKEN}`
        )

        if (data.data.status === "OK") {
            let result = {
                response_code: "E_SUCCESS",
                data: data.data
            }
            return res.status(200).send(result)
        }
        else {
            console.log(JSON.stringify(data))
            return res.status(500).end();
        }
    }
    catch (err) {
        console.log(err)
        return res.status(500).end();
    }
});

router.get('/nextPetShops?:token', authorize(), async (req, res, next) => {
    try {
        let token = req.query.token
        const data = await axios.get(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=${token}&key=${config.GOOGLE_MAP_TOKEN}`
        )

        if (data.data.status === "OK") {
            let result = {
                response_code: "E_SUCCESS",
                data: data.data
            }
            return res.status(200).send(result);
        }
        else {
            console.log(JSON.stringify(data))
            return res.status(500).end();
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).end();
    }
});


module.exports = router