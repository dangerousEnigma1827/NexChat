import mongoose, { Mongoose } from "mongoose";

let conversationSchema = new mongoose.Schema({
    type:{
        type:String,
        enum:["private", 'group'],
        default:"private"
    },
    participants:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    groupName:{
        type:String,
        default:""
    },
    groupIcon: {
        type: String,
        default: ""
    },

    groupAdmin: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        }
    ],
    lastMessageSent:{
        type:String,
        default:""
    },
    lastTimeMessageSent:{
        type: Date,
        default:""
    },
    lastMessageSentBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},{
    timestamps:true
})

let Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;