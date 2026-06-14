import userModels from '../models/userModels.js'
import conversationModels from '../models/conversationModels.js'
import Message from '../models/messageModels.js'

export const conversationAdd = async (req,res) => {
    try{
        let doesConvoexist = await conversationModels.find({
            participants: {
                $all:[req.user.userId, req.body.selectedUserFromSearch],
                $size:2
            }
        })
        if(!doesConvoexist[0]){
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

export const createNewGroup = async (req,res)=>{
    try{
        let addAGroup = await conversationModels.create({
            type:"group",
            participants : req.body.participants,
            groupName : req.body.groupName,
            groupIcon : req.body.groupIcon,
            groupAdmin : req.user.userId
        })

        res.json(addAGroup)
    }catch(err){
        console.log("error adding group", err)
    }
}

export const getAllConversations = async (req,res) => {
    try{
        let allconversations = await conversationModels.find(
            {
                participants : req.user.userId
            }
        ).populate("participants").populate("lastMessageSentBy")

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
        res.json(allmessagesOfAConversationReq)
    }catch(err){
        console.log("error getting all messages of a convo", err)
    }
}

export const getAllSingleUsers = async (req,res)=>{
    try{

        let allSingleUsersReq = await conversationModels.find({
            participants: req.user.userId
        }).populate('participants')

        let allSingleUsersArr = []

        allSingleUsersReq.forEach((conversation)=>{
            conversation.participants.forEach((participant)=>{
                if(participant._id != req.user.userId){
                    allSingleUsersArr.push(participant)
                }
            })
        })
        res.json(allSingleUsersArr)
    }catch(err){
        console.log("error while getting all singl users", err)
    }
}

export const getAllCommonGroups = async (req,res)=>{
    const {userA, userB} = req.params
    console.log(userA + " " + userB)
    try{
        let response = await conversationModels.find({
            type:"group",
            participants:{
                $all : [req.params.userA, req.params.userB],
            }
        }).populate("participants")

        console.log(response)
        res.json(response)
    }catch(err){
        return res.status(500).json({
            status:false,
            message:"Error getting all common groups",
            error:err.message
        })
    }
}