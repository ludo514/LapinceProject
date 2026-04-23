import Joi from "joi";

export const budgetCreateSchema = Joi.object({
  amount: Joi.number().precision(2).positive().required(),
  is_monthly: Joi.boolean(),
  group_id: Joi.number().integer().required(),
  date_budget: Joi.string().isoDate(),
  name: Joi.string()
});

export const budgetUpdateSchema = Joi.object({
  amount: Joi.number().precision(2).positive(),
  is_monthly: Joi.boolean(),
  group_id: Joi.number().integer(),
  date_budget: Joi.string().isoDate(),
  name: Joi.string()
}).min(1);