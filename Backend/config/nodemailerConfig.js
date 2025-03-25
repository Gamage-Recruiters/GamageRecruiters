const nodemailer = require("nodemailer");
const setConfirmEmailBody = require('../utils/confirmEmailbody');
require('dotenv').config();

const transpoter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    },
});

async function sendEmail(to, subject, clientName, clientSubject, clientMassage, companyNumber, websiteLink) {

    try {


        const mailDetails = {

            from: process.env.EMAIL,
            to: to,
            subject: subject,
            html: await setConfirmEmailBody(clientName, clientSubject, clientMassage, companyNumber, websiteLink),
        };

        transpoter.sendMail(mailDetails, (error) => {

            if (error) {
                console.log(error);
            }

            console.log("Email sent:", info.response);

        })
    } catch (error) {
        console.log(error);
    }

}


module.exports = sendEmail;