var express = require('express');
var router = express.Router();
const User = require('../models/userModel');
const Task = require("../models/taskModel")

const passport = require("passport")
const LocalStrategy = require("passport-local")
passport.use(new LocalStrategy(User.authenticate()))

// const { render } = require('ejs');
const { sendmail } = require("../utils/sendmail");




/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('home', { admin: req.user });
});

router.get('/signup', function (req, res, next) {
  res.render('signup', { admin: req.user });
});

router.post('/signup', async function (req, res, next) {
  try {
    User.register({
      username: req.body.username, email: req.body.email
    }, req.body.password);
    res.redirect("/login")
  } catch (error) {
    console.log(error, 'signup error')
    res.send(error)
  }
});

router.get('/login', function (req, res, next) {
  res.render('login', { admin: req.user });
});



router.get('/forget', function (req, res, next) {
  res.render('forgetpasword', { admin: req.user });
});

router.post('/send-mail', async function (req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.send("User Not Found! <a href='/forget'>Try Again</a>")
    sendmail(user.email, user, req, res)
  } catch (error) {
    console.log(error)
    res.send(error)
  }
});

// Work on forget password option now
router.post('/forget/:id', async function (req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.send("User not Found! <a href='/forget'>");

    if (user.token == req.body.token) {
      user.token = -1;
      await user.setPassword(req.body.newpassword);
      await user.save()
      res.redirect("/login")
    } else {
      user.token = -1;
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
    successRedirect: "/index",
    failureRedirect: "/login",
  }),
  function (req, res, next) { }
)

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
}

router.get('/index', isLoggedIn, async function (req, res, next) {
  try {
    const { task } = await req.user.populate("task");
    console.log(task)
    res.render('index', { task:task });

  } catch (error) {
    console.log(error)
    res.send(error)
  }
});

router.post('/task', async function (req, res, next) {
  try {
    const tas = await Task(req.body);
    await req.user.task.push(tas._id)
    tas.user = req.user._id;
    await tas.save();
    await req.user.save()
    res.redirect("/index")
  } catch (error) {
    console.log(error)
    res.send(error)
  }
});

router.get("/delete/:id", isLoggedIn, async function (req, res, next) {
  try {
    const taskIndex = await req.user.task.findIndex((exp) => exp._id.toString() === req.params.id);
    req.user.task.splice(taskIndex, 1)
    await req.user.save()

    await Task.findByIdAndDelete()
    res.redirect("/index")
  } catch (error) {
    console.log(error)
    res.send(error)
  }
})

router.get('/update/:id',isLoggedIn,async function(req,res,next){
  const taskData= await Task.findById(req.params.id)
  res.render("update",{taskData:taskData})
})

router.post("/update/:id",isLoggedIn,async function(req,res,next){
  try {
    const UpdateTask= await Task.findByIdAndUpdate(req.params.id,{name:req.body.name})
    await UpdateTask.save()
    res.redirect("/index")
  } catch (error) {
    console.log(error)
    res.send(error)
  }
})


module.exports = router;
