import Joi from "joi";

export const categoryCreateSchema = Joi.object({
  name: Joi.string().max(20).required()
});

export const categoryUpdateSchema = Joi.object({
  name: Joi.string().max(20).required()
});
