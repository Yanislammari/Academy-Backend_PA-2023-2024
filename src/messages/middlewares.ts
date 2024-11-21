import { Request, Response, NextFunction } from "express";
import { getUserByToken } from "../config/middleware";

export function sendMessageMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    const user = await getUserByToken(token as string);
    const sender = req.body.sender;

    if(user.id !== sender) {
      return res.status(401).json({ error: "You cant send this message beacause it's not your account !" });
    }

    next();
  }
}

export function fetchMessagesMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    const user = await getUserByToken(token as string);
    const user1 = req.query.user1;
    const user2 = req.query.user2;

    if(user.id !== user1 && user.id !== user2) {
      return res.status(401).json({ error: "You are not concerned by this conversation !" });
    }

    next();
  }
}

export function fetchConversationsMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    const user = await getUserByToken(token as string);
    const id = req.params.userId;

    if(user.id !== id) {
      return res.status(401).json({ error: "You cannot get conversations of this account !" });
    }

    next();
  }
}
