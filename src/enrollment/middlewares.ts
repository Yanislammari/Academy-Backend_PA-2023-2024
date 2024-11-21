import { Request, Response, NextFunction } from "express";
import { getUserByToken } from "../config/middleware";
import { UserRole } from "../users/model";
import repository from "../enrollment/repository";

export function checkStudentEnrollmentAuthorisationMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    const user = await getUserByToken(token as string);

    if(user.role === UserRole.Student) {
      const id = req.params.studentId;
      if(user.id !== id) {
        return res.status(401).json({ error: "You cant get enrollment of this student !" });
      }
    }

    next();
  }
}

export function enrollCourseEnrollmentAuthorisationMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    const user = await getUserByToken(token as string);
    const id = req.params.studentId;
    if(user.id !== id) {
      return res.status(401).json({ error: "You cant enroll this student for this course !" });
    }

    next();
  }
}

export function checkIsStudentEnrolledAuthorisationMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    const user = await getUserByToken(token as string);
    const enrollments = await repository.getAllByStudentId(user.id);
    const id = req.params.enrollmentId;
    let isStudentEnrolled = false;

    enrollments.forEach(enrollment => {
      if(enrollment.id === id) {
        isStudentEnrolled = true;
      }
    });

    if(!isStudentEnrolled) {
      return res.status(401).json({ error: "You are not enrolled for this course !" });
    }

    next();
  }
}

export function checkEnrollmentUserIdAuthorisationMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    const id = req.params.id;
    const user = await getUserByToken(token as string);
    const enrollment = await repository.get(id);
    
    if(!(user.id === enrollment.studentId)) {
      return res.status(401).json({ error: "You cant do actions in this enrollment !" });
    }

    next();
  }
}
