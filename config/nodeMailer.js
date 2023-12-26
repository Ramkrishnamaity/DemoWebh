const nodemailer = require('nodemailer');
require('dotenv').config()


let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    }
});

exports.transporter = transporter; 