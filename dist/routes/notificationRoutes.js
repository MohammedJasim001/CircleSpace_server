"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notificationController_1 = require("../controller/notificationController");
const tryCatchMiddleware_1 = __importDefault(require("../middlewares/tryCatchMiddleware"));
const router = (0, express_1.Router)();
router.post("/create", (0, tryCatchMiddleware_1.default)(notificationController_1.createNotification));
router.get("/:userId", (0, tryCatchMiddleware_1.default)(notificationController_1.getNotifications));
router.patch("/read/:notificationId", (0, tryCatchMiddleware_1.default)(notificationController_1.markNotificationAsRead));
exports.default = router;
