import Joi from "joi";

export const transactionCreateSchema = Joi.object({
  type: Joi.string().max(20).required(),
  amount: Joi.number().precision(2).positive().required(),
  is_monthly: Joi.boolean(),
  date_transaction: Joi.date().iso(),
  name: Joi.string(),
  group_id: Joi.number().integer().required(),
  category_id: Joi.number().integer().allow(null)
});

export const transactionUpdateSchema = Joi.object({
  type: Joi.string().max(20),
  amount: Joi.number().precision(2).positive(),
  is_monthly: Joi.boolean(),
  date_transaction: Joi.date().iso(),
  name: Joi.string(),
  group_id: Joi.number().integer(),
  category_id: Joi.number().integer().allow(null)
}).min(1);