import joi from 'joi';
import { Request, Response } from 'express';
import { Enrollment, EnrollmentStatus } from "./model";
import { Progression } from '../progression/model';
import enrollmentRepository from './repository';

export async function getEnrollments(req: Request, res: Response) {
  try {
    const enrollments = await enrollmentRepository.getAll();
    return res.status(200).json({ enrollments });
  } 
  catch(err) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getStudentEnrollements(req: Request, res: Response) {
  try {
    const enrollments = await enrollmentRepository.getAllByStudentId(req.params.studentId);
    return res.status(200).json({ enrollments });
  } 
  catch(err) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function enrollCourse(req: Request, res: Response) {
  try {
    if(await enrollmentRepository.getByCourseIdAndStudentId(req.params.courseId, req.params.studentId) != null) {
      return res.status(409).json({ error: "Student is already enrolled in this course" })
    }

    const progression: Progression = {
      lessonsFinish: [],
      exercicesSuccess: [],
      attempts: 0
    };

    const enrollmentData: Enrollment = {
      studentId: req.params.studentId,
      courseId: req.params.courseId,
      enrolledDate: new Date(),
      status: EnrollmentStatus.ENROLLED,
      progression: progression
    };

    const enrolledEnrollment = await enrollmentRepository.add(enrollmentData);
    return res.status(201).json({ enrollment: enrolledEnrollment });
  } 
  catch(err) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function addLessonFinish(req: Request, res: Response) {
  try {
    const lessonsIdFinish = await enrollmentRepository.getLessonsIdOfAnProgressionEnrollment(req.params.enrollmentId);
    if(lessonsIdFinish.includes(req.params.lessonId)) {
      return res.status(400).json({ error: "Lesson already finished" });
    }

    const enrollmentId = req.params.enrollmentId;
    const lessonId = req.params.lessonId;
    const enrollment = await enrollmentRepository.addLessonFinish(enrollmentId, lessonId);
    return res.status(201).json({ enrollment });
  } 
  catch(err) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function addExercisesSuccess(req: Request, res: Response) {
  try {
    const schema = joi.object({
      exercisesId: joi.array().items(joi.string()).required()
    });

    const { error, value } = schema.validate(req.body);
    if(error){
      return res.status(400).json({ error: error.details[0].message });
    }

    const enrollmentId = req.params.enrollmentId;
    const exercisesId = value.exercisesId;
    const enrollment = await enrollmentRepository.setExercisesSucess(enrollmentId, exercisesId);
    return res.status(200).json({ enrollment });
  } 
  catch(err) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteEnrollment(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await enrollmentRepository.deleteOne(id);
    return res.status(200).json({ message: "Enrollment deleted successfully" });
  }
  catch(err) {
    return res.status(500).json({ error: "Internal server error" });
  }
}
