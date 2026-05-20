import Message from "../models/messageModels.js";

let onlineUsers = new Set();

let socketHandler = (io) => {
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        let user_id;
        socket.on("join", (userId) => {
            user_id = userId
            socket.join(userId);
            console.log("JOINED ROOM:", userId);
            onlineUsers.add(userId);
            io.emit("online_users", [...onlineUsers])
        });


        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
            onlineUsers.delete(user_id)
            io.emit("online_users", [...onlineUsers])
        });
    });
}

export default socketHandler