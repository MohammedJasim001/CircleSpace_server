"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const messageController_1 = require("../controller/messageController");
const tryCatchMiddleware_1 = __importDefault(require("../middlewares/tryCatchMiddleware"));
const router = (0, express_1.Router)();
router.get("/:userId", (0, tryCatchMiddleware_1.default)(messageController_1.getRecentChatMessages));
// router.patch("/read/:messageId",tryCatchMiddleware(markAsRead) );
router.get('/resentchats/:userId', (0, tryCatchMiddleware_1.default)(messageController_1.getRecentChatUsers));
router.get('/chats/:user1/:user2', (0, tryCatchMiddleware_1.default)(messageController_1.getPersonalChat));
exports.default = router;
