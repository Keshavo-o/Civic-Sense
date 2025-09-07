const user = require("../models/user.js");
const {setuser,
    getuser} = require("../services/otp_temp.js");
const {sendotp}=require("../services/otp_service.js");

async function handlecreateuser(req, res) {
    const user_obj = req.body;
    const existingemail = await user.findOne({ email: user_obj.email  });
    if (existingemail) {
        return res.render('usersignup', { message: "Email already registered. Please use a different email." });
    }
    const existinguser = await user.findOne({ username: user_obj.name  });
    if (existinguser) {
        return res.render('usersignup', { message: "Username already taken. Please choose a different username." });
    }
    if(user_obj.password !== user_obj.confirm_password){
        return res.render('usersignup', { message: "Passwords don't match" });
    }
    // await user.create(
    //         {
    //             username: user_obj.name,
    //             email: user_obj.email,
    //             password: user_obj.password
    //         }
    // );
    // console.log("User object:", user_obj);
    $otp = Math.floor(100000 + Math.random() * 900000);

    console.log("Generated OTP:", $otp);
    const temp_token = setuser({
        username: user_obj.name,
        email: user_obj.email,
        password: user_obj.password,
        otp: $otp
    });
    res.cookie('temp_token', temp_token);
    await sendotp(user_obj.email,$otp);
    return res.redirect('/otp');//after redirecting req.user will be lost , so we use query params or cookies or sessions to store user data
}
module.exports = { handlecreateuser }; 