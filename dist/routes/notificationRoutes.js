"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notificationController_1 = require("../controller/notificationController");
const router = (0, express_1.Router)();
router.post("/create", notificationController_1.createNotification);
router.get("/:userId", notificationController_1.getNotifications);
router.patch("/read/:notificationId", notificationController_1.markNotificationAsRead);
exports.default = router;
