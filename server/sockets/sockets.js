import Conversation from "../models/conversationModels.js";

let onlineUsers = new Set();

let socketHandler = (io) => {
    io.on("connection", (socket) => {

        socket.on("join", async (userId) => {
            try {
                if(!userId) return;
                socket.userId = userId;

                // personal room
                socket.join(userId);

                // get all conversations of this user
                let conversations = await Conversation.find({
                    participants: userId
                }).select("_id");

                // join every conversation room
                conversations.forEach((conversation)=>{
                    socket.join(conversation._id.toString());
                });

                onlineUsers.add(userId);

                io.emit("online_users", [...onlineUsers]);
                // console.log(
                //     userId,
                //     "joined",
                //     conversations.length,
                //     "conversation rooms"
                // );
            } catch(err){
                console.log("socket join error",err);
            }
        });



        socket.on("disconnect",()=>{
            if(socket.userId){
                onlineUsers.delete(socket.userId);
            }

            io.emit("online_users",[...onlineUsers]);
        });

    });
}


export default socketHandler;