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
exports.markNotificationAsRead = exports.getNotifications = exports.createNotification = void 0;
const notificationModel_1 = __importDefault(require("../models/notificationModel"));
// Create a notification
const createNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, type, message } = req.body;
    try {
        const newNotification = yield notificationModel_1.default.create({
            user: userId,
            type,
            message,
        });
        res.status(201).json(newNotification);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to create notification", error });
    }
});
exports.createNotification = createNotification;
// Get notifications for a user
const getNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const notifications = yield notificationModel_1.default.find({ user: userId }).sort({
            createdAt: -1,
        });
        res.status(200).json(notifications);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to retrieve notifications", error });
    }
});
exports.getNotifications = getNotifications;
// Mark notification as read
const markNotificationAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { notificationId } = req.params;
    try {
        yield notificationModel_1.default.findByIdAndUpdate(notificationId, { isRead: true });
        res.status(200).json({ message: "Notification marked as read" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to mark notification as read", error });
    }
});
exports.markNotificationAsRead = markNotificationAsRead;
