import express from "express";
import { getEnrollments, getStudentEnrollements, enrollCourse, addLessonFinish, addExercisesSuccess, deleteEnrollment} from "./controller";
import { authorisationMiddleware, isSignInMiddleware } from "../config/middleware";
import { UserRole } from "../users/model";
import { checkEnrollmentUserIdAuthorisationMiddleware, checkIsStudentEnrolledAuthorisationMiddleware, checkStudentEnrollmentAuthorisationMiddleware, enrollCourseEnrollmentAuthorisationMiddleware } from "./middlewares";

const router = express.Router();

router.get("/", isSignInMiddleware(), authorisationMiddleware([UserRole.Admin, UserRole.Teacher, UserRole.Student]), getEnrollments);
router.get("/:studentId", isSignInMiddleware(), authorisationMiddleware([UserRole.Admin, UserRole.Teacher, UserRole.Student]), checkStudentEnrollmentAuthorisationMiddleware(), getStudentEnrollements);
router.post("/enrollCourse/:studentId/:courseId", isSignInMiddleware(), authorisationMiddleware([UserRole.Admin, UserRole.Teacher, UserRole.Student]), enrollCourseEnrollmentAuthorisationMiddleware(), enrollCourse);
router.post("/addLessonFinish/:enrollmentId/:lessonId", isSignInMiddleware(), authorisationMiddleware([UserRole.Admin, UserRole.Teacher, UserRole.Student]), checkIsStudentEnrolledAuthorisationMiddleware(), addLessonFinish);
router.post("/addExercisesSuccess/:enrollmentId", isSignInMiddleware(), authorisationMiddleware([UserRole.Admin, UserRole.Teacher, UserRole.Student]), checkIsStudentEnrolledAuthorisationMiddleware(), addExercisesSuccess);
router.delete("/:id", isSignInMiddleware(), authorisationMiddleware([UserRole.Admin, UserRole.Teacher, UserRole.Student]), checkIsStudentEnrolledAuthorisationMiddleware(), checkEnrollmentUserIdAuthorisationMiddleware(), deleteEnrollment);

export default router;
