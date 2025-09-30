const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const dotenv = require('dotenv');

dotenv.config();

const otpCache = {};

// Function to generate a random string ...
function generateOTP () {
    return randomstring.generate({
        length: 6,
        charset: 'numeric'
    });
};

// Function to send OTP via email ...
async function sendOTP (email, otp) {
    try {
        const mailOptions = {
            from: process.env.APP_EMAIL,
            to: email,
            subject: 'OTP Verification - Gamage Recruiters',
            text: `Your OTP for email verification is ${otp}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Email Verification - Gamage Recruiters</h2>
                    <p>Your OTP for email verification is:</p>
                    <div style="background-color: #f0f0f0; padding: 20px; text-align: center; margin: 20px 0;">
                        <span style="font-size: 24px; font-weight: bold; color: #007bff;">${otp}</span>
                    </div>
                    <p>This OTP will expire in 10 minutes.</p>
                    <p>If you didn't request this verification, please ignore this email.</p>
                </div>
            `
        };

        // Use the same transporter configuration as nodemailerConfig.js
        const transporter = nodemailer.createTransport({
            host: "mail.gamagerecruiters.lk",
            port: 465,
            secure: true,
            auth: {
                user: process.env.APP_EMAIL,
                pass: process.env.APP_PASSWORD
            },
            // debug: true, // Enable debug output
            logger: true // Log information in console
        });

        // Verify connection configuration
        await transporter.verify();
        console.log('SMTP connection verified successfully');

        const info = await transporter.sendMail(mailOptions);
        console.log('OTP sent successfully:', info.messageId);
        console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
        
        return { success: true, messageId: info.messageId };

    } catch (error) {
        console.error('Error occurred while sending OTP:', error);
        throw error; // Re-throw the error so it can be handled by the calling function
    }
}; 

module.exports = { otpCache, generateOTP, sendOTP };