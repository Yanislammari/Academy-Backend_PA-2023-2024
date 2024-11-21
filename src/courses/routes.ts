import express from "express";
import { addExercise, addLesson, createCourse, deleteCourse, getCourses, getCourseById, removeExercise, removeLesson, updateCourse, updateLesson } from "./controller";
import { uploadCourse, uploadLesson } from "../config/uploads";
import { authorisationMiddleware, isSignInMiddleware } from "../config/middleware";
import { UserRole } from "../users/model";
import { checkCourseOwnershipMiddleware, courseActionsAuthorisationMiddleware } from "./middlewares";

const router = express.Router();

router.get("/", isSignInMiddleware(), authorisationMiddleware([UserRole.Admin, UserRole.Teacher, UserRole.Student]), getCourses);
router.get("/:courseId", isSignInMiddleware(), authorisationMiddleware([UserRole.Admin, UserRole.Teacher, UserRole.Student]), getCourseById);
router.post("/createCourse/:teacherID", isSignInMiddleware(), authorisationMiddleware([UserRole.Admin, UserRole.Teacher]), checkCourseOwnershipMiddleware(), uploadCourse, createCourse);
router.put("/update/:courseId", isSignInMiddleware(), authorisationMiddleware([UserRole.Admin, UserRole.Teacher]), courseActionsAuthorisationMiddleware(), updateCourse);
router.post("/addLesson/:courseId", isSignInMiddleware(), authorisationMiddleware([UserRole.Admin, UserRole.Teacher]), courseActionsAuthorisationMiddleware(), uploadLesson, addLesson);
router.post("/addExercise/:courseId", isSignInMiddleware(), authorisationMiddleware([UserRole.Admin, UserRole.Teacher]), courseActionsAuthorisationMiddleware(), addExercise);
router.delete("/delete/:courseId", isSignInMiddleware(), authorisationMiddleware([UserRole.Admin, UserRole.Teacher]), courseActionsAuthorisationMiddleware(), deleteCourse);
router.delete("/deleteExercise/:courseId/:exerciseId", isSignInMiddleware(), authorisationMiddleware([UserRole.Admin, UserRole.Teacher]), courseActionsAuthorisationMiddleware(), removeExercise);
router.delete("/deleteLesson/:courseId/:lessonId", isSignInMiddleware(), authorisationMiddleware([UserRole.Admin, UserRole.Teacher]), courseActionsAuthorisationMiddleware(), removeLesson);
router.put("/updateLesson/:courseId/:lessonId", isSignInMiddleware(), authorisationMiddleware([UserRole.Admin, UserRole.Teacher]), courseActionsAuthorisationMiddleware(), uploadLesson, updateLesson);

export default router;
