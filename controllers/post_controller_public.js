const{setuser,
    getuser}=require("../services/auth");
const Report = require('../models/report.js');
async function post_controller(req, res) {
    // console.log(req.params.post_id);
    // console.log(req.params.post_id);
    // return res.send("Specific post page coming soon , id : "+ req.params.post_id);
    const my_report = await Report.findById(req.params.post_id).populate('user', 'username');
    // console.log(my_report);
    const token = req.cookies.token;
    const user = getuser(token);
    // console.log(user);
    return res.render('view_specific_report_public', { user: user, post: my_report });

}
module.exports = { post_controller }; 