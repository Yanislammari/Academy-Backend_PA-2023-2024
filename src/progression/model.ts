import joi from "joi";

export interface Progression {
  lessonsFinish: String[],
  exercicesSuccess: String[],
  attempts: number
}

export const progressionSchema = joi.object<Progression>({
  lessonsFinish: joi.array().items(joi.string()).optional(),
  exercicesSuccess: joi.array().items(joi.string()).optional(),
  attempts: joi.number().default(0)
});
