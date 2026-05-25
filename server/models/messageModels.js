import mongoose from "mongoose";

let attachmentSchema = new mongoose.Schema({
    url:String,
    type:{
        type:String,
        enum:["image", "video", "audio", "file"]
    },
    isDeletedForEveryone:{
        type:Boolean,
        default:false
    }
})

let messageSchema = new mongoose.Schema({
    "text":{
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
    "attachments" : [attachmentSchema],
    "isDeletedForEveryone" : {
        type:Boolean,
        default:false
    }
}, {
    timestamps:true
})

let Message = mongoose.model("Message", messageSchema);
export default Message;


// import mongoose from "mongoose";

// const attachmentSchema = new mongoose.Schema({
//     url: String,
//     type: {
//         type: String,
//         enum: ["image", "video", "audio", "file"]
//     }
// }, { _id:false });

// const messageSchema = new mongoose.Schema({
//     senderId:{
//         type: mongoose.Schema.Types.ObjectId,
//         ref:"User",
//         required:true
//     },

//     receiverId:{
//         type: mongoose.Schema.Types.ObjectId,
//         ref:"User",
//         required:true
//     },

//     chatId:{
//         type:String,
//         required:true,
//         index:true
//     },

//     text:{
//         type:String,
//         default:""
//     },

//     attachments:[attachmentSchema],

//     messageType:{
//         type:String,
//         enum:["text", "media", "mixed"],
//         default:"text"
//     },

//     seen:{
//         type:Boolean,
//         default:false
//     },

//     deletedForEveryone:{
//         type:Boolean,
//         default:false
//     }

// }, {
//     timestamps:true
// });

// const Message = mongoose.model("Message", messageSchema);

// export default Message;

// const messageSchema = new mongoose.Schema({
//     chatId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Chat",
//         index: true,
//         required: true
//     },

//     senderId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         required: true
//     },

//     // 💬 core content
//     text: {
//         type: String,
//         default: ""
//     },

//     // 📎 media system
//     attachments: [
//         {
//             url: String,
//             type: {
//                 type: String,
//                 enum: ["image", "video", "audio", "file"]
//             },
//             thumbnail: String,
//             size: Number
//         }
//     ],

//     // ↩️ reply system
//     replyTo: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Message",
//         default: null
//     },

//     // ✏️ edit system
//     editedAt: {
//         type: Date,
//         default: null
//     },

//     isEdited: {
//         type: Boolean,
//         default: false
//     },

//     // 🗑️ soft delete system
//     deletedFor: [
//         {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User"
//         }
//     ],

//     deletedForEveryone: {
//         type: Boolean,
//         default: false
//     },

//     // 😀 reactions system
//     reactions: [
//         {
//             userId: {
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: "User"
//             },
//             type: {
//                 type: String,
//                 enum: ["like", "love", "laugh", "wow", "sad", "angry"]
//             }
//         }
//     ],

//     // 📡 delivery tracking
//     status: {
//         type: String,
//         enum: ["sent", "delivered", "seen"],
//         default: "sent"
//     },

//     seenBy: [
//         {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User"
//         }
//     ]

// }, {
//     timestamps: true
// });