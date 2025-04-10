const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

function subscriptionNotifyEmailSending(email) {
    if(!email) {
        return 'error';
    }

    try {
        const mailOptions = {
            from: process.env.APP_EMAIL,
            to: email,
            subject: 'Suscription Successfull!',
            text:`You have successfully suscribed for our company newsletter.. You will receive latest news of the company`
        };
        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.APP_EMAIL,
                pass: process.env.APP_PASSWORD
            },
            tls: {
                rejectUnauthorized: false // Disable certificate validation ...
            }
        });

        transporter.sendMail(mailOptions, (error, info) => {
            if(error) {
                console.log('Error occurred while subscription process:', error);
                return;
            } else {
                console.log('subscription success email sent successfully:', info.response);
            }
        });
    } catch (error) {
        console.log(error);
        return 'error';
    }
}

module.exports = subscriptionNotifyEmailSending;