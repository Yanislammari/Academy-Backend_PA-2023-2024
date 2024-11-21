import { Router } from "express";
import { sendMessage, fetchMessages, fetchConversations } from "./controller";
import { isSignInMiddleware, authorisationMiddleware } from "../config/middleware";
import { fetchConversationsMiddleware, fetchMessagesMiddleware, sendMessageMiddleware } from "./middlewares";
import { UserRole } from "../users/model";

const router: Router = Router();

router.post("/send", isSignInMiddleware(), authorisationMiddleware([UserRole.Admin, UserRole.Teacher, UserRole.Student]), sendMessageMiddleware(), sendMessage);
router.get("/fetch", isSignInMiddleware(), authorisationMiddleware([UserRole.Admin, UserRole.Teacher, UserRole.Student]), fetchMessagesMiddleware(), fetchMessages);
router.get("/conversations/:userId", isSignInMiddleware(), authorisationMiddleware([UserRole.Admin, UserRole.Teacher, UserRole.Student]), fetchConversationsMiddleware(), fetchConversations);

export default router;
