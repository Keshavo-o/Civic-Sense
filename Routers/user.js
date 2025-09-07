const express = require('express');
const router = express.Router();
const{ getuser } = require("../services/auth.js")
router.get('/', (req, res) => {
    const token = req.cookies.token;
    const user = getuser(token);
    // console.log(user);
    res.render('user_dashboard.ejs', { user: user });
});
router.get('/profile', (req, res) => {
    const token = req.cookies.token;
    const user = getuser(token);
    // console.log(user);
    res.render('user_profile.ejs', { user: user });
});
module.exports = router;