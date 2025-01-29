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
exports.getPersonalChat = exports.getRecentChatUsers = exports.getRecentChatMessages = exports.sendMessage = exports.saveMessage = void 0;
const messageModel_1 = __importDefault(require("../models/messageModel")); // Assuming you have a Message model
// Save a message to the database
const saveMessage = (sender, receiver, content) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newMessage = new messageModel_1.default({
            sender,
            receiver,
            content,
            timestamp: new Date(),
        });
        yield newMessage.save();
        return newMessage;
    }
    catch (error) {
        throw new Error('Failed to save message');
    }
});
exports.saveMessage = saveMessage;
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sender, receiver, content } = req.body;
    try {
        const newMessage = new messageModel_1.default({
            sender,
            receiver,
            content,
            timestamp: new Date(),
        });
        yield newMessage.save();
        res.status(200).json({ message: 'Message sent successfully', data: newMessage });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to send message' });
    }
});
exports.sendMessage = sendMessage;
// Get recent chat messages for a specific user
const getRecentChatMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const messages = yield messageModel_1.default.find({
            $or: [{ sender: userId }, { receiver: userId }],
        })
            .populate('sender', 'userName profileImage')
            .populate('receiver', 'userName profileImage')
            .sort({ timestamp: -1 });
        res.status(200).json(messages);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to retrieve messages' });
    }
});
exports.getRecentChatMessages = getRecentChatMessages;
// Get a list of recent chat users (based on last message sent or received)
const getRecentChatUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const messages = yield messageModel_1.default.find({
            $or: [{ sender: userId }, { receiver: userId }],
        })
            .sort({ timestamp: -1 })
            .populate('sender', 'userName profileImage')
            .populate('receiver', 'userName profileImage');
        const recentChats = [];
        const seenUsers = new Set();
        messages.forEach((msg) => {
            const chatPartner = msg.sender._id.toString() === userId ? msg.receiver : msg.sender;
            if (!seenUsers.has(chatPartner._id.toString())) {
                recentChats.push({
                    chatPartner,
                    latestMessage: msg.content,
                    timestamp: msg.timestamp,
                });
                seenUsers.add(chatPartner._id.toString());
            }
        });
        res.status(200).json(recentChats);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch recent chat users' });
    }
});
exports.getRecentChatUsers = getRecentChatUsers;
//
const getPersonalChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user1, user2 } = req.params;
    try {
        const messages = yield messageModel_1.default.find({
            $or: [
                { sender: user1, receiver: user2 },
                { sender: user2, receiver: user1 }
            ]
        })
            .sort({ timestamp: 1 }) // Sort in ascending order (oldest to newest)
            .populate('sender', 'userName profileImage')
            .populate('receiver', 'userName profileImage');
        res.status(200).json(messages);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to retrieve chat messages' });
    }
});
exports.getPersonalChat = getPersonalChat;
