const nodemailer = require('nodemailer');
const sensitive_data = require('../sensitive_data.json');

async function sendotp(email, otp) {
    console.log("Generated OTP:", otp);

    // 1. Create a transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail', // you can also use other email services
        auth: {
            user: 'jansetugov@gmail.com', // your email
            pass: sensitive_data.email_key // use an app password if using Gmail
        }
    });

    // 2. Define email options
    const mailOptions = {
        from: 'jansetugov@gmail.com', // sender address
        to: email, // receiver email (dynamic)
        subject: 'Your OTP Code',
        text: `Dear Citizen,\n\nYour One-Time Password (OTP) for accessing the JanSetu services is: ${otp}\n\nPlease use this code within the next 10 minutes. Do not share this OTP with anyone.\n\nRegards,\nJanSetu - Government Services` // simple text email
        // You can also use html: `<h1>Your OTP is: ${otp}</h1>` for HTML email
    };

    // 3. Send email
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = { sendotp };