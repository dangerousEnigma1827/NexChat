import userModels from '../models/userModels.js'
import conversationModels from '../models/conversationModels.js'
import Message from '../models/messageModels.js'
import io from '../server.js'

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
            groupDescription : req.body.groupDescription,
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
        )
        .populate("participants")
        .populate("lastMessageSentBy")
        .populate("groupAdmin")
        .populate("lastMessageSent")
        .sort({lastTimeMessageSent : -1})

        res.json(allconversations)
    }catch(err){
        console.log("error getting all convos", err)
    }
}

export const getAllMessagesOfAConversation = async (req,res) => {
    try{

        let userId = req.user._id; // from auth middleware

        let allmessagesOfAConversationReq = await Message.find({
            conversationId: req.params.conversationId,

            // hide messages deleted for this user
            deletedFor:{
                $ne:userId
            }

        })
        .populate('senderId')
        .sort({createdAt:1});


        res.json(allmessagesOfAConversationReq)

    }catch(err){
        console.log("error getting all messages of a convo", err)

        res.status(500).json({
            message:"Error getting messages"
        })
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
    try{
        let response = await conversationModels.find({
            type:"group",
            participants:{
                $all : [req.params.userA, req.params.userB],
            }
        }).populate("participants")

        res.json(response)
    }catch(err){
        return res.status(500).json({
            status:false,
            message:"Error getting all common groups",
            error:err.message
        })
    }
}

export const clickedConversation = async (req,res) => {
    const {userB, clickedMemberId} = req.params;
    try{
        let response = await conversationModels.find({
            participants : {
                $all : [userB,clickedMemberId ],
                $size:2
            }
        })

        res.json(response)
    }catch(err){
        console.log("error getting clicked conversation ",err)
    }
}

export const setAllConversationToSeen = async (req,res)=> {
    try{
        await Message.updateMany(
            {
                conversationId: req.body.conversationId,
                senderId: { $ne: req.user.userId },
                seenBy: { $ne: req.user.userId }
            },
            {
                $addToSet: {
                    seenBy: req.user.userId
                }
            }
        );

        io.to(req.body.conversationId.toString())
        .emit(
            "messages_seen",
            {
                conversationId:req.body.conversationId,
                userId:req.user.userId
            }
        )

    }catch(err){
        console.log("erorr setting seen in bkd", err)
    }
}