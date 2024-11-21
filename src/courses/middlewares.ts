import { Request, Response, NextFunction } from "express";
import { getUserByToken } from "../config/middleware";
import { UserRole } from "../users/model";
import repository from "../courses/repository";

export function checkCourseOwnershipMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    const user = await getUserByToken(token as string);
    const id = req.params.teacherID;
    if(user.id !== id) {
      return res.status(401).json({ error: "You cant create course beacause is not your account !" });
    }

    next();
  }
}

export function courseActionsAuthorisationMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    const user = await getUserByToken(token as string);

    if(user.role !== UserRole.Admin) {
      const courseId = req.params.courseId;
      const course = await repository.get(courseId);
      if(user.id !== course.teacherID) {
        return res.status(401).json({ error: "You cant do that because is not your course !" });
      }
    }

    next();
  }
}
