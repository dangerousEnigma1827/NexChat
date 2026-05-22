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
    },
    lastTimeMessageSent:{
        type:Map,
        of:String
    },
    lastMessageSent:{
        type:Map,
        of:String
    },
    pfp:{
        type:String
    }
},{
    timestamps:true
})

let User = mongoose.model("User", userSchema);
export default User;