const nodemailer = require("nodemailer");
require('dotenv').config
const { google } = require('googleapis');

const CLIENT_EMAIL = process.env.MAIL; //your email from where you'll be sending emails to users
const CLIENT_ID = process.env.EMAIL_CLIENT_ID; // Client ID generated on Google console cloud
const CLIENT_SECRET = process.env.EMAIL_CLIENT_SECRET; // Client SECRET generated on Google console cloud
const REDIRECT_URI = process.env.EMAIL_CLIENT_REDIRECT_URI; // The OAuth2 server (playground)
const REFRESH_TOKEN = process.env.EMAIL_REFRESH_TOKEN; // The refreshToken we got from the the OAuth2 playground


const OAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI,
  );

OAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });


const sendEmail = async (email:String, subject:String, text:String) => {
    console.log("go")
    const accessToken = await OAuth2Client.getAccessToken();
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              
                type: 'OAuth2',
                user: CLIENT_EMAIL,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,

            }
        });

        await transporter.sendMail({
            from: CLIENT_EMAIL,
            to: email,
            subject: subject,
            text: text,
        });

        
    } catch (error) {
    }
};

module.exports = sendEmail;