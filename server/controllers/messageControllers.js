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

        io.to(req.body.recieverId).emit("recieve_message", messageSent)
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

export const deleteFromBackendController = async (req,res) => {
    try{
        let type = req.body.typeOf
        console.log(type)
        if(type == "text"){
            console.log("1")
            let deletefrombackend = await Message.findByIdAndUpdate(req.body.messageToDelete,{
                text : "This Message Was Deleted",
                isDeletedForEveryone:true
            }, {new:true})
            console.log("2")
            res.json(deletefrombackend)
        }

        if(type == "attachment"){
            let deletefrombackend = await Message.findOneAndUpdate({
                _id : req.body.messageToDelete,
                "attachments.url" : req.body.attachmentUrlForDeletion
            },
            {
                $set:{
                    "attachments.$.isDeletedForEveryone" : true,
                    "attachments.$.url":""
                }
            }, {new:true})
            console.log("2")

            res.json(deletefrombackend)
        }
    }catch(err){
        console.log("error deleting form frontend")
    }
}

export const editMessageController = async (req,res)=>{
    try{
        let editFromBackend = await Message.findByIdAndUpdate(
            req.body.messageId, 
            {
                $set:{
                    text : req.body.editedText,
                    isEdited:true
                }
            }
        )

        res.json(editFromBackend)
    }catch(err){
        console.log("error occured editing message in backend", err)
    }
}