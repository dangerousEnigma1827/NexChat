import mongoose from "mongoose";

let userSchema = new mongoose.Schema({
    username:{
        type:String,
        required: true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

let User = mongoose.model("User", userSchema);
export default User;