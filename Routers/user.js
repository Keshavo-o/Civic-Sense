const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const User = require('../models/user.js');
const Report = require('../models/report.js');
const { getuser } = require('../services/auth.js');

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


//   posts.fl = myuser.username[0].toUpperCase();

    // console.log(posts);
    res.render('user_dashboard.ejs', { user: myuser, posts: posts });
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
    const { report } = req.body;
    const image = req.file ? req.file.filename : null;

    const token = req.cookies.token;
    const temp_user = getuser(token);

    const newReport = new Report({
      text: report,
      image: image,
      user: temp_user.id, // reference to user
    });

    await newReport.save();
    res.redirect('/user'); // redirect to dashboard after submission
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
