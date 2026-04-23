import Joi from "joi";

export const userCreateSchema = Joi.object({
  first_name: Joi.string().max(20).required(),
  last_name: Joi.string().max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
});

export const userUpdateSchema = Joi.object({
  first_name: Joi.string().max(20),
  last_name: Joi.string().max(20),
  email: Joi.string().email(),
  password: Joi.string().min(8)
}).min(1);
