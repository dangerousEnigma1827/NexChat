import { get } from "mongoose";
import Message from "../models/messageModels.js";
import User from "../models/userModels.js";
import io from '../server.js'

export const getMessages = async (req,res) => {
    try{
        let getAllMessagesFromBackend = await Message.find({
            $or:[
                {
                    senderId: req.params.currentUserId,
                    recieverId: req.params.userSeleted
                },
                {
                    recieverId: req.params.currentUserId,
                    senderId: req.params.userSeleted
                }
            ]
        })
        res.json(getAllMessagesFromBackend)
        console.log(getAllMessagesFromBackend)
    }catch(err){
        console.log("error while getting all messages", err)
    }
}

export const sendMessage = async (req,res)=>{
    try{
        let messageSent = await Message.create(req.body);
        res.json(messageSent)

        let sendingUser = await User.findByIdAndUpdate(
            messageSent.senderId,
            {
                $set:{
                    [`lastTimeMessageSent.${messageSent.recieverId}`] : new Date()
                }
            }
        );
        let sendingUserMessage = await User.findByIdAndUpdate(
            messageSent.senderId,
            {
                $set:{
                    [`lastMessageSent.${messageSent.recieverId}`] : messageSent.text
                }
            }
        );

        io.to(req.body.recieverId).emit("recieve_message", {
            "message":messageSent.text,
            "recieverId":messageSent.recieverId,
            "senderId":messageSent.senderId,
            "attachments":messageSent.attachments
        })

        console.log("sent to sender")
    }catch(err){
        console.log("error sending message to frontend from backend", err)
    }
}

export const clearChatInBackend = async (req,res)=>{
    try{
        let clearedMessages = await Message.deleteMany({
             $or:[
                {
                    senderId: req.params.currentUserId,
                    recieverId: req.params.userSeleted
                },
                {
                    recieverId: req.params.currentUserId,
                    senderId: req.params.userSeleted
                }
            ]
        })

        res.json(clearedMessages)
    }catch(err){
        console.log("err deleting chatss in backend", err)
    }
}
