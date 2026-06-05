import userModels from '../models/userModels.js'
import conversationModels from '../models/conversationModels.js'
import Message from '../models/messageModels.js'

export const conversationAdd = async (req,res) => {
    try{
        let doesConvoexist = await conversationModels.find({
            participants: {
                $all:[req.user._id, req.body.selectedUserFromSearch],
                $size:2
            }
        })
        if(!doesConvoexist[0]){
            console.log("new created")
            let newconvo = await conversationModels.create({
                type:"private",
                participants: [req.user.userId, req.body.selectedUserFromSearch],
            })

            res.json(newconvo)
        }else{
            res.json(doesConvoexist)
        }
        
    }catch(err){
        console.log("error starting convo in bckd", err)
    }
}

export const getAllConversations = async (req,res) => {
    try{
        let allconversations = await conversationModels.find(
            {
                participants : req.user.userId
            }
        ).populate("participants")
        console.log(allconversations)
        res.json(allconversations)
    }catch(err){
        console.log("error getting all convos", err)
    }
}

export const getAllMessagesOfAConversation = async (req,res) => {
    try{
        let allmessagesOfAConversationReq = await Message.find(
            {
                conversationId : req.params.conversationId
            }
        )
        console.log("wertyu")
        console.log(allmessagesOfAConversationReq)
        res.json(allmessagesOfAConversationReq)
    }catch(err){
        console.log("error getting all messages of a convo", err)
    }
}
