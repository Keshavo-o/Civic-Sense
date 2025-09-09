const user = require("../models/user.js");
const {getuser}=require("../services/otp_temp.js");
const {
  hashPassword,
  verifyPassword
} = require("../services/password_encryption.js");
async function verifyotp(req, res) 
{
    const token = req.cookies['temp_token'];
    if (!token) {
        return res.status(400).send('No token provided');
    }
    const temp_user = getuser(token);
    if (!temp_user) {
        return res.status(400).send('Invalid or expired token');
    }
    const { otp } = req.body;
    console.log(otp, temp_user.otp);
    if (parseInt(otp) !== temp_user.otp) {
        return res.render('otp', { message: 'Invalid OTP. Please try again.' });
    }
    // console.log()
    const { salt, hash } = hashPassword(temp_user.password);
    temp_user.password = hash;
    temp_user.salt = salt;
    // Store user in the database
    await user.create(
        {
            username: temp_user.username,
            email: temp_user.email,
            password: temp_user.password
            , salt: temp_user.salt,
            notifications:["Hii , your account has been created successfully !!"] 
            
        }
    );
    res.clearCookie('temp_token');
    return res.redirect('/userlogin');

};
module.exports = { verifyotp };