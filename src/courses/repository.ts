import mongoose from "mongoose";
import { Course, CourseLevel } from "./model";
import { Lesson } from "../lesson/model";
import { Exercise, ExerciseDifficulty, ExerciseType } from "../exercises/model";
import enrollmentRepository from "../enrollment/repository";

const LessonSchema = new mongoose.Schema({
	id: { type: Number, default: () => Math.floor(Math.random() * 1000000) },
	title: { type: String, required: true },
	number: { type: Number, required: true },
	video: { type: String, required: true },
	description: { type: String, required: true }
});

const ExerciseSchema = new mongoose.Schema({
	id: { type: Number, default: () => Math.floor(Math.random() * 1000000) },
	title: { type: String, required: true },
	description: { type: String, required: true },
	type: { type: String, enum: Object.values(ExerciseType), required: true },
	difficulty: { type: String, enum: Object.values(ExerciseDifficulty), required: true },
	options: { type: [String], default: [] },
	correctOption: { type: String },
	textWithBlanks: { type: String },
	correctAnswers: { type: [String], default: [] }
});

const CourseMongoSchema = new mongoose.Schema({
	title: String,
	imageUrl: String,
	description: String,
	lessons: [LessonSchema],
	level: { type: String, enum: Object.values(CourseLevel) },
	exercises: [ExerciseSchema],
	rating: { type: Number, min: 0, max: 5 },
	teacherID: { type: String, required: true },
	createdAt: { type: Date, default: Date.now }
});

const CourseModel = mongoose.model<Course & mongoose.Document>("courses", CourseMongoSchema);

async function getAll(): Promise<Course[]> {
	const courses = await CourseModel.find()
	return courses.map((course) => course.toObject());
}

async function get(id: string): Promise<Course> {
	const course = await CourseModel.findById(id);
	if(!course) {
		throw new Error("Course not found");
	}
	return course.toObject();
}

async function add(attributes: Course): Promise<Course> {
	const course = await new CourseModel(attributes).save();
	return course.toObject();
}

async function deleteOne(id: string): Promise<void> {
	await enrollmentRepository.deleteManyByCourseId(id);
	const result = await CourseModel.findByIdAndDelete(id);
	if(!result) {
		throw new Error("Course not found");
	}
}

async function deleteByTeacherId(teacherID: string): Promise<void> {
  await CourseModel.deleteMany({ teacherID: teacherID });
}

async function addLesson(courseId: string, lessonData: Lesson): Promise<Course> {
	const course = await CourseModel.findById(courseId);
	if(!course) {
		throw new Error("Course not found");
	}

	course.lessons.push(lessonData);
	await course.save();
	return course.toObject();
}

async function addExercise(courseId: string, exerciseData: Exercise): Promise<Course> {
	const course = await CourseModel.findById(courseId);
	if(!course) {
		throw new Error("Course not found");
	}

	course.exercises.push(exerciseData);
	await course.save();
	return course.toObject();
}

async function removeExercise(courseId: string, exerciseId: number): Promise<Course> {
	const course = await CourseModel.findById(courseId);
	if(!course) {
		throw new Error("Course not found");
	}
	const exerciseIndex = course.exercises.findIndex((exercise) => exercise.id === exerciseId);
	if(exerciseIndex === -1) {
		throw new Error("Exercise not found");
	}

	course.exercises.splice(exerciseIndex, 1);
	await course.save();
	return course.toObject();
}

async function removeLesson(courseId: string, lessonId: number): Promise<Course> {
	const course = await CourseModel.findById(courseId);
	if(!course) {
		throw new Error("Course not found");
	}
	const lessonIndex = course.lessons.findIndex((lesson) => lesson.id === lessonId);
	if(lessonIndex === -1) {
		throw new Error("Lesson not found");
	}

	course.lessons.splice(lessonIndex, 1);
	await course.save();
	return course.toObject();
}

async function put(id: string, attributes: Course): Promise<Course> {
	const newCourse = await CourseModel.findByIdAndUpdate(id, attributes, { new: true });
	if(!newCourse) {
		throw new Error("Course not found");
	}
	return newCourse.toObject();
}

export interface ICourseRepository {
	getAll: () => Promise<Course[]>;
	get: (id: string) => Promise<Course>;
	add: (attributes: Course) => Promise<Course>;
	addLesson: (courseId: string, lessonData: Lesson) => Promise<Course>;
	addExercise: (courseId: string, exerciseData: Exercise) => Promise<Course>;
	removeExercise: (courseId: string, exerciseId: number) => Promise<Course>;
	removeLesson: (courseId: string, lessonId: number) => Promise<Course>;
	deleteOne: (id: string) => Promise<void>;
	deleteByTeacherId: (teacherID: string) => Promise<void>;
	put: (id: string, attributes: Course) => Promise<Course>;
}

const courseRepository: ICourseRepository = {
	getAll,
	get,
	add,
	addLesson,
	addExercise,
	removeExercise,
	removeLesson,
	deleteOne,
	deleteByTeacherId,
	put
};

export default courseRepository;
