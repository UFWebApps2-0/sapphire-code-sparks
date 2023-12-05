'use strict';
const dotenv = require('dotenv').config();
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const { sanitizeEntity } = require('strapi-utils');
const _ = require('lodash');


module.exports = {
    createAuthenticatedClient() {
        const oAuth2Client = new google.auth.OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            process.env.REDIRECT_URL
        );

        return oAuth2Client;
    },
    getAuthenticatedClientUrl(auth, scopes) {
        const authorizationUrl = auth.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent',
            scope: scopes,
        });
        return authorizationUrl
    },

    createAuthUrl() {
        const scopes = ['https://www.googleapis.com/auth/classroom.rosters', 'https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/classroom.courses', 'https://www.googleapis.com/auth/classroom.courses.readonly']

        const auth = this.createAuthenticatedClient();
        const authUrl = this.getAuthenticatedClientUrl(auth, scopes);

        const authUrlObj = {
            url: authUrl
        }

        return authUrlObj
    },

    async getUserProfile(code) {
        // Check Credentials

        // Create Client and get tokens
        const oAuthClient = this.createAuthenticatedClient();
        const tokens = await oAuthClient.getToken(code);

        const { id_token, access_token } = tokens.tokens;

        oAuthClient.setCredentials(tokens);
      

        const client = new OAuth2Client(process.env.CLIENT_ID);
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: process.env.CLIENT_ID
        });

        const payload = ticket.getPayload();
        const { name, email} = payload;

        // const { refresh_token } = tokens.refresh_token

        // If user does not exist, create new one
        const user = await strapi.query('user', 'users-permissions').findOne({ email: email.toLowerCase() });
        if (!user) {
            let randomPassword = this.generatePassword();
            let password = await strapi.admin.services.auth.hashPassword(randomPassword);
            let newUser = await strapi.query('user', 'users-permissions').create({
                username: name,
                email,
                password,
                confirmed: true,
                blocked: false,
                role: 1,
                provider: "local"
            });

            return {
                token: strapi.plugins['users-permissions'].services.jwt.issue(_.pick(newUser, ['id'])),
                gapi_token: access_token,
                user: strapi.admin.services.user.sanitizeUser(newUser)
            }


        }

        return {
            token: strapi.plugins['users-permissions'].services.jwt.issue(_.pick(user, ['id'])),
            gapi_token: access_token,
            user: strapi.admin.services.user.sanitizeUser(user)
        }

    },

    generatePassword() {
        let LENGTH = 10;

        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < LENGTH; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }

        return result;
    },

    async getUserDetailsFromToken(token) {
        const payload = await strapi.plugins['users-permissions'].services.jwt.verify(token);
        const userID = payload.id;

        let user = await strapi.plugins['users-permissions'].services.user.fetchAuthenticatedUser(userID);
        console.log(user);
    }


};
