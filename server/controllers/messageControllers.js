import { get } from "mongoose";
import Message from "../models/messageModels.js";
import User from "../models/userModels.js";
import Conversation from "../models/conversationModels.js";
import io from '../server.js'

export const sendMessage = async (req,res)=>{
    console.log("recieved");
    console.log(req.body)
    try{
        let messageSent = await Message.create(req.body);
        
        let updateLastConversationReq = await Conversation.findOneAndUpdate(
            {
                _id : req.body.conversationId
            },
            {
                lastMessageSent:req.body.text,
                lastTimeMessageSent:new Date(),
                lastMessageSentBy:req.body.senderId
            },
            {
                new:true
        })

        res.json(messageSent)
        io.to(req.body.recieverId).emit("recieve_message", messageSent)
    }catch(err){
        console.log("error sending message to frontend from backend", err)
    }
}

export const clearChatInBackend = async (req,res)=>{
    try{
        let clearedMessages = await Message.deleteMany({
            conversationId:req.params.conversationId
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
            }, {new:true}
        )
        let recieverId = editFromBackend.recieverId;
        io.to(recieverId).emit("recieve_message", editFromBackend)
        res.json(editFromBackend)
    }catch(err){
        console.log("error occured editing message in backend", err)
    }
}