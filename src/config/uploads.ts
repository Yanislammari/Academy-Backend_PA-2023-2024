import multer from "multer";
import path from "path";
import { Request } from "express";

const storageConfig = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: (req: Request, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

export const uploadUser = multer({ storage: storageConfig }).single("profilePicture");
export const uploadCourse = multer({ storage: storageConfig }).single("imageUrl");
export const uploadLesson = multer({ storage: storageConfig }).single("video");
