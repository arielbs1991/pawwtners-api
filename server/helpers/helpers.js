"use Strict"

/* eslint-disable camelcase */
const jwt = require('jsonwebtoken')
const env = process.env.NODE_ENV || 'development';
const { jwt_secret, jwt_issuer } = require('../config/config.json')[env];


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
    if (page === (totalPages - 1)) {
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

let validations = {
    generateUserToken,
    sessionUpdate,
    getPagination,
    getPagingData
}

module.exports = validations;