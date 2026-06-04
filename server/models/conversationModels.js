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
    ]
},{
    timestamps:true
})

let Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;