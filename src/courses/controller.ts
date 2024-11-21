import { Request, Response } from "express";
import { Course, courseSchema } from "./model";
import { Lesson, lessonSchema } from "../lesson/model";
import { Exercise, exerciseSchema } from "../exercises/model";
import courseRepository from "./repository";
import { uploadCourse } from "../config/uploads";
import commentRepository from "../comments/repository";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = process.env.BASE_URL;
const baseURL: string = BASE_URL as string;

export async function createCourse(req: Request, res: Response) {
  try {
    const { error, value } = courseSchema.validate(req.body);
    if(error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    if(!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    value.lessons = [];
    value.exercises = [];
    value.teacherID = req.params.teacherID;
    if(req.file) {
      value.imageUrl = `${baseURL}/uploads/${req.file.filename}`;
    }

    const courseData: Course = value;
    await courseRepository.add(courseData);
    return res.status(201).json({ course: courseData });
  }
  catch(err) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getCourses(req: Request, res: Response) {
  try {
    const courses = await courseRepository.getAll();
    return res.status(200).json({ courses });
  }
  catch(err) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getCourseById(req: Request, res: Response){
  try{
    const course = await courseRepository.get(req.params.courseId);
    if(!course) {
      return res.status(404).json({ error: "Course not found" })
    }
    return res.status(200).json({ course: course })
  }
  catch(err) {
    return res.status(500).json({ error: "Internal server error" })
  }
}

export async function addLesson(req: Request, res: Response) {
  try {
    const courseId = req.params.courseId;
    const { error, value } = lessonSchema.validate(req.body);
    if(error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const course = await courseRepository.get(courseId);
    if(!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    if(!req.file) {
      return res.status(400).json({ error: "Video file is required" });
    }

    const lessonData: Lesson = {
      id: Math.floor(Math.random() * 1000000),
      number: course.lessons.length + 1,
      title: value.title,
      description: value.description,
      video: `${baseURL}/uploads/${req.file.filename}`
    };

    const updatedCourse = await courseRepository.addLesson(courseId, lessonData);
    return res.status(201).json({ lesson: updatedCourse.lessons[updatedCourse.lessons.length - 1] });
  }
  catch(err) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function addExercise(req: Request, res: Response) {
  try {
    const courseId = req.params.courseId;
    const { error, value } = exerciseSchema.validate(req.body);
    if(error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const exerciseData: Exercise = value;
    const course = await courseRepository.get(courseId);
    if(!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const updatedCourse = await courseRepository.addExercise(courseId, exerciseData);
    return res.status(201).json({ exercise: updatedCourse.exercises[updatedCourse.exercises.length - 1] });
  }
  catch(err) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteCourse(req: Request, res: Response) {
  try {
    const courseId = req.params.courseId;
    await commentRepository.deleteByCourseId(courseId);
    await courseRepository.deleteOne(courseId);
    res.status(200).json({ message: "Course deleted successfully" });
  }
  catch(err) {
    res.status(404).json({ error: "Course not found" });
  }
}

export async function removeExercise(req: Request, res: Response) {
  try {
    const courseId = req.params.courseId;
    const exerciseId = parseInt(req.params.exerciseId);
    const course = await courseRepository.get(courseId);
    if(!course) {
      return res.status(404).json({ error: "Course or exercise not found" });
    }

    await courseRepository.removeExercise(courseId, exerciseId);
    res.status(200).json({ message: "Exercise removed successfully" });
  }
  catch(err) {
    res.status(404).json({ error: "Course not found" });
  }
}

export async function removeLesson(req: Request, res: Response) {
  try {
    const courseId = req.params.courseId;
    const lessonId = parseInt(req.params.lessonId);
    const course = await courseRepository.get(courseId);
    if(!course) {
      return res.status(404).json({ error: "Course or lesson not found" });
    }

    await courseRepository.removeLesson(courseId, lessonId);
    res.status(200).json({ message: "Lesson removed successfully" });
  } 
  catch(err) {
    res.status(404).json({ error: "Course not found" });
  }
}

export async function updateCourse(req: Request, res: Response) {
  uploadCourse(req, res, async (err) => {
    if(err) {
      return res.status(500).json({ error: "File upload error" });
    }
    
    try {
      const courseId = req.params.courseId;
      const { error, value } = courseSchema.validate(req.body);
      if(error) {
          return res.status(400).json({ error: error.details[0].message });
      }
      const existingCourse = await courseRepository.get(courseId);
      if(!existingCourse) {
          return res.status(404).json({ error: "Course not found" });
      }
      if(req.file) {
          value.imageUrl = `${baseURL}/uploads/${req.file.filename}`;
      }

      const updatedCourse = await courseRepository.put(courseId, value);
      return res.status(200).json({ course: updatedCourse });
    } 
    catch(err) {
      return res.status(500).json({ error: "Internal server error" });
    }
  });
}

export async function updateLesson(req: Request, res: Response) {
  try {
    const courseId = req.params.courseId;
    const lessonId = parseInt(req.params.lessonId);
    const { error, value } = lessonSchema.validate(req.body);
    if(error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const course = await courseRepository.get(courseId);
    if(!course) {
        return res.status(404).json({ error: "Course not found" });
    }
    const lessonIndex = course.lessons.findIndex((lesson) => lesson.id === lessonId);
    if(lessonIndex === -1) {
        return res.status(404).json({ error: "Lesson not found" });
    }

    const updatedLesson = course.lessons[lessonIndex];
    if(value.title) {
        updatedLesson.title = value.title;
    }
    if(value.description) {
        updatedLesson.description = value.description;
    }
    if(req.file) {
        updatedLesson.video = `${baseURL}/uploads/${req.file.filename}`;
    }

    course.lessons[lessonIndex] = updatedLesson;
    await courseRepository.put(courseId, course);
    return res.status(200).json({ lesson: updatedLesson });
  }
  catch(err) {
    return res.status(500).json({ error: "Internal server error" });
  }
}
