"use Strict"

/* eslint-disable camelcase */
const jwt = require('jsonwebtoken')
const env = process.env.NODE_ENV || 'development';
const { jwt_secret, jwt_issuer } = require('../config/config.json')[env];
const bcrypt = require('bcryptjs');
const axios = require('axios');
const config = require("../config/config.json")[env];;

/**
 * Function to Update Data In session on user data update
 * @param {object} req 
 * @param {object} user 
 * @returns {object} req
 */

const sessionUpdate = (req, user) => {
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
        tagline: user.tagline,
        is_manual: user.is_manual,
        provider: user.provider,
        latitude: user.latitude,
        longitude: user.longitude,
        maximumDistance: user.maximumDistance
        // token: access_token
    }

    return req
}

/**
 * 
 * @param {number} page 
 * @param {number} size 
 * @returns limit offset
 */
const getPagination = (page, size) => {
    const limit = size ? +size : 10;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};
/**
 * 
 * @param {number} page 
 * @param {number} limit 
 * @param {number} total 
 * @param {number} totalPages 
 * @returns 
 */
const getNextPage = (page, limit, total, totalPages) => {
    if (page >= (totalPages - 1)) {
        if (total != 0) {
            return 0
        }
        return null
    }
    else if ((total / limit) > page) {
        return page + 1;
    }
    return null
}

/**
 * 
 * @param {number} page 
 * @returns previous page_no
 */
const getPreviousPage = (page) => {
    if (page <= 1) {
        return null
    }
    return page - 1;
}
/**
 * 
 * @param {Array} dbdata 
 * @param {number} page 
 * @param {number} limit 
 * @returns totalItems Users totalPages currentPage nextPage previousPage
 */
const getPagingData = (dbdata, page, limit) => {
    // const { count: totalItems, rows: data } = dbdata;
    const totalItems = dbdata.count ? dbdata.count : 0
    const data = dbdata.rows ? dbdata.rows : 0
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    const nextPage = getNextPage(currentPage, limit, totalItems, totalPages)
    const previousPage = getPreviousPage(page);

    return { totalItems, data, totalPages, currentPage, nextPage, previousPage };
};


/**
   * Generate Token
   * @param {string} id
   * @returns {string} token
   */
const generateUserToken = (UserId, firstName, lastName, gender, email, city, state, postcode, phoneNumber, is_manual, provider, latitude, longitude, maximumDistance) => {
    const token = jwt.sign({ UserId, firstName, lastName, gender, email, city, state, postcode, phoneNumber, is_manual, provider, latitude, longitude, maximumDistance },
        jwt_secret, { expiresIn: 60 * 60 * 24, issuer: jwt_issuer },
    );
    return token;
};

/**
   * Hash Password Method
   * @param {string} password
   * @returns {string} returns hashed password
   */
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const hashPassword = password => bcrypt.hashSync(password, salt);

/**
   * comparePassword
   * @param {string} hashPassword
   * @param {string} password
   * @returns {Boolean} return True or False
   */
const comparePassword = (hashedPassword, password) => {
    return bcrypt.compareSync(password, hashedPassword);
};



const locationFromPostalCode = async (req) => {
    try {
        let postcode
        if (req.body.postcode)
            postcode = req.body.postcode
        else
            postcode = req.userDetails.postcode
        const { data } = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?key=${config.GOOGLE_MAP_TOKEN}&components=postal_code:${postcode}`
        );
        console.log()
        if (data.status === "OK") {
            let latitude = ''
            let longitude = ''
            let latlang = data.data.results
            for (let i = 0; i < latlang.length; i++) {
                latitude = latlang[i].geometry.location.lat
                longitude = latlang[i].geometry.location.lng
                break;
            }
            let location = { latitude: latitude, longitude: longitude }

            return location;
        }
        else {
            let city
            if (req.body.city)
                city = req.body.city
            else
                city = req.userDetails.city
            const data = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?key=${config.GOOGLE_MAP_TOKEN}&address=${city}&sensor=true`);

            if (data.data.status === "OK") {
                let latitude = ''
                let longitude = ''
                let latlang = data.data.results
                for (let i = 0; i < latlang.length; i++) {
                    latitude = latlang[i].geometry.location.lat
                    longitude = latlang[i].geometry.location.lng
                    break;
                }
                let location = { latitude: latitude, longitude: longitude }
                return location;
            }
        }
    }
    catch (err) {
        console.log(err);
        return err;
    }
}


const getPostalCode = async (req) => {
    try {

        const { data } = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${req.query.latitude},${req.query.longitude}&key=${config.GOOGLE_MAP_TOKEN}`
        )

        if (data.status === "OK") {
            let is_postalcode = 0
            let postal_code = ''
            let zip_code = data.results
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
            return postal_code;
        }
        else {
            console.log(JSON.stringify(data))
            return res.status(500).end();
        }
    }
    catch (err) {
        console.log(err);
        return err
    }
}



let validations = {
    generateUserToken,
    sessionUpdate,
    getPagination,
    getPagingData,
    hashPassword,
    comparePassword,
    locationFromPostalCode,
    getPostalCode
}

module.exports = validations;