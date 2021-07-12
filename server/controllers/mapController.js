const axios = require('axios')
const router = require('express').Router()
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.js')[env];
const authorize = require('../middlewares/authorize');

router.get('/petShops?:latitude?:longitude', authorize(), async (req, res, next) => {
    try {
        let radius = req.userDetails.maximumDistance * 1609.34
        const data = await axios.get(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${req.query.latitude},${req.query.longitude}&radius=${radius}&types=pet_store&name=pet&key=${config.GOOGLE_MAP_TOKEN}`
        )

        if (data.data.status === "OK") {
            let result = {
                response_code: "E_SUCCESS",
                data: data.data
            }
            return res.status(200).send(result)
        } else if (data.data.status === "ZERO_RESULTS") {
            let result = {
                response_code: "ZERO_RESULTS",
                message: "No Result Found"
            }
            return res.status(401).send(result)
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


router.get('/pincodeLatLong', authorize(), async (req, res, next) => {
    try {
        let token = req.query.token
        const data = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?key=${config.GOOGLE_MAP_TOKEN}&components=postal_code:${req.userDetails.postcode}`
        )

        if (data.data.status === "OK") {
            let latitude = ''
            let longitude = ''
            let zip_code = data.data.results
            for (let i = 0; i < zip_code.length; i++) {
                latitude = zip_code[i].geometry.location.lat
                longitude = zip_code[i].geometry.location.lng
                break;
            }

            let result = {
                response_code: "E_SUCCESS",
                data: { latitude: latitude, longitude: longitude }
            }
            return res.status(200).send(result);
        } else if (data.data.status === "ZERO_RESULTS") {
            const data = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?key=${config.GOOGLE_MAP_TOKEN}&address=${req.userDetails.city}&sensor=true`);

            if (data.data.status === "OK") {
                let latitude = ''
                let longitude = ''
                let zip_code = data.data.results
                for (let i = 0; i < zip_code.length; i++) {
                    latitude = zip_code[i].geometry.location.lat
                    longitude = zip_code[i].geometry.location.lng
                    break;
                }

                let result = {
                    response_code: "E_SUCCESS",
                    data: { latitude: latitude, longitude: longitude }
                }
                return res.status(200).send(result);
            }
        }
        else {
            console.log(data.data.status)
            return res.status(500).end(data.data.status);
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).end();
    }
});

router.get('/getPostalCodeFromLocation', authorize(), async (req, res, next) => {
    try {
        let token = req.query.token
        const data = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=7.406048,-5.328592&key=${config.GOOGLE_MAP_TOKEN}`
        )
        // postal_code
        let is_postalcode = 0
        let postal_code = ''
        if (data.data.status === "OK") {
            let zip_code = data.data.results
            for (let i = 0; i < zip_code.length; i++) {
                if (is_postalcode === 1) {
                    break;
                }
                let data1 = zip_code[i].address_components
                if (data1.length !== 0)
                    for (let a = 0; a < data1.length; a++) {
                        const element = data1[a].types;
                        let data = element.filter(item => item === "postal_code")
                        if (data.length !== 0) {
                            is_postalcode = 1
                            postal_code = data1[a].long_name
                            break;
                        }
                    }
            }
            let result = {
                response_code: "E_SUCCESS",
                data: postal_code
            }
            return res.status(200).send(result);
        }
        else {
            console.log(data.data.status)
            return res.status(500).end(data.data.status);
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).end();
    }
});


module.exports = router