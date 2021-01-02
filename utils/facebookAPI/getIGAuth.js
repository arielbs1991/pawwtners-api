const axios = require('axios');
require('dotenv').config();

//TODO: create function to generate state using a private key together with client ID and a session cookie to compute a hashed value, then base-64 encode it and pass as state paramater
//OR hash the current date and time
const getIGAuth = () => {
  const instagramAppId = process.env.FACEBOOK_APP_ID
  const scope = [user_profile, user_media]
  const redirect_uri = 'localhost:3001/api/auth'


  const auth_code = {
    // url: "oauth2/token",
    // method: "post",
    baseURL: "https://api.instagram.com/oauth/authorize",
    data: {
      client_id: `${instagramAppId}`,
      redirect_uri: `${redirect_uri}`,
      scope: `${scope}`,
      response_type: code,
      state: `${state}`
    },
  };

  return axios(auth_code);
}

module.exports = getIGAuth;