require('dotenv').config(); //added for mail

module.exports = {
    "development": {
        "username": process.env.DEV_USERNAME,
        "password": process.env.DEV_PASSWORD,
        "database": process.env.DEV_DATABASE,
        "host": process.env.DEV_HOST,
        "dialect": process.env.DEV_DIALECT,
        "jwt_issuer": process.env.DEV_JWT_ISSURE,
        "jwt_secret": process.env.DEV_JWT_SECRET,
        "FACEBOOK_CALLBACK": process.env.DEV_FACEBOOK_CALLBACK,
        "GOOGLE_CALLBACK": process.env.DEV_GOOGLE_CALLBACK,
        "FRONTEND_HOST": process.env.DEV_FRONTEND_HOST,
        "FACEBOOK_APP_ID": process.env.DEV_FACEBOOK_APP_ID,
        "FACEBOOK_CLIENT_SECRET": process.env.DEV_FACEBOOK_CLIENT_SECRET,
        "GOOGLE_APP_ID": process.env.DEV_GOOGLE_APP_ID,
        "GOOGLE_CLIENT_SECRET": process.env.DEV_GOOGLE_CLIENT_SECRET,
        "GOOGLE_MAP_TOKEN": process.env.DEV_GOOGLE_MAP_TOKEN
    },
    "staging": {
        "PORT": process.env.STAGING_PORT,
        "username": process.env.STAGING_USERNAME,
        "password": process.env.STAGING_PASSWORD,
        "database": process.env.STAGING_DATABASE,
        "host": process.env.STAGING_HOST,
        "dialect": process.env.STAGING_DIALECT,
        "jwt_issuer": process.env.STAGING_JWT_ISSURE,
        "jwt_secret": process.env.STAGING_JWT_SECRET,
        "FACEBOOK_CALLBACK": process.env.STAGING_FACEBOOK_CALLBACK,
        "GOOGLE_CALLBACK": process.env.STAGING_GOOGLE_CALLBACK,
        "FRONTEND_HOST": process.env.STAGING_FRONTEND_HOST,
        "FACEBOOK_APP_ID": process.env.STAGING_FACEBOOK_APP_ID,
        "FACEBOOK_CLIENT_SECRET": process.env.STAGING_FACEBOOK_CLIENT_SECRET,
        "GOOGLE_APP_ID": process.env.STAGING_GOOGLE_APP_ID,
        "GOOGLE_CLIENT_SECRET": process.env.STAGING_GOOGLE_CLIENT_SECRET,
        "GOOGLE_MAP_TOKEN": process.env.STAGING_GOOGLE_MAP_TOKEN
    },
    "production": {
        "PORT": process.env.PROD_PORT,
        "username": process.env.PROD_USERNAME,
        "password": process.env.PROD_PASSWORD,
        "database": process.env.PROD_DATABASE,
        "host": process.env.PROD_HOST,
        "dialect": process.env.PROD_DIALECT,
        "jwt_issuer": process.env.PROD_JWT_ISSURE,
        "jwt_secret": process.env.PROD_JWT_SECRET,
        "FACEBOOK_CALLBACK": process.env.PROD_FACEBOOK_CALLBACK,
        "GOOGLE_CALLBACK": process.env.PROD_GOOGLE_CALLBACK,
        "FRONTEND_HOST": process.env.PROD_FRONTEND_HOST,
        "FACEBOOK_APP_ID": process.env.PROD_FACEBOOK_APP_ID,
        "FACEBOOK_CLIENT_SECRET": process.env.PROD_FACEBOOK_CLIENT_SECRET,
        "GOOGLE_APP_ID": process.env.PROD_GOOGLE_APP_ID,
        "GOOGLE_CLIENT_SECRET": process.env.PROD_GOOGLE_CLIENT_SECRET,
        "GOOGLE_MAP_TOKEN": process.env.PROD_GOOGLE_MAP_TOKEN
    }
}