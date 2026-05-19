import Message from "../models/messageModels.js";

let socketHandler = (io) => {
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("join", (userId) => {
            socket.join(userId);
            console.log("JOINED ROOM:", userId);
        });

        socket.on("send_message", async (data) => {
            console.log("Message:", data);
            console.log(data.receiverId)
            io.to(data.receiverId).emit("receive_message", data)
            io.to(data.senderId).emit("receive_message", data)

            try{
                let messageCreated = await Message.create({
                    "senderId":data.senderId,
                    "message":data.message,
                    "receiverId":data.receiverId,
                    "chatId":[data.senderId, data.receiverId].sort().join("-")
                })

                console.log("created message in db");
            }catch(err){
                console.log("eror occurced creating message document in backend ",err)
            }

            console.log("sent to fr")
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
}

export default socketHandler