import express from "express";
import { register, login, decodeToken } from "./controller";
import { uploadUser } from "../config/uploads";

const router = express.Router();

router.post("/register", uploadUser, register);
router.post("/login", login);
router.get("/", decodeToken);

export default router;
