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
exports.markAsRead = exports.getMessages = exports.sendMessage = void 0;
const messageModel_1 = __importDefault(require("../models/messageModel"));
// Send a message
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { senderId, receiverId, content } = req.body;
    try {
        const newMessage = yield messageModel_1.default.create({
            sender: senderId,
            receiver: receiverId,
            content,
        });
        res.status(201).json(newMessage);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to send message", error });
    }
});
exports.sendMessage = sendMessage;
// Get messages between two users
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId1, userId2 } = req.params;
    try {
        const messages = yield messageModel_1.default.find({
            $or: [
                { sender: userId1, receiver: userId2 },
                { sender: userId2, receiver: userId1 },
            ],
        }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to retrieve messages", error });
    }
});
exports.getMessages = getMessages;
// Mark a message as read
const markAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { messageId } = req.params;
    try {
        yield messageModel_1.default.findByIdAndUpdate(messageId, { isRead: true });
        res.status(200).json({ message: "Message marked as read" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to mark message as read", error });
    }
});
exports.markAsRead = markAsRead;
