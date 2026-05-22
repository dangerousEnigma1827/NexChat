import mongoose from "mongoose";

let messageSchema = new mongoose.Schema({
    "message":{
        type:String
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
    },
    "isImage":{
        type:Boolean
    },
    "imageList":[
        String
    ]
}, {
    timestamps:true
})

let Message = mongoose.model("Message", messageSchema);
export default Message;