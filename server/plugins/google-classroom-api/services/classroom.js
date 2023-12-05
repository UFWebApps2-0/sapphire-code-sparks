'use strict';
const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios')

/**
 * google-classroom-api.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

module.exports = {
    async getGoogleClassroomClient(code) {
        const oAuth2Client = new google.auth.OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            process.env.REDIRECT_URL
        );
        google.options({ auth: oAuth2Client });

        oAuth2Client.setCredentials({
            access_token: code
         });
        
        const googleClassroom = google.classroom({ version: 'v1', auth: oAuth2Client });

        return await googleClassroom;
    },

    async getCourses(googleClassroom) {
        return await googleClassroom.courses.list({})
    }


    
};
