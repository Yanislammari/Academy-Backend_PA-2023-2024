import joi from 'joi'

export interface Password {
	hash: string;
	salt: string;
}

export interface User {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	profilePicture?: string;
	password: Password;
	role: UserRole;
}

export enum UserRole {
	Teacher = "Teacher",
	Student = "Student",
	Admin = "Admin"
}

export const userSchema = joi.object<User>({
	id: joi.number().optional(),
	firstName: joi.string().required(),
	lastName: joi.string().required(),
	email: joi.string().email().required(),
	profilePicture: joi.string().uri(),
	password: joi.string().required(),
	role: joi.string().default(UserRole.Student)
});
