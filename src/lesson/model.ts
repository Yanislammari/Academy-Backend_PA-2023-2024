import joi from 'joi';

export interface Lesson {
	id: number,
	title: string,
	number: number,
	video: string,
	description: string
}

export const lessonSchema = joi.object<Lesson>({
	title: joi.string().required(),
	number: joi.number().required(),
	video: joi.string().uri(),
	description: joi.string().required()
});
