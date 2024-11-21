import { Request, Response } from "express";
import repository from "./repository";
import { User, userSchema } from "./model";
import bcrypt from "bcrypt";
import { uploadUser } from "../config/uploads";
import enrollmentRepository from "../enrollment/repository";
import commentRepository from "../comments/repository";
import courseRepository from "../courses/repository";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = process.env.BASE_URL;
const baseURL: string = BASE_URL as string;

export async function getUser(req: Request, res: Response) {
  try {
    const userId = req.params.id;
    const user = await repository.get(userId);
    if(!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { password, ...userWithoutPassword } = user;
    return res.status(200).json(userWithoutPassword);
  }
  catch(err) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getAllUsers(req: Request, res: Response) {
  try {
    const users = await repository.getAll();
    return res.status(200).json(users);
  }
  catch(err) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const userId = req.params.id;
    await commentRepository.deleteByUserId(userId);
    await enrollmentRepository.deleteManyByStudentId(userId);
    await courseRepository.deleteByTeacherId(userId);
    await repository.deleteOne(userId);
    res.status(200).json({ message: "User deleted successfully" });
  }
  catch(err) {
    res.status(404).json({ error: "User not found" });
  }
}

export async function putUser(req: Request, res: Response) {
  uploadUser(req, res, async (err: any) => {
    if(err) {
      return res.status(500).json({ error: "File upload error" });
    }

    try {
      const { error, value } = userSchema.validate(req.body);
      if(error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const userId = req.params.id;
      const existingUser = await repository.get(userId);
      if(!existingUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const updatedUser: User = { ...existingUser, ...value };

      if(req.body.password) {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        updatedUser.password = { hash: hashedPassword, salt };
      }
      if(req.file) {
        updatedUser.profilePicture = `${baseURL}/uploads/${req.file.filename}`;
      }

      const updated = await repository.put(userId, updatedUser);
      return res.status(200).json(updated);
    }
    catch(err) {
      return res.status(500).json({ error: "Internal server error" });
    }
  });
}
