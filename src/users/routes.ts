import express from "express";
import { deleteUser, getAllUsers, getUser, putUser } from "./controller";
import { isSignInMiddleware, authorisationMiddleware } from "../config/middleware";
import { userActionsAuthorisationMiddleware } from "./middlewares";
import { UserRole } from "./model";

const router = express.Router();

router.get("/", isSignInMiddleware(), authorisationMiddleware([UserRole.Admin, UserRole.Teacher, UserRole.Student]), getAllUsers);
router.get("/:id", isSignInMiddleware(), authorisationMiddleware([UserRole.Admin, UserRole.Teacher, UserRole.Student]), getUser);
router.delete("/:id", isSignInMiddleware(), authorisationMiddleware([UserRole.Admin, UserRole.Teacher, UserRole.Student]), userActionsAuthorisationMiddleware(), deleteUser);
router.put("/:id", isSignInMiddleware(), authorisationMiddleware([UserRole.Admin, UserRole.Teacher, UserRole.Student]), userActionsAuthorisationMiddleware(), putUser);

export default router;
