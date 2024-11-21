import { Request, Response, NextFunction } from "express";
import { getUserByToken } from "../config/middleware";
import { UserRole } from "../users/model";
import repository from "./repository";

export function checkCommentOwnershipMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    const user = await getUserByToken(token as string);
    const commentUserId = req.body.userId;
    if(user.id !== commentUserId) {
      return res.status(401).json({ error: "You have to comment with your account !" });
    }

    next();
  }
}

export function commentActionsAuthorisationMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    const user = await getUserByToken(token as string);

    if(user.role !== UserRole.Admin) {
      const commentId = req.params.id;
      const comment = await repository.get(commentId);
      if(user.id !== comment.userId) {
        return res.status(401).json({ error: "You cant do that because is not your comment !" });
      }
    }

    next();
  }
}
