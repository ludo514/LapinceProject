import Joi from "joi";

export const groupCreateSchema = Joi.object({
  name: Joi.string().max(20).required()
});

export const groupUpdateSchema = Joi.object({
  name: Joi.string().max(20).required()
});
