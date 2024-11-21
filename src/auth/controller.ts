import { Request, Response } from "express";
import { User, UserRole, userSchema } from "../users/model";
import { Password } from "../users/model";
import repository from "../users/repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.SECRET;
const secretKey: string = SECRET_KEY as string;

const BASE_URL = process.env.BASE_URL;
const baseURL: string = BASE_URL as string;

export async function register(req: Request, res: Response) {
  try {
    if(!req.file) {
      return res.status(400).json({ error: "Profile picture is required" });
    }
    const { error, value } = userSchema.validate(req.body);
    if(error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const userData: User = value;
    const existingEmail = await repository.getByEmail(userData.email);
    if(existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const passwordData: Password = { hash: hashedPassword, salt };
    userData.password = passwordData;
    userData.role = req.body.role ? req.body.role : UserRole.Student;

    if(req.file) {
      userData.profilePicture = `${baseURL}/uploads/${req.file.filename}`;
    }

    const user = await repository.add(userData);
    return res.status(201).json(user);
  } 
  catch(err) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const user = await repository.getByEmail(email);
    if(!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const isValidPassword = await bcrypt.compare(password, user.password.hash);
    if(!isValidPassword) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role }, secretKey);
    return res.status(200).json({ token });
  }
  catch(err) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

export interface JWTPayload {
  id: string;
}

export async function decodeToken(req: Request, res: Response) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if(!token) {
      return res.status(401).json({ error: "Token not provided" });
    }

    const decoded = jwt.verify(token, secretKey) as JWTPayload;
    const user = await repository.get(decoded.id);
    return res.status(200).json(user);
  }
  catch(err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
