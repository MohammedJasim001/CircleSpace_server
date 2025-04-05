import { Router } from "express";
import { getRecentChatUsers, getRecentChatMessages, getPersonalChat } from "../controller/messageController";
import tryCatchMiddleware from "../middlewares/tryCatchMiddleware";

const router = Router();
router.get("/:userId",tryCatchMiddleware(getRecentChatMessages) );
// router.patch("/read/:messageId",tryCatchMiddleware(markAsRead) );
router.get('/resentchats/:userId',tryCatchMiddleware(getRecentChatUsers))
router.get('/chats/:user1/:user2',tryCatchMiddleware(getPersonalChat))

export default router;