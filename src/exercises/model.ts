import joi from "joi";

export enum ExerciseType {
	MULTIPLE_CHOICE = "multiple_choice",
	FILL_IN_THE_BLANK = "fill_in_the_blank",
}

export enum ExerciseDifficulty {
	EASY = "easy",
	MEDIUM = "medium",
	HARD = "hard"
}

export interface Exercise {
	id: number;
	title: string;
	description: string;
	type: ExerciseType;
	difficulty: ExerciseDifficulty;
	options?: string[];
	correctOption?: string;
	textWithBlanks?: string;
	correctAnswers?: string[];
}

export const exerciseSchema = joi.object<Exercise>({
	id: joi.number().default(() => Math.floor(Math.random() * 1000000)),
	title: joi.string().required(),
	description: joi.string().required(),
	type: joi.string().valid(...Object.values(ExerciseType)).required(),
	difficulty: joi.string().valid(...Object.values(ExerciseDifficulty)).required(),
	options: joi.array().items(joi.string()),
	correctOption: joi.string(),
	textWithBlanks: joi.string(),
	correctAnswers: joi.array().items(joi.string()),
});
