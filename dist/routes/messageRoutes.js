"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const messageController_1 = require("../controller/messageController");
const router = (0, express_1.Router)();
router.post("/send", messageController_1.sendMessage);
router.get("/:userId1/:userId2", messageController_1.getMessages);
router.patch("/read/:messageId", messageController_1.markAsRead);
exports.default = router;
