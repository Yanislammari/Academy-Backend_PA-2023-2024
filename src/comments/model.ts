import joi from "joi";

export interface Comment {
	id: string;
	userId: string;
	courseId: string;
	content: string;
	createdAt: Date;
}

export const commentSchema = joi.object<Comment>({
	id: joi.string().default(() => Math.floor(Math.random() * 1000000).toString()),
	userId: joi.string().required(),
	courseId: joi.string().required(),
	content: joi.string().required(),
	createdAt: joi.date().default(() => new Date())
});
