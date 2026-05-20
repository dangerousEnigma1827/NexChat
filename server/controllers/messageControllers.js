import { get } from "mongoose";
import Message from "../models/messageModels.js";
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
        console.log("backend tak")
        let messageSent = await Message.create(req.body);
        console.log(messageSent)
        res.json(messageSent)
        io.to(req.body.recieverId).emit("recieve_message", {
            "message":messageSent.message,
            "recieverId":messageSent.recieverId,
            "senderId":messageSent.senderId
        })

        console.log("sent to sender")
    }catch(err){
        console.log("error sending message to frontend from backend", err)
    }
}
