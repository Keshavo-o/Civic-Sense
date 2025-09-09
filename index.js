const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const path = require('path');
const{handlecreateuser}=require("./controllers/signup_controller.js");
const{handleloginform}=require("./controllers/login_controller.js");
const{restrictoLoginuseronly}=require("./middlewares/auth.js");
const{handlecomments } =require("./controllers/handle_comments.js");
const{handlelike} = require("./controllers/handle_like.js")
const{publicmapcontroller} = require("./controllers/publicmap.js")

const{post_controller} = require("./controllers/post_controller_public.js");
// const{verifyotp}=require("./services/otp_service.js");
const{verifyotp}=require("./controllers/otp_controller.js");
const cookieParser = require('cookie-parser');
const userrouter=require("./Routers/user.js");



mongoose.connect('mongodb://localhost:27017/JanSetu').then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});



app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());





app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));


app.use("/user", restrictoLoginuseronly);//here we need to restrict environment for /user router only


app.get('/', (req, res) => {
  res.render('landing_page');
});
app.get('/about', (req, res) => {
  res.render('about');
});
app.get('/contact', (req, res) => {
  res.render('contact');
});
app.get('/userlogin', (req, res) => {
   const token = req.cookies.token;
    if (token) {
        return res.redirect("/user");
    }
  res.render('userLogin');
});
app.get('/signup', (req, res) => {
  res.render('usersignup');
});
app.get('/otp', (req, res) => {
  res.render('otp');
});
app.get('/map-view',publicmapcontroller);


app.use('/user',userrouter);
app.get('/users/:id', async (req, res) => {
  return res.send("User profile page coming soon , id : "+ req.params.id);
});

app.get('/posts/:post_id', post_controller);

app.post('/usersignup',handlecreateuser);
app.post('/userlogin', handleloginform);
app.post('/otp', verifyotp);
app.post("/posts/:post_id/comment",handlecomments);
app.get("/posts/:post_id/like",handlelike);


// app.get('/logout', (req, res) => {
//     res.clearCookie('token');
//     res.redirect('/login');
// });


app.get('*splat', (req, res) => {
  res.render('404');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});