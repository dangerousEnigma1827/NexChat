import Message from "../models/messageModels.js";

let socketHandler = (io) => {
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("join", (userId) => {
            socket.join(userId);
            console.log("JOINED ROOM:", userId);
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
}

export default socketHandler