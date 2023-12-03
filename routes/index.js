var express = require('express');
var router = express.Router();

const userModel = require('../models/userModel');
// const { render } = require('ejs');


/* GET home page. */
router.get('/', async function(req, res, next) {
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
