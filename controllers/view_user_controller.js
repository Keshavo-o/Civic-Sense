const Report = require('../models/report.js');
const User = require('../models/user.js');
const { getuser } = require('../services/auth.js');
async function handleusershow_ (req, res) {
    try {
    const id=req.params.id;
    const user = await User.findById(id);
    if (!user) {
        return res.status(404).send('User not found');
    }
    const token = req.cookies.token;
    const temp_user = getuser(token);
    const myuser = await User.findById(temp_user.id);
    res.render('public_user_profile', { user, myuser });
    } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
    }
}
module.exports = { handleusershow_ }; 