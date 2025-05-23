import { Server } from "socket.io";
import Message from "../models/messageModel";

const onlineUsers = new Map();

export const initializeSockets = (io: Server) => {
  console.log("Initializing sockets...");

  io.on("connection", (socket) => {
    socket.on("connected", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log('user connected: ',userId);
      socket.on("sendMessage", async (data) => {
        try {
          const { sender, receiver, content } = data;
          const newMessage = await Message.create({
            sender,
            receiver,
            content,
          });
          console.log(newMessage,'new message');
          const recieverSocket = onlineUsers.get(receiver);
          if (recieverSocket) {
            io.to(recieverSocket).emit("receiveMessage", newMessage);
          }
          io.to(recieverSocket).emit("newNotification", newMessage);
        } catch (error) {
          console.error("Error sending message:", error);
        }
      });
    });

    socket.on("updateLatestMessages", ({ senderId, receiverId, message, timestamp }) => {
      io.emit("latestMessageUpdate", { senderId, receiverId, message, timestamp });
    });

    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room: ${roomId}`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
