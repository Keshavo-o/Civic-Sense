const jsw = require("jsonwebtoken");
const secret_key="Keshav@123"//this secrert key is need to be protected
function setuser(user){
    const payload = {
        id: user.id,
        email: user.email,
        name : user.username
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