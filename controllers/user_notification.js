// const Report = require('../models/report.js');
const user = require('../models/user.js');
const {setuser,
    getuser} = require('../services/auth.js');
async function handle_notifications(req, res) {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/login');
    }
    const current_user = await getuser(token);
    if (!current_user) {
        return res.redirect('/login');
    }
    // console.log(current_user);
    const my_user = await user.findById(current_user.id);
    // console.log(my_user);
    res.render('user_notifications', { user: my_user });
}
module.exports = { handle_notifications }; 