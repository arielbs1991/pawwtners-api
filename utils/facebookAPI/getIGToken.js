const axios = require('axios');
const auth_code = require('./getIGAuth.js');
require('dotenv').config();

const getIGToken = () => {
    const instagram_app_id = process.env.FACEBOOK_APP_ID
    const scope = [user_profile, user_media]
    const redirect_uri = 'localhost:3001/api/auth'

    const config = {
        url: "oauth2/token",
        method: "post",
        baseURL: "https://api.instagram.com/oauth/access_token",
        data: {
            client_id: `${instagram_app_id}`,
            client_secret: `${client_secret}`,
            redirect_uri: `${redirect_uri}`,
            scope: `${scope}`,
            grant_type: authorization_code,
            code: `${auth_code}`
        },
    };

    return axios(config);
}

module.exports = getIGToken;