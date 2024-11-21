import express from "express";
import { createComment, getComments, getCommentById, updateComment, deleteComment } from "./controller";
import { authorisationMiddleware, isSignInMiddleware } from "../config/middleware";
import { checkCommentOwnershipMiddleware, commentActionsAuthorisationMiddleware } from "./middlewares";
import { UserRole } from "../users/model";

const router = express.Router();

router.get("/", isSignInMiddleware(), authorisationMiddleware([UserRole.Admin, UserRole.Teacher, UserRole.Student]), getComments);
router.get("/:id", isSignInMiddleware(), authorisationMiddleware([UserRole.Admin, UserRole.Teacher, UserRole.Student]), getCommentById);
router.post("/", isSignInMiddleware(), authorisationMiddleware([UserRole.Admin, UserRole.Teacher, UserRole.Student]), checkCommentOwnershipMiddleware(), createComment);
router.put("/:id", isSignInMiddleware(), authorisationMiddleware([UserRole.Admin, UserRole.Teacher, UserRole.Student]), commentActionsAuthorisationMiddleware(), updateComment);
router.delete("/:id", isSignInMiddleware(), authorisationMiddleware([UserRole.Admin, UserRole.Teacher, UserRole.Student]), commentActionsAuthorisationMiddleware(), deleteComment);

export default router;
