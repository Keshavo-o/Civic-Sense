const{setuser,
    getuser
} = require("../services/auth.js"); 
async function restrictoLoginuseronly(req,res,next){
    if(req.path=="/userlogin" || req.path=="/signup" || req.path=="/usersignup" || req.path=="/userlogin" || req.path=="/otp"
        || req.path=="/" || req.path=="/about" || req.path=="/contact"
    ){
        return next();
    }
    // console.log("Inside restrictoLoginuseronly");
    const token = req.cookies.token;
    if(!token){
        return res.redirect("/userlogin");
    }
    else//else is required here as without token defined get user will malfunction as invalid syntax would be passed there
        {
        const user = getuser(token);
        if(!user){
            return res.redirect("/userlogin");
        }
        req.user = user;
    }
    // console.log("exiting restrictoLoginuseronly");
    next();
}
module.exports = {
    restrictoLoginuseronly
};