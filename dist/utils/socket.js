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
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSockets = void 0;
const messageController_1 = require("../controller/messageController");
const initializeSockets = (io) => {
    console.log('Initializing sockets...');
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);
        socket.on('sendMessage', (data) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { sender, receiver, content } = data;
                const newMessage = yield (0, messageController_1.saveMessage)(sender, receiver, content);
                io.to(receiver).emit('receiveMessage', newMessage);
                console.log('Message sent:', newMessage);
            }
            catch (error) {
                console.error('Error sending message:', error);
            }
        }));
        socket.on('joinRoom', (roomId) => {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room: ${roomId}`);
        });
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};
exports.initializeSockets = initializeSockets;
