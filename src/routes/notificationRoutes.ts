import { Router } from "express";
import {
  createNotification,
  getNotifications,
  markNotificationAsRead,
} from "../controller/notificationController";

const router = Router();

router.post("/create", createNotification);
router.get("/:userId", getNotifications);
router.patch("/read/:notificationId", markNotificationAsRead);

export default router;
