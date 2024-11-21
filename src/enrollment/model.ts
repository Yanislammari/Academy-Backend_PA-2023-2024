import joi from "joi";
import { Progression } from "../progression/model";

export interface Enrollment {
	id?: string;
	studentId: string;
	courseId: string;
	enrolledDate: Date;
	status: EnrollmentStatus;
	progression: Progression
}

export enum EnrollmentStatus {
	ENROLLED = "enrolled",
	COMPLETED = "completed"
}

export const enrollmentSchema = joi.object<Enrollment>({
	id: joi.number().integer().optional(),
	studentId: joi.string().forbidden(),
	courseId: joi.string().forbidden(),
	enrolledDate: joi.date().required(),
	status: joi.string().valid(...Object.values(EnrollmentStatus)).required(),
	progression: joi.object<Progression>().required()
});
