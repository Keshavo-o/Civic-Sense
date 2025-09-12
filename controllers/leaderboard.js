const Report = require('../models/report.js');
const User = require('../models/user.js');
const { getuser } = require('../services/auth.js');
async function handleleaderboard(req, res) {
    // res.send("Leaderboard Page is under construction");
     try {
    const token = req.cookies.token;
    const temp_user = getuser(token);
    const myuser = await User.findById(temp_user.id);
    const my_users = await User.find().sort({ points: -1 }).limit(50);
    console.log(myuser);
    res.render('leaderboard.ejs', {user: myuser, users: my_users });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}
module.exports = { handleleaderboard }; 