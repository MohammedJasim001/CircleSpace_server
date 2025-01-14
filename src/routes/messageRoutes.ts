import { Router } from "express";
import { sendMessage, getMessages, markAsRead } from "../controller/messageController";

const router = Router();

router.post("/send", sendMessage);
router.get("/:userId1/:userId2", getMessages);
router.patch("/read/:messageId", markAsRead);

export default router;
