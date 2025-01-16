import { Router } from "express";
import { sendMessage, getRecentChatUsers, getRecentChatMessages } from "../controller/messageController";
import tryCatchMiddleware from "../middlewares/tryCatchMiddleware";

const router = Router();

router.post("/send",tryCatchMiddleware(sendMessage) );
router.get("/:userId",tryCatchMiddleware(getRecentChatMessages) );
// router.patch("/read/:messageId",tryCatchMiddleware(markAsRead) );
router.get('/resentchats/:userId',tryCatchMiddleware(getRecentChatUsers))

export default router;
