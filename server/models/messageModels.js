import mongoose from "mongoose";

let messageSchema = new mongoose.Schema({
    "message":{
        type:String,
        required: true
    },
    "senderId":{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },"recieverId":{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    "chatId":{
        type:String
    }
}, {
    timestamps:true
})

let Message = mongoose.model("Message", messageSchema);
export default Message;