const jsw = require("jsonwebtoken");
const secret_key="Keshav@123"//this secrert key is need to be protected
function setuser(user){
    const payload = {
        username: user.username,
        email: user.email,
        password: user.password,
        otp: user.otp
    };
    const token = jsw.sign(payload, secret_key);
    return token;
}
function getuser(token){
    return jsw.verify(token, secret_key);
}
module.exports = {
    setuser,
    getuser
};