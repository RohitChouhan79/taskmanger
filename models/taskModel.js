const mongoose=require("mongoose")

const taskmodel=new mongoose.Schema({
    name: {
        type: String,
        // required: [true, 'must provide name'],
        trim: true,
        maxlength: [20, 'name can not be more than 20 characters'],
      },
      completed: {
        type: Boolean,
        default: false,
      },
      user:{type:mongoose.Schema.ObjectId ,ref:"user"}
},{timestamps:true})

module.exports=mongoose.model("task",taskmodel)