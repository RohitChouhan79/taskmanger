var express = require('express');
var router = express.Router();
const User = require('../models/userModel');

const passport=require("passport")  
const LocalStrategy=require("passport-local")
passport.use(new LocalStrategy(User.authenticate()))

// const { render } = require('ejs');
const {sendmail}=require("../utils/sendmail")



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home',{admin:req.user});
});

router.get('/signup', function(req, res, next) {
  res.render('signup',{admin:req.user});
});

router.post('/signup',async function(req, res, next) {
  try {
     User.register({
      username:req.body.username,email:req.body.email
    },req.body.password);
    res.redirect("/login")
  } catch (error) {
    res.send(error)
  }
});

router.get('/login', function(req, res, next) {
  res.render('login',{admin:req.user});
});

router.post('/login',
  passport.authenticate("local",{
    successRedirect:"/profile",
    failureRedirect:"/sigin"
  }),
  function(req,res,next){}
);

router.get('/forget', function(req, res, next) {
  res.render('forgetpasword',{admin:req.user});
});

router.post('/send-mail', async function(req, res, next) {
  try {
    const user=await User.findOne({email:req.body.email});
    if(!user) return res.send("User Not Found! <a href='/forget'>Try Again</a>")
    sendmail(user.email,user,req,res)
  } catch (error) {
    console.log(error)
    res.send(error)
  }
});

// Work on forget password option now
router.post('/forget/:id', async function(req, res, next) {
  try {
    const user=await User.findById(req.params.id);
    if(!user)
      return res.send("User not Found! <a href='/forget'>");

    if (user.token==req.body.token){
      user.token=-1;
      await user.setPassword(req.body.newpassword);
      await user.save()
      res.redirect("/login")
    }else{
      user.token=-1;
      await user.save();
      res.send("Invalid OTP <a href='/forget'>")
    }
    
  } catch (error) {
    res.send(error)
  }
});

router.post(
  "/login",
  passport.authenticate("local", {
      successRedirect: "/profile",
      failureRedirect: "/login",
  }),
  function (req, res, next) {}
)

router.get('/profile', async function(req, res, next) {
  try {
    const task=await userModel.find();
  res.render('index',{task:task});
    
  } catch (error) {
    res.send(error)
  }
});

router.post('/task', async function(req, res, next) {
  try {
    const task = await userModel(req.body);
    await task.save();
    res.redirect('/')
  } catch (error) {
    
  }
});

module.exports = router;
