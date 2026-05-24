import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:[true,"Username must be Unique"],
        required:[true,"Username must be requried"]
    },
    email:{
        type:String,
        required:[true,"Email must be requried"],
        unique:[true,"Email must be Unique"]
    },
    password:{
        type:String,
        required:[true,"Password must be requried"]
    },
    verified:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})

const userModel = mongoose.model("users",userSchema)

export default userModel;