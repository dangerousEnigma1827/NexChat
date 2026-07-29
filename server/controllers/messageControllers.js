import { get } from "mongoose";
import Message from "../models/messageModels.js";
import User from "../models/userModels.js";
import Conversation from "../models/conversationModels.js";
import io from '../server.js'

export const sendMessage = async (req,res)=>{
    try{
        let messageSent = await Message.create(req.body);
        
        let updateLastConversationReq = await Conversation.findOneAndUpdate(
            {
                _id : req.body.conversationId
            },
            {
                lastMessageSent:messageSent._id,
                lastTimeMessageSent:new Date(),
                lastMessageSentBy:req.body.senderId
            },
            {
                returnDocument:"after"
            }
        )
        console.log("msg sent to ", req.body.conversationId.toString())
        console.log("msg is ", msg)

        io.to(req.body.conversationId.toString()).emit("recieve_message", messageSent)
        res.json(messageSent)

    }catch(err){
        console.log("error sending message to frontend from backend", err)
    }
}

export const clearChatInBackend = async (req,res)=>{
    try{
        let clearedMessages = await Message.deleteMany({
            conversationId:req.params.conversationId
        })

        await Conversation.findByIdAndUpdate(
            req.params.conversationId,
            {
                lastMessageSent:null,
                lastTimeMessageSent:null,
                lastMessageSentBy:null
            }
        )
        res.json(clearedMessages)
    }catch(err){
        console.log("err deleting chatss in backend", err)
    }
}

export const deleteFromBackendController = async (req, res) => {
    try {

        const {
            typeOf,
            messageToDelete,
            attachmentUrlForDeletion
        } = req.body


        let updatedMessage


        if(typeOf === "text"){

            updatedMessage = await Message.findByIdAndUpdate(
                messageToDelete,
                {
                    text:"This Message Was Deleted",
                    isDeletedForEveryone:true
                },
                {
                   returnDocument:"after"
                }
            )

        }


        if(typeOf === "attachment"){

            updatedMessage = await Message.findOneAndUpdate(
                {
                    _id:messageToDelete,
                    "attachments.url":attachmentUrlForDeletion
                },
                {
                    $set:{
                        "attachments.$.isDeletedForEveryone":true,
                        "attachments.$.url":""
                    }
                },
                {
                    returnDocument:"after"
                }
            )

        }


        if(!updatedMessage){
            return res.status(404).json({
                message:"Message not found"
            })
        }


        res.json(updatedMessage)


    }catch(err){

        console.log("error deleting message",err)

        res.status(500).json({
            message:"Server error"
        })

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
            }, {returnDocument:"after"}
        )
        let recieverId = editFromBackend.recieverId;
        io.to(recieverId).emit("recieve_message", editFromBackend)
        res.json(editFromBackend)
    }catch(err){
        console.log("error occured editing message in backend", err)
    }
}
