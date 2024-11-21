import { Request, Response, NextFunction } from "express";
import { getUserByToken } from "../config/middleware";
import { UserRole } from "./model";

export function userActionsAuthorisationMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    const user = await getUserByToken(token as string);

    if(user.role !== UserRole.Admin) {
      const id = req.params.id;
      if(user.id !== id) {
        return res.status(401).json({ error: "You cant do that beacause is not your account !" });
      }
    }

    next();
  };
}
