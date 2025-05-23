"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSockets = void 0;
const messageModel_1 = __importDefault(require("../models/messageModel"));
const onlineUsers = new Map();
const initializeSockets = (io) => {
    console.log("Initializing sockets...");
    io.on("connection", (socket) => {
        socket.on("connected", (userId) => {
            onlineUsers.set(userId, socket.id);
            console.log('user connected: ', userId);
            socket.on("sendMessage", (data) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const { sender, receiver, content } = data;
                    const newMessage = yield messageModel_1.default.create({
                        sender,
                        receiver,
                        content,
                    });
                    console.log(newMessage, 'new message');
                    const recieverSocket = onlineUsers.get(receiver);
                    if (recieverSocket) {
                        io.to(recieverSocket).emit("receiveMessage", newMessage);
                    }
                    io.to(recieverSocket).emit("newNotification", newMessage);
                }
                catch (error) {
                    console.error("Error sending message:", error);
                }
            }));
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
exports.initializeSockets = initializeSockets;
