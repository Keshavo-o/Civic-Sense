const user = require("../models/user");
const{setuser,
    getuser}=require("../services/auth");
const {
  hashPassword,
  verifyPassword
} = require("../services/password_encryption.js");

async function handleloginform(req, res) {
    // const token = req.cookies.token;
    // if (token) {
    //     return res.redirect("/user");
    // }
    const user_obj = req.body;
    // console.log(user_obj);
    const password = user_obj.password;
    const userData = await user.findOne({ email:user_obj.email });
    // console.log(userData);
    if (!userData) {
        return res.render("userLogin", { error: "Invalid email or password" });
    }
        // console.log(userData);
        const isPasswordValid=verifyPassword(password,userData.salt,userData.password);
        if (!isPasswordValid) {
            return res.render("userLogin", { error: "Invalid email or password" });
        }
        
        const token = setuser(userData);
        res.cookie('token', token);
    return res.redirect("/user");
}
module.exports = { handleloginform }; 