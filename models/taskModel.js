const mongoose=require("mongoose")

const taskmodel=new mongoose.Schema({
    name: {
        type: String,
      },
      completed: {
        type: Boolean,
        default: false,
      },
      user:{type:mongoose.Schema.ObjectId ,ref:"user"}
},{timestamps:true})

module.exports=mongoose.model("task",taskmodel)