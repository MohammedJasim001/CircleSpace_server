import { Router } from "express";
import { sendMessage, getRecentChatUsers, getRecentChatMessages, getPersonalChat, saveMessage } from "../controller/messageController";
import tryCatchMiddleware from "../middlewares/tryCatchMiddleware";

const router = Router();
router.post("/send",tryCatchMiddleware(sendMessage) );
router.get("/:userId",tryCatchMiddleware(getRecentChatMessages) );
// router.patch("/read/:messageId",tryCatchMiddleware(markAsRead) );
router.get('/resentchats/:userId',tryCatchMiddleware(getRecentChatUsers))
router.get('/chats/:user1/:user2',tryCatchMiddleware(getPersonalChat))

export default router;
