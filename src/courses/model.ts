import { Exercise } from "../exercises/model";
import joi from "joi";
import { Lesson } from "../lesson/model";

export interface Course {
	id: string;
	title: string;
	imageUrl: string;
	description: string;
	lessons: Lesson[];
	level: CourseLevel;
	exercises: Exercise[];
	rating: number;
	teacherID: string;
	createdAt: Date;
}

export enum CourseLevel {
	BEGINNER = "beginner",
	INTERMEDIATE = "intermediate",
	ADVANCED = "advanced"
}

export const courseSchema = joi.object<Course>({
	id: joi.string().default(() => Math.floor(Math.random() * 1000000)),
	title: joi.string().required(),
	imageUrl: joi.string().uri(),
	description: joi.string().required(),
	lessons: joi.array().items(joi.object<Lesson>()).default([]),
	level: joi.string().valid(...Object.values(CourseLevel)).required(),
	exercises: joi.array().items(joi.object<Exercise>()).default([]),
	rating: joi.number().min(0).max(5).default(0),
	teacherID: joi.string().forbidden,
	createdAt: joi.date().default(() => new Date())
});
