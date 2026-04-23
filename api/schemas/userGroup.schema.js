import Joi from "joi";

export const userGroupCreateSchema = Joi.object({
  role: Joi.string().valid("admin", "utilisateur"),
  status: Joi.string()
});

export const userGroupUpdateSchema = Joi.object({
  role: Joi.string().valid("admin", "utilisateur"),
  status: Joi.string()
}).min(1);
