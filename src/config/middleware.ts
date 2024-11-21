import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { JWTPayload } from "../auth/controller";
import repository from "../users/repository";
import { User, UserRole } from "../users/model";

dotenv.config();

const SECRET_KEY = process.env.SECRET;
const secretKey: string = SECRET_KEY as string;

function isJWTPayload(payload: any): payload is JWTPayload {
  return payload && typeof payload.id === "string";
}

export async function getUserByToken(token: string): Promise<User> {
  const decoded = jwt.verify(token, secretKey);
  if(isJWTPayload(decoded)) {
    const user = await repository.get(decoded.id);
    return user;
  }
  throw new Error("Invalid token payload");
}

const middleware = (app: express.Application) => {
  app.use(express.json());
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).send("Something broke!");
  });
};

export function isSignInMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if(!token) {
        return res.status(401).json({ error: "You must be sign in for do this." });
      }

      const decoded = jwt.verify(token, secretKey) as JWTPayload;
      const user = await repository.get(decoded.id);
      if(!user) {
        return res.status(401).json({ error: "You must be sign in for do this." });
      }

      next();
    }
    catch(err) {
      return res.status(401).json({ error: "You must be sign in for do this." });
    }
  };
}

export function authorisationMiddleware(roles: Array<UserRole>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    const user = await getUserByToken(token as string);
    if(!roles.includes(user.role)) {
      return res.status(401).json({ error: "You are not authorized for this." });
    }

    next();
  };
}

export default middleware;
