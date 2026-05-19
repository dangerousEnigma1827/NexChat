import { get } from "mongoose";
import Message from "../models/messageModels.js";

let getMessages = async (req,res) => {
    try{
        let getAllMessagesFromBackend = await Message.find({
            "chatId":req.params.chatId
        })
        res.json(getAllMessagesFromBackend)
        console.log(getAllMessagesFromBackend)
    }catch(err){
        console.log("error while getting all messages", err)
    }
}

export default getMessages