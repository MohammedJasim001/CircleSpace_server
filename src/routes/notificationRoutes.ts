import { Router } from "express";
import {
  createNotification,
  getNotifications,
  markNotificationAsRead,
} from "../controller/notificationController";
import tryCatchMiddleware from "../middlewares/tryCatchMiddleware";

const router = Router();

router.post("/create",tryCatchMiddleware(createNotification) );
router.get("/:userId",tryCatchMiddleware(getNotifications) );
router.patch("/read/:notificationId",tryCatchMiddleware(markNotificationAsRead) );

export default router;
