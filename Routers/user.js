const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
 
const User = require('../models/user.js');
const Report = require('../models/report.js');
const { getuser } = require('../services/auth.js');
const {handle_notifications}= require("../controllers/user_notification.js")
const {handle_explore}= require("../controllers/user_explore.js");
const {handleleaderboard}= require("../controllers/leaderboard.js");



// -------------------- MULTER SETUP --------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // make sure 'uploads/' exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(null, false); // silently ignore non-image files
};

const upload = multer({ storage, fileFilter });

// -------------------- DASHBOARD ROUTES --------------------

// User dashboard
router.get('/', async (req, res) => {
  try {
    const token = req.cookies.token;
    const temp_user = getuser(token);
    const myuser = await User.findById(temp_user.id);

    // const posts = await Report.find({}).sort({ createdAt: -1 });
 
    const posts = await Report.find()
  .populate('user', 'username') // populate only the username field from User
  .sort({ createdAt: -1 })
  .limit(30); // get only the latest 30 posts

  
  top_issues = [];
  top_issues = await Report.find()
  .populate('user', 'username') // populate only the username field from User
  .sort({ likes: -1 }) // sort by likes descending
  .limit(3); // get only the top 3 posts
  // console.log(top_issues);



//   posts.fl = myuser.username[0].toUpperCase();

    // console.log(posts);
    res.render('user_dashboard.ejs', { user: myuser, posts: posts,topPosts:top_issues });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// User profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.cookies.token;
    const temp_user = getuser(token);
    const myuser = await User.findById(temp_user.id);
    res.render('user_profile.ejs', { user: myuser });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Update user bio
router.post('/update', async (req, res) => {
  try {
    const token = req.cookies.token;
    const temp_user = getuser(token);
    const { bio } = req.body;
    await User.findByIdAndUpdate(temp_user.id, { bio: bio });
    res.redirect('/user/profile');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// -------------------- REPORT ROUTES --------------------






// Submit report page
router.get('/submit_report', (req, res) => {
  res.render('usersubmitreport'); // Your EJS page for submitting a report
});

// Handle report submission with optional image
router.post('/submit_report', upload.single('image'), async (req, res) => {
  try {
    console.log(req.body);
    const { report } = req.body;
    const {department,title,category,priority,location,latitude,longitude} = req.body;
    if (department) {
      const map_me_dikhana = true;
    }
    const image = req.file ? req.file.filename : null;

    const token = req.cookies.token;
    const temp_user = getuser(token);

    const newReport = new Report({
      text: report,
      image: image,
      user: temp_user.id, // reference to user
      department: department || null,
      title: title || null,
      category: category || null,
      priority: priority || null,
      location: location || null,
      map_me_dikhana: department ? true : false,
      latitude: latitude || 0,
      longitude: longitude || 0,
      geolocation: {
        type: 'Point',
        coordinates: [parseFloat(longitude) || 0, parseFloat(latitude) || 0]
      }
    });
    console.log(newReport);

    await newReport.save();
    res.redirect('/user'); // redirect to dashboard after submission
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});



router.get("/reports",async (req,res)=>{
   const token = req.cookies.token;
   const temp_user = getuser(token);
  //  console.log(temp_user);
const userReports = await Report.find({
  user: temp_user.id,             // filter by user ID
  map_me_dikhana: true       // filter where map_me_dikhana is true
})
  .populate('user', 'username') // populate only username from User
  .sort({ createdAt: -1 })      // sort by latest first
  .limit(30);                   // limit to 30 results
  // console.log(userReports)
   res.render("user_reports",{posts:userReports , user:temp_user})
})

router.get('/notifications',handle_notifications);
router.get('/explore', handle_explore);
router.get('/leaderboard', handleleaderboard );


router.post('/notifications/delete/:index', async (req, res) => {
  try {
    const token = req.cookies.token;
    const current_user = await getuser(token);
    if (!current_user) {
      return res.redirect('/userlogin');
    }
    const my_user = await User.findById(current_user.id);
    const index = parseInt(req.params.index, 10);
    if (isNaN(index) || index < 0 || index >= my_user.notifications.length) {
      return res.status(400).send('Invalid notification index');
    }
    my_user.notifications.splice(index, 1);
    await my_user.save();
    res.redirect('/user/notifications');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// -------------------- LOGOUT --------------------
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/userlogin');
});

module.exports = router;
