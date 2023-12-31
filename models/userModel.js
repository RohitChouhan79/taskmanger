const mongoose = require('mongoose');
const plm=require("passport-local-mongoose");


const TaskSchema = new mongoose.Schema({
  username:{
    type:String,
    unique:true,
    required: [true, "Username is required!"],
    minLength: [4, "Username field must have atleast 4 characters"],
},
email:{
    type:String,
    lowercase:true,
    required:[true,"Email is required!"],
    match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
    ],
},
password:{
    type:String,
},
token:{
    type:String,
    default:-1,
},
  name: {
    type: String,
    required: [true, 'must provide name'],
    trim: true,
    maxlength: [20, 'name can not be more than 20 characters'],
  },
  completed: {
    type: Boolean,
    default: false,
  },
})

TaskSchema.plugin(plm);

module.exports = mongoose.model('task', TaskSchema);


